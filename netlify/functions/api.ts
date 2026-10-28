import type { Handler } from "@netlify/functions";

const MODEL = "gemini-3.8-flash";
const MAX_BODY_BYTES = 20_000;
const RATE_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const rateLimits = new Map<string, number[]>();

const ALLOWED_ORIGINS = new Set([
  "https://kilon-consulting.com",
  "https://www.kilon-consulting.com",
  "https://deploy-preview-3--celadon-sprinkles-343fe8.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174",
]);

const securityHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const json = (statusCode: number, body: unknown, origin?: string) => ({
  statusCode,
  headers: {
    ...securityHeaders,
    ...(origin && ALLOWED_ORIGINS.has(origin)
      ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" }
      : {}),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  },
  body: JSON.stringify(body),
});

const rateLimitOk = (ip: string) => {
  const now = Date.now();
  const recent = (rateLimits.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimits.set(ip, recent);
    return false;
  }
  recent.push(now);
  rateLimits.set(ip, recent);
  if (rateLimits.size > 2_000) {
    for (const [key, values] of rateLimits) {
      if (!values.some((time) => now - time < RATE_WINDOW_MS)) rateLimits.delete(key);
    }
  }
  return true;
};

const isObject = (value: unknown): value is Record<string, any> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const boundedString = (value: unknown, max = 4_000): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= max;

const validate = (action: unknown, payload: unknown): string | null => {
  if (typeof action !== "string" || !isObject(payload)) return "Invalid request";
  switch (action) {
    case "getWoopFeedback":
      if (!["Wish", "Outcome", "Obstacle", "Plan"].includes(payload.step) ||
          !isObject(payload.currentData) ||
          JSON.stringify(payload.currentData).length > 8_000) return "Invalid WOOP data";
      return null;
    case "generateTasksFromWoop":
      return isObject(payload.woop) && JSON.stringify(payload.woop).length <= 8_000 ? null : "Invalid WOOP data";
    case "getLabRecommendation":
      return boundedString(payload.userInput, 3_000) ? null : "Invalid user input";
    case "getSynergyInsight":
      return isObject(payload.metrics) && Array.isArray(payload.vibes) &&
        payload.vibes.length <= 40 && payload.vibes.every((v: unknown) => typeof v === "string" && v.length <= 500)
        ? null : "Invalid team data";
    case "analyzeTaskMission":
      return boundedString(payload.taskText, 2_000) ? null : "Invalid task";
    case "analyzeTowsStrategy":
      return isObject(payload.tows) && JSON.stringify(payload.tows).length <= 8_000 ? null : "Invalid TOWS data";
    case "processIdea":
      return boundedString(payload.content, 4_000) && Array.isArray(payload.projects) &&
        payload.projects.length <= 100 && payload.projects.every((p: unknown) => isObject(p))
        ? null : "Invalid idea data";
    case "searchSolutions":
      return boundedString(payload.query, 3_000) ? null : "Invalid search query";
    default:
      return "Unsupported action";
  }
};

const SMART_SEARCH_SYSTEM_PROMPT = `אתה יועץ ארגוני דיגיטלי. המלץ על פתרון על סמך התהליכים שלנו.
תהליכים מרכזיים:
1. בניית צוות הנהלה: חקר העבר, אמפתיה, תמונת הצלחה, יעדים, תפקידים, נורמות ופידבק.
2. פיתוח שותפויות וממשקים: קבוצות מיקוד, יישור קו, מדדים ויעדים, שגרות עבודה וליווי צוותים.
כלים דיגיטליים: dashboard לניהול שינוי WOOP; executive ל-TOWS; synergy לדופק צוותי; tasks לניהול משימות; ideas למעבדת רעיונות; communication לתקשורת; feedback360 למשוב.
החזר JSON עם recommendedTool, reasoning ו-structure (מחרוזת).`;

async function askGemini(prompt: string, options: { json?: boolean; system?: string } = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.length < 20) throw new Error("AI provider is not configured");

  const generationConfig: Record<string, unknown> = { maxOutputTokens: 1200, thinkingConfig: { thinkingLevel: "low" } };
  if (options.json !== false) generationConfig.responseMimeType = "application/json";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        ...(options.system ? { systemInstruction: { parts: [{ text: options.system }] } } : {}),
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      }),
      signal: AbortSignal.timeout(20_000),
    }
  );
  if (!response.ok) throw new Error("AI provider request failed");
  const data = await response.json();
  const output = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim();
  if (!output) throw new Error("AI provider returned an empty response");
  return options.json === false ? output : JSON.parse(output);
}

