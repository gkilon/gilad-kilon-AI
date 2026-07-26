import { Handler } from "@netlify/functions";
import Groq from "groq-sdk";

// Enhanced rate limiter with sliding window
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;
const ipRequestCounts = new Map<string, { count: number; timestamp: number; requests: number[] }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = ipRequestCounts.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
    ipRequestCounts.set(ip, { count: 1, timestamp: now, requests: [now] });
    return true;
  }

  // Sliding window: remove requests outside the window
  record.requests = record.requests.filter((time: number) => now - time < RATE_LIMIT_WINDOW_MS);
  
  if (record.requests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.requests.push(now);
  record.count = record.requests.length;
  return true;
};

// Input validation and sanitization
const validateInput = (action: string, payload: any): { valid: boolean; error?: string } => {
  if (!action || typeof action !== 'string') {
    return { valid: false, error: 'Invalid action' };
  }

  const allowedActions = [
    'getWoopFeedback', 'generateTasksFromWoop', 'getLabRecommendation',
    'getSynergyInsight', 'analyzeTaskMission', 'analyzeTowsStrategy',
    'processIdea', 'searchSolutions'
  ];

  if (!allowedActions.includes(action)) {
    return { valid: false, error: 'Unauthorized action' };
  }

  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Invalid payload' };
  }

  // Sanitize string inputs to prevent injection attacks
  const sanitizeString = (str: string): string => {
    if (typeof str !== 'string') return '';
    return str.trim().slice(0, 10000); // Limit length
  };

  // Sanitize payload based on action
  if (payload.userInput) payload.userInput = sanitizeString(payload.userInput);
  if (payload.taskText) payload.taskText = sanitizeString(payload.taskText);
  if (payload.query) payload.query = sanitizeString(payload.query);

  return { valid: true };
};

// API Key validation
const validateApiKey = (): boolean => {
  const apiKey = process.env.GROQ_API_KEY || process.env.API_KEY;
  if (!apiKey || apiKey === 'missing_key' || apiKey.length < 10) {
    return false;
  }
  return true;
};

// System Prompt for Smart Search based on methods.doc
const SMART_SEARCH_SYSTEM_PROMPT = `
אתה יועץ ארגוני דיגיטלי (AI). המטרה שלך היא להמליץ למשתמש על אחד מהפתרונות (הכלים/תהליכים) שאנחנו מציעים, על סמך מה שהוא מחפש.
התהליכים המרכזיים שלנו מבוססים על בניית צוותי הנהלה וניהול שותפויות:
1. בניית צוות הנהלה ("Team Building"): תהליך של יומיים הכולל תרגיל "ציר זמן" לחקר העבר, תרגיל "ארצות" לבניית אמפתיה, הגדרת תמונת הצלחה לעתיד, זיהוי "אבנים גדולות", הגדרת תפקידים, בניית נורמות וסבב פידבק.
2. פיתוח שותפויות וממשקים ("Partnerships"): תהליך הכולל קבוצות מיקוד, סדנת צוות ניהולי ליישור קו על תפיסת שותפויות, הגדרת מדדים ויעדים, בניית מנגנונים לשגרות עבודה, וליווי צוותי עבודה לשיפור שותפויות.

כלים דיגיטליים במעבדה (The Lab):
- dashboard: לניהול שינוי (WOOP)
- executive: לפורום הנהלה (TOWS)
- synergy: לדופק צוותי (Pulse)
- tasks: לניהול משימות
- ideas: למעבדת רעיונות
- communication: לתקשורת פנים-ארגונית (DNA)
- feedback360: למשוב והערכה

על סמך בקשת המשתמש, החזר אובייקט JSON הכולל:
- "recommendedTool": שם הכלי או התהליך המומלץ ביותר.
- "reasoning": הסבר קצר (בעברית) למה זה מתאים לו.
- "structure": פירוט קצר של המבנה או השלבים של הפתרון המוצע (חובה להחזיר כמחרוזת טקסט יחידה ולא כאובייקט או מערך).
`;

let groqInstance: Groq | null = null;
const getGroq = () => {
  if (!groqInstance) {
    groqInstance = new Groq({
      apiKey: process.env.GROQ_API_KEY || process.env.API_KEY || "missing_key", // fallback so it doesn't crash on load
    });
  }
  return groqInstance;
};

