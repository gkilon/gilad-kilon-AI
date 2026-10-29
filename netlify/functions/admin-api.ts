import type { Handler } from "@netlify/functions";
import { createSign, timingSafeEqual } from "node:crypto";

const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY", "Referrer-Policy": "strict-origin-when-cross-origin" };
const reply = (statusCode: number, data: unknown) => ({ statusCode, headers, body: JSON.stringify(data) });
const safeEqual = (a: string, b: string) => { const aa = Buffer.from(a), bb = Buffer.from(b); return aa.length === bb.length && timingSafeEqual(aa, bb); };
const rates = new Map<string, number[]>();
function rateOk(key: string) {
  const now = Date.now(), recent = (rates.get(key) || []).filter(t => now - t < 60_000);
  if (recent.length >= 8) { rates.set(key, recent); return false; }
  recent.push(now); rates.set(key, recent);
  if (rates.size > 3000) for (const [k,v] of rates) if (!v.some(t => now-t < 60_000)) rates.delete(k);
  return true;
}
function b64url(value: string | Buffer) { return Buffer.from(value).toString("base64url"); }
async function firestoreAccessToken(account: any) {
  const now = Math.floor(Date.now()/1000);
  const head = b64url(JSON.stringify({alg:"RS256",typ:"JWT"}));
  const claim = b64url(JSON.stringify({iss:account.client_email,scope:"https://www.googleapis.com/auth/datastore",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600}));
  const unsigned = head+"."+claim, signer = createSign("RSA-SHA256");
  signer.update(unsigned); signer.end();
  const assertion = unsigned+"."+signer.sign(account.private_key).toString("base64url");
  const response = await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion}),signal:AbortSignal.timeout(8000)});
  if(!response.ok) throw new Error("Firestore authentication failed");
  return (await response.json()).access_token as string;
}
async function firestoreRequest(path:string, method:string, body?:unknown) {
  const raw=process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let account:any; try { account=raw?JSON.parse(raw):null; } catch { throw new Error("Invalid service account configuration"); }
  const projectId=process.env.FIREBASE_PROJECT_ID||account?.project_id;
  if(!account?.client_email||!account?.private_key||!projectId) throw new Error("Firestore is not configured");
  if(account.project_id&&account.project_id!==projectId) throw new Error("Firebase project mismatch");
  const token=await firestoreAccessToken(account);
  const response=await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${path}`,{method,headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(10000)});
  const data=response.status===204?null:await response.json().catch(()=>null);
  if(!response.ok) throw new Error(`Firestore request failed (HTTP ${response.status})`);
  return data;
}
function encodeValue(v:any):any {
  if(v===null||v===undefined) return {nullValue:null};
  if(typeof v==="string") return {stringValue:v};
  if(typeof v==="boolean") return {booleanValue:v};
  if(typeof v==="number") return Number.isInteger(v)?{integerValue:String(v)}:{doubleValue:v};
  if(Array.isArray(v)) return {arrayValue:{values:v.map(encodeValue)}};
  if(typeof v==="object") return {mapValue:{fields:Object.fromEntries(Object.entries(v).map(([k,val])=>[k,encodeValue(val)]))}};
  return {stringValue:String(v)};
}
function decodeValue(v:any):any {
  if(!v) return null;
  if("stringValue" in v) return v.stringValue;
  if("integerValue" in v) return Number(v.integerValue);
  if("doubleValue" in v) return v.doubleValue;
  if("booleanValue" in v) return v.booleanValue;
  if("nullValue" in v) return null;
  if("arrayValue" in v) return (v.arrayValue.values||[]).map(decodeValue);
  if("mapValue" in v) return Object.fromEntries(Object.entries(v.mapValue.fields||{}).map(([k,val])=>[k,decodeValue(val)]));
  if("timestampValue" in v) return v.timestampValue;
  return null;
}
const fromDocument=(d:any)=>Object.fromEntries(Object.entries(d.fields||{}).map(([k,v])=>[k,decodeValue(v)]));
const expectedToken=()=>process.env.CONTACT_ADMIN_TOKEN||"";
export const handler:Handler=async event=>{
  if(event.httpMethod==="OPTIONS") return {statusCode:204,headers:{...headers,"Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type, x-contact-admin-token"},body:""};
  if(event.httpMethod!=="GET"&&event.httpMethod!=="POST") return reply(405,{error:"Method not allowed"});
  const ip=event.headers["x-nf-client-connection-ip"]||event.headers["client-ip"]||"unknown";
  if(!rateOk(ip)) return reply(429,{error:"יותר מדי ניסיונות. נסו שוב בעוד דקה."});
  let payload:any={};
  if(event.httpMethod==="POST") {
    if(!event.body||Buffer.byteLength(event.body,"utf8")>300_000) return reply(413,{error:"הבקשה גדולה מדי"});
    try{payload=JSON.parse(event.body);}catch{return reply(400,{error:"בקשה לא תקינה"});}
  }
  const expected=expectedToken(), supplied=event.headers["x-contact-admin-token"]||"";
  if(!expected) return reply(503,{error:"קוד הניהול לא מוגדר ב-Netlify (CONTACT_ADMIN_TOKEN)"});
  if(payload.action==="login"&&event.httpMethod==="POST") {
    if(!supplied||!safeEqual(supplied,expected)) return reply(401,{error:"קוד הניהול שגוי"});
    return reply(200,{success:true});
  }
  if(!supplied||!safeEqual(supplied,expected)) return reply(401,{error:"נדרשת התחברות מנהל"});
  try {
    if(event.httpMethod==="GET") {
      const data=await firestoreRequest("websiteContacts?pageSize=100&orderBy=createdAt%20desc","GET");
      return reply(200,{contacts:(data?.documents||[]).map((d:any)=>{const x=fromDocument(d);return {...x,id:d.name.split("/").pop()};})});
    }
    if(payload.action==="save-config") {
      if(!payload.config||typeof payload.config!=="object"||Array.isArray(payload.config)) return reply(400,{error:"הגדרות לא תקינות"});
      await firestoreRequest("system/config","PATCH",{fields:Object.fromEntries(Object.entries(payload.config).map(([k,v])=>[k,encodeValue(v)]))});
      return reply(200,{success:true});
    }
    return reply(400,{error:"פעולה לא מוכרת"});
  } catch(error) {
    console.error("[admin-api] Request failed:",error instanceof Error?error.message:"Unknown error");
    return reply(500,{error:"הפעולה נכשלה. בדקו את הגדרות המערכת."});
  }
};