export const handler: Handler = async (event) => {
  const origin = event.headers.origin;
  if (event.httpMethod === "OPTIONS") {
    if (!origin || !ALLOWED_ORIGINS.has(origin)) return json(403, { error: "Forbidden" });
    return {
      statusCode: 204,
      headers: {
        ...securityHeaders, "Access-Control-Allow-Origin": origin, "Vary": "Origin",
        "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
      body: "",
    };
  }
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" }, origin);
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return json(403, { error: "Forbidden" });
  if (!event.body || Buffer.byteLength(event.body, "utf8") > MAX_BODY_BYTES) return json(413, { error: "Request too large" }, origin);

  const ip = event.headers["x-nf-client-connection-ip"] || event.headers["client-ip"] || "unknown";
  if (!rateLimitOk(ip)) return json(429, { error: "Too many requests. Try again shortly." }, origin);

  let body: any;
  try { body = JSON.parse(event.body); }
  catch { return json(400, { error: "Invalid JSON" }, origin); }

  const invalid = validate(body?.action, body?.payload);
  if (invalid) return json(400, { error: invalid }, origin);
  const p = body.payload;

  try {
    let result: any;
    switch (body.action) {
      case "getWoopFeedback": {
        const stepValue = p.currentData[p.step.toLowerCase()] || "";
        result = await askGemini(`אתה יועץ ארגוני מומחה ל-WOOP. נתח את שלב ${p.step}.
הקלט: ${JSON.stringify(stepValue)}
הקשר: ${JSON.stringify(p.currentData)}
החזר JSON: {"score": מספר 1-100, "analysis": "ניתוח קצר בעברית", "refinedText": "ניסוח משופר", "clarifyingQuestion": "שאלה אחת", "isReady": boolean}.`);
        break;
      }
      case "generateTasksFromWoop": {
        const w = p.woop;
        const parsed = await askGemini(`בהתבסס על WOOP — משאלה: ${w.wish || ""}; תוצאה: ${w.outcome || ""}; מכשול: ${w.obstacle || ""}; תוכנית: ${w.plan || ""} — הצע 5 משימות קצרות ומעשיות בעברית. החזר JSON עם מפתח tasks המכיל מערך מחרוזות.`);
        result = Array.isArray(parsed.tasks) ? parsed.tasks.slice(0, 5) : [];
        break;
      }
      case "getLabRecommendation":
        result = await askGemini(`נתח את הצורך והמלץ על כלי מעבדה אחד או שניים. משתמש: ${p.userInput}
הכלים: dashboard, executive, synergy, tasks, ideas, communication, feedback360.
החזר JSON עם explanation (משפט בעברית) ו-recommendedToolIds (מערך של מזהי כלים בלבד).`);
        break;
      case "getSynergyInsight": {
        const metrics = Object.entries(p.metrics).filter(([key]) => key !== "count").map(([key, val]) => `${key}: ${String(val).slice(0, 40)}/6`).join(", ");
        result = await askGemini(`נתח את מצב הצוות: ${metrics}. תגובות: ${p.vibes.join("\\n")}. תן תובנה אסטרטגית והמלצה אחת פשוטה בעברית. סגנון: Simple. Deep. Real.`, { json: false });
        break;
      }
      case "analyzeTaskMission":
        result = await askGemini(`נתח את המשימה: ${p.taskText}. החזר JSON עם subtasks (מערך), priority (low/medium/high), managerTip וטיפ quickWin.`);
        break;
      case "analyzeTowsStrategy": {
        const t = p.tows;
        result = await askGemini(`בצע ניתוח TOWS אסטרטגי עבור: ${t.title || ""}.
חוזקות: ${JSON.stringify(t.strengths || [])}; חולשות: ${JSON.stringify(t.weaknesses || [])}; הזדמנויות: ${JSON.stringify(t.opportunities || [])}; איומים: ${JSON.stringify(t.threats || [])}.
החזר JSON עם strategiesSO, strategiesST, strategiesWO, strategiesWT (מערכים) ו-executiveSummary בעברית.`);
        break;
      }
      case "processIdea": {
        const projects = p.projects.map((project: any) => ({ id: String(project.id || "").slice(0, 100), title: String(project.title || "").slice(0, 200) }));
        result = await askGemini(`נתח רעיון (${p.isAudio ? "קולי" : "טקסט"}): ${p.content}.
פרויקטים קיימים: ${JSON.stringify(projects)}.
החזר JSON עם title, category, summary, nextSteps (מערך), priority (low/medium/high), matchedProjectId (מזהה או null), matchingExplanation.`);
        break;
      }
      case "searchSolutions":
        result = await askGemini(p.query, { system: SMART_SEARCH_SYSTEM_PROMPT });
        break;
      default:
        return json(400, { error: "Unsupported action" }, origin);
    }
    return json(200, result, origin);
  } catch (error) {
    console.error("AI request failed:", error instanceof Error ? error.message : "Unknown error");
    const configured = !!process.env.GEMINI_API_KEY;
    return json(configured ? 502 : 503, {
      error: configured ? "הניתוח נכשל. נסה שוב בעוד כמה רגעים." : "שירות ה-AI עדיין לא הוגדר בשרת.",
    }, origin);
  }
};