export const handler: Handler = async (event, context) => {
  // CORS Headers with stricter security
  const headers = {
    "Access-Control-Allow-Origin": "*", // Consider restricting to specific domains in production
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  // API Key validation
  if (!validateApiKey()) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server configuration error" }),
    };
  }

  // Rate Limiting
  const clientIp = event.headers["x-nf-client-connection-ip"] || event.headers["client-ip"] || "unknown";
  if (!checkRateLimit(clientIp)) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: "Too Many Requests" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { action, payload } = body;

    // Input validation
    const validation = validateInput(action, payload);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: validation.error || "Invalid request" }),
      };
    }

    const groq = getGroq();

    let responseData: any = {};

    switch (action) {
      case "getWoopFeedback": {
        const { step, currentData } = payload;
        const stepValue = currentData[step.toLowerCase()] || "";
        const prompt = `אתה סוכן AI מומחה לייעוץ ארגוני המשתמש במודל ה-WOOP.
נתח את שלב ה-${step} של המשתמש.
הקלט: "${stepValue}"
הקשר: ${JSON.stringify(currentData)}

החזר JSON (חובה להקפיד שזה JSON חוקי) הכולל:
{
  "score": מספר (1-100),
  "analysis": "ניתוח קצר ומקצועי בעברית",
  "refinedText": "הצעה לניסוח מלוטש",
  "clarifyingQuestion": "שאלה אחת מעוררת מחשבה",
  "isReady": boolean
}`;
        
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          temperature: 0.5,
        });
        responseData = JSON.parse(completion.choices[0].message.content || "{}");
        break;
      }

      case "generateTasksFromWoop": {
        const { woop } = payload;
        const prompt = `בהתבסס על ה-WOOP (משאלה: ${woop.wish}, תוצאה: ${woop.outcome}, מכשול: ${woop.obstacle}, תוכנית: ${woop.plan}), גזור 5 משימות אופרטיביות קונקרטיות וקצרות בעברית.
החזר JSON עם מפתח "tasks" המכיל מערך של מחרוזות.`;
        
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          temperature: 0.5,
        });
        const parsed = JSON.parse(completion.choices[0].message.content || '{"tasks":[]}');
        responseData = parsed.tasks || [];
        break;
      }

      case "getLabRecommendation": {
        const { userInput } = payload;
        const prompt = `המטרה: לנתח את מצוקת המשתמש ולהמליץ על כלים ב-The Lab.
המשתמש: "${userInput}"
כלים: dashboard, executive, synergy, tasks, ideas, communication, feedback360
החזר JSON:
{
  "explanation": "משפט אחד בעברית",
  "recommendedToolIds": ["tool1", "tool2"]
}`;
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.1-8b-instant",
          response_format: { type: "json_object" },
        });
        responseData = JSON.parse(completion.choices[0].message.content || "{}");
        break;
      }

      case "getSynergyInsight": {
        const { metrics, vibes } = payload;
        const metricsSummary = Object.entries(metrics)
          .filter(([key]) => key !== 'count')
          .map(([key, val]) => `${key}: ${val}/6`)
          .join(', ');
        const prompt = `נתח את מצב הצוות: ${metricsSummary}. תגובות: ${vibes.join('\n')}. תן תובנה אסטרטגית והמלצה אחת פשוטה בעברית. סיגנון: Simple. Deep. Real.`;
        
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
        });
        responseData = completion.choices[0].message.content;
        break;
      }

      case "analyzeTaskMission": {
        const { taskText } = payload;
        const prompt = `נתח את המשימה: "${taskText}". פרק לתת-משימות וספק טיפ ניהולי.
החזר JSON:
{
  "subtasks": ["m1", "m2"],
  "priority": "low" או "medium" או "high",
  "managerTip": "טיפ ניהולי קצר",
  "quickWin": "התחל עכשיו"
}`;
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.1-8b-instant",
          response_format: { type: "json_object" },
        });
        responseData = JSON.parse(completion.choices[0].message.content || "{}");
        break;
      }

      case "analyzeTowsStrategy": {
        const { tows } = payload;
        const prompt = `בצע ניתוח TOWS אסטרטגי עבור: ${tows.title}.
חוזקות: ${tows.strengths?.join(', ')}
חולשות: ${tows.weaknesses?.join(', ')}
הזדמנויות: ${tows.opportunities?.join(', ')}
איומים: ${tows.threats?.join(', ')}
החזר JSON:
{
  "strategiesSO": ["s1", "s2"],
  "strategiesST": ["s1", "s2"],
  "strategiesWO": ["s1", "s2"],
  "strategiesWT": ["s1", "s2"],
  "executiveSummary": "תקציר מנהלים אסטרטגי בעברית"
}`;
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
        });
        responseData = JSON.parse(completion.choices[0].message.content || "{}");
        break;
      }

      case "processIdea": {
        const { content, projects, isAudio } = payload;
        const projectContext = projects.map((p: any) => ({ id: p.id, title: p.title }));
        const prompt = `נתח רעיון (${isAudio ? 'קולי' : 'טקסט'}): "${content}". 
פרויקטים קיימים: ${JSON.stringify(projectContext)}.
החזר JSON:
{
  "title": "כותרת קצרה",
  "category": "קטגוריה",
  "summary": "תקציר",
  "nextSteps": ["c1", "c2"],
  "priority": "high",
  "matchedProjectId": "id or null",
  "matchingExplanation": "הסבר ההתאמה או למה לא נמצאה"
}`;
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.1-8b-instant",
          response_format: { type: "json_object" },
        });
        responseData = JSON.parse(completion.choices[0].message.content || "{}");
        break;
      }

      case "searchSolutions": {
        const { query } = payload;
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: SMART_SEARCH_SYSTEM_PROMPT },
            { role: "user", content: query }
          ],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          temperature: 0.5,
        });
        responseData = JSON.parse(completion.choices[0].message.content || "{}");
        break;
      }

      default:
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Unknown action" }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData),
    };

  } catch (error: any) {
    console.error("Function Error:", error);
    // Don't expose detailed error messages in production
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? "Internal server error" 
      : error.message;
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
