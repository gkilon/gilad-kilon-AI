import type { Handler } from "@netlify/functions";
import { createSign, timingSafeEqual, randomUUID } from "node:crypto";

const MAX_BODY_BYTES = 12_000;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const rates = new Map<string, number[]>();
const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY", "Referrer-Policy": "strict-origin-when-cross-origin" };
const reply = (statusCode: number, data: unknown) => ({ statusCode, headers, body: JSON.stringify(data) });
const str = (v: unknown, max: number) => typeof v === "string" && v.trim().length > 0 && v.length <= max;
const safeEqual = (a: string, b: string) => {
  const aa = Buffer.from(a), bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
};
function rateOk(key: string) {
  const now = Date.now();
  const recent = (rates.get(key) || []).filter(t => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) { rates.set(key, recent); return false; }
  recent.push(now); rates.set(key, recent);
  if (rates.size > 3000) for (const [k, v] of rates) if (!v.some(t => now - t < WINDOW_MS)) rates.delete(k);
  return true;
}
function b64url(value: string | Buffer) { return Buffer.from(value).toString("base64url"); }
async function firestoreAccessToken(account: any) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({ iss: account.client_email, scope: "https://www.googleapis.com/auth/datastore", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const unsigned = head + "." + claim;
  const signer = createSign("RSA-SHA256"); signer.update(unsigned); signer.end();
  const assertion = unsigned + "." + signer.sign(account.private_key).toString("base64url");
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }), signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("Firestore authentication failed");
  return (await response.json()).access_token as string;
}
async function firestoreRequest(path: string, method: string, body?: unknown) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let account: any;
  try { account = raw ? JSON.parse(raw) : null; } catch { throw new Error("Invalid service account configuration"); }
  const projectId = process.env.FIREBASE_PROJECT_ID || account?.project_id;
  if (!account?.client_email || !account?.private_key || !projectId) throw new Error("Firestore is not configured");
  if (account.project_id && account.project_id !== projectId) throw new Error("Firebase project configuration mismatch");
  const token = await firestoreAccessToken(account);
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${path}`, {
    method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(10000)
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error("Firestore request failed");
  return data;
}
const field = (value: string | null | undefined) => ({ stringValue: value || "" });
const fromDoc = (doc: any) => {
  const f = doc.fields || {};
  return { id: doc.name.split("/").pop(), name: f.name?.stringValue || "", email: f.email?.stringValue || "", phone: f.phone?.stringValue || "", organization: f.organization?.stringValue || "", topic: f.topic?.stringValue || "", message: f.message?.stringValue || "", createdAt: f.createdAt?.timestampValue || "" };
};
async function notify(contact: ReturnType<typeof fromDoc>) {
  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_NOTIFICATION_EMAIL, from = process.env.RESEND_FROM_EMAIL;
  if (!key || !to || !from) return;
  const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], subject: `פנייה חדשה מהאתר: ${contact.topic || "פנייה כללית"}`, html: `<h2>פנייה חדשה מהאתר</h2><p><b>שם:</b> ${esc(contact.name)}</p><p><b>דוא"ל:</b> ${esc(contact.email)}</p><p><b>טלפון:</b> ${esc(contact.phone)}</p><p><b>ארגון:</b> ${esc(contact.organization)}</p><p><b>נושא:</b> ${esc(contact.topic || "פנייה כללית")}</p><p><b>הודעה:</b><br>${esc(contact.message).replace(/\n/g, "<br>")}</p>` }), signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("Resend notification failed");
}
export const handler: Handler = async event => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: { ...headers, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, x-contact-admin-token" }, body: "" };
  if (event.httpMethod !== "POST" && event.httpMethod !== "GET") return reply(405, { error: "Method not allowed" });
  const ip = event.headers["x-nf-client-connection-ip"] || event.headers["client-ip"] || "unknown";
  if (!rateOk((event.httpMethod === "GET" ? "admin:" : "form:") + ip)) return reply(429, { error: "יותר מדי ניסיונות. נסו שוב בעוד דקה." });

  if (event.httpMethod === "GET") {
    const expected = process.env.CONTACT_ADMIN_TOKEN || "", supplied = event.headers["x-contact-admin-token"] || "";
    if (expected.length < 16 || !supplied || !safeEqual(supplied, expected)) return reply(401, { error: "קוד ניהול שגוי" });
    try {
      const data = await firestoreRequest("websiteContacts?pageSize=100&orderBy=createdAt%20desc", "GET");
      return reply(200, { contacts: (data?.documents || []).map(fromDoc) });
    } catch { return reply(500, { error: "לא ניתן לטעון את הפניות. בדקו את הגדרות המערכת." }); }
  }

  if (!event.body || Buffer.byteLength(event.body, "utf8") > MAX_BODY_BYTES) return reply(413, { error: "הבקשה גדולה מדי" });
  let p: any;
  try { p = JSON.parse(event.body); } catch { return reply(400, { error: "בקשה לא תקינה" }); }
  if (typeof p.website === "string" && p.website.trim()) return reply(200, { success: true });
  if (!str(p.name, 120) || !str(p.email, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) || !str(p.message, 4000) ||
      !["phone", "organization", "topic"].every(k => p[k] === undefined || (typeof p[k] === "string" && p[k].length <= ({ phone: 40, organization: 160, topic: 160 } as any)[k]))) {
    return reply(400, { error: "נא לבדוק את הפרטים ולנסות שוב." });
  }
  const contact = { id: randomUUID(), name: p.name.trim(), email: p.email.trim(), phone: (p.phone || "").trim(), organization: (p.organization || "").trim(), topic: (p.topic || "").trim(), message: p.message.trim(), createdAt: new Date().toISOString() };
  try {
    await firestoreRequest("websiteContacts", "POST?documentId=" + encodeURIComponent(contact.id), { fields: { name: field(contact.name), email: field(contact.email), phone: field(contact.phone), organization: field(contact.organization), topic: field(contact.topic), message: field(contact.message), createdAt: { timestampValue: contact.createdAt } } });
  } catch { return reply(500, { error: "לא הצלחנו לשמור את הפנייה. נסו שוב מאוחר יותר." }); }
  let notificationSent = true;
  try { await notify(contact); } catch { notificationSent = false; }
  return reply(200, { success: true, notificationSent });
};
