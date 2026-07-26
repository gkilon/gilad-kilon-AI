import { Handler } from "@netlify/functions";
import Groq from "groq-sdk";

// Secure proxy function - hides API logic and keys from client-side
// This function acts as a backend proxy to external AI services

// Rate limiting with sliding window
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;
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

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://kilon-consulting.com',
  'https://www.kilon-consulting.com',
  'http://localhost:5173',
  'http://localhost:5174'
];

const getCorsHeaders = (origin: string | undefined): Record<string, string> => {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin || '') ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin || ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };
};

// Input validation
const validateRequest = (body: any): { valid: boolean; error?: string } => {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  if (!body.action || typeof body.action !== 'string') {
    return { valid: false, error: 'Action is required' };
  }

  const allowedActions = [
    'getWoopFeedback', 'generateTasksFromWoop', 'getLabRecommendation',
    'getSynergyInsight', 'analyzeTaskMission', 'analyzeTowsStrategy',
    'processIdea', 'searchSolutions'
  ];

  if (!allowedActions.includes(body.action)) {
    return { valid: false, error: 'Unauthorized action' };
  }

  // Sanitize inputs
  const sanitizeString = (str: any): string => {
    if (typeof str !== 'string') return '';
    return str.trim().slice(0, 10000);
  };

  if (body.payload) {
    if (body.payload.userInput) body.payload.userInput = sanitizeString(body.payload.userInput);
    if (body.payload.taskText) body.payload.taskText = sanitizeString(body.payload.taskText);
    if (body.payload.query) body.payload.query = sanitizeString(body.payload.query);
  }

  return { valid: true };
};

// Initialize Groq client with server-side API key
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    throw new Error('Invalid API key configuration');
  }
  return new Groq({ apiKey });
};

// System prompts (server-side only - never exposed to client)
const SYSTEM_PROMPTS: Record<string, string> = {
  getWoopFeedback: `אתה סוכן AI מומחה לייעוץ ארגוני המשתמש במודל ה-WOOP.
נתח את שלב המשתמש והחזר JSON עם score, analysis, refinedText, clarifyingQuestion, isReady.`,
  
  generateTasksFromWoop: `בהתבסס על ה-WOOP, גזור 5 משימות אופרטיביות קונקרטיות וקצרות בעברית. החזר JSON עם מפתח "tasks".`,
  
  getLabRecommendation: `נתח את מצוקת המשתמש והמלץ על כלים ב-The Lab. החזר JSON עם explanation ו-recommendedToolIds.`,
  
  getSynergyInsight: `נתח את מצב הצוות ותן תובנה אסטרטגית והמלצה אחת פשוטה בעברית. סיגנול: Simple. Deep. Real.`,
  
  analyzeTaskMission: `נתח את המשימה, פרק לתת-משימות וספק טיפ ניהולי. החזר JSON עם subtasks, priority, managerTip, quickWin.`,
  
  analyzeTowsStrategy: `בצע ניתוח TOWS אסטרטגי. החזר JSON עם strategiesSO, strategiesST, strategiesWO, strategiesWT, executiveSummary.`,
  
  processIdea: `נתח רעיון וחבר אותו לפרויקטים קיימים. החזר JSON עם title, category, summary, nextSteps, priority, matchedProjectId, matchingExplanation.`,
  
  searchSolutions: `אתה יועץ ארגוני דיגיטלי. המלץ על פתרונות מבוסס התהליכים שלנו. החזר JSON עם recommendedTool, reasoning, structure.`
};

export const handler: Handler = async (event, context) => {
  const origin = event.headers.origin || event.headers.host;
  const headers = getCorsHeaders(origin);

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  // Rate limiting
  const clientIp = event.headers["x-nf-client-connection-ip"] || 
                   event.headers["client-ip"] || 
                   event.headers["x-forwarded-for"]?.split(',')[0] || 
                   "unknown";
  
  if (!checkRateLimit(clientIp)) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: "Too Many Requests" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    
    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: validation.error }),
      };
    }

    const { action, payload } = body;
    const groq = getGroqClient();
    const systemPrompt = SYSTEM_PROMPTS[action] || '';

    // Build prompt based on action
    let userPrompt = '';
    let model = 'llama-3.3-70b-versatile';
    let useJsonFormat = true;

    switch (action) {
      case 'getWoopFeedback':
        const { step, currentData } = payload;
        const stepValue = currentData[step.toLowerCase()] || "";
        userPrompt = `נתח את שלב ה-${step} של המשתמש. הקלט: "${stepValue}" הקשר: ${JSON.stringify(currentData)}`;
        break;
      
      case 'generateTasksFromWoop':
        const { woop } = payload;
        userPrompt = `בהתבסס על ה-WOOP (משאלה: ${woop.wish}, תוצאה: ${woop.outcome}, מכשול: ${woop.obstacle}, תוכנית: ${woop.plan}), גזור 5 משימות אופרטיביות קונקרטיות וקצרות בעברית.`;
        break;
      
      case 'getLabRecommendation':
        const { userInput } = payload;
        userPrompt = `המטרה: לנתח את מצוקת המשתמש ולהמליץ על כלים ב-The Lab. המשתמש: "${userInput}" כלים: dashboard, executive, synergy, tasks, ideas, communication, feedback360`;
        model = 'llama-3.1-8b-instant';
        break;
      
      case 'getSynergyInsight':
        const { metrics, vibes } = payload;
        const metricsSummary = Object.entries(metrics)
          .filter(([key]) => key !== 'count')
          .map(([key, val]) => `${key}: ${val}/6`)
          .join(', ');
        userPrompt = `נתח את מצב הצוות: ${metricsSummary}. תגובות: ${vibes.join('\n')}. תן תובנה אסטרטגית והמלצה אחת פשוטה בעברית. סיגנול: Simple. Deep. Real.`;
        useJsonFormat = false;
        break;
      
      case 'analyzeTaskMission':
        const { taskText } = payload;
        userPrompt = `נתח את המשימה: "${taskText}". פרק לתת-משימות וספק טיפ ניהולי.`;
        model = 'llama-3.1-8b-instant';
        break;
      
      case 'analyzeTowsStrategy':
        const { tows } = payload;
        userPrompt = `בצע ניתוח TOWS אסטרטגי עבור: ${tows.title}. חוזקות: ${tows.strengths?.join(', ')} חולשות: ${tows.weaknesses?.join(', ')} הזדמנויות: ${tows.opportunities?.join(', ')} איומים: ${tows.threats?.join(', ')}`;
        break;
      
      case 'processIdea':
        const { content, projects, isAudio } = payload;
        const projectContext = projects.map((p: any) => ({ id: p.id, title: p.title }));
        userPrompt = `נתח רעיון (${isAudio ? 'קולי' : 'טקסט'}): "${content}". פרויקטים קיימים: ${JSON.stringify(projectContext)}.`;
        model = 'llama-3.1-8b-instant';
        break;
      
      case 'searchSolutions':
        const { query } = payload;
        userPrompt = query;
        break;
      
      default:
        return { 
          statusCode: 400, 
          headers, 
          body: JSON.stringify({ error: "Unknown action" }) 
        };
    }

    // Make API call to Groq
    const messages: any[] = systemPrompt 
      ? [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }]
      : [{ role: "user", content: userPrompt }];

    const completion = await groq.chat.completions.create({
      messages,
      model,
      response_format: useJsonFormat ? { type: "json_object" } : undefined,
      temperature: 0.5,
    } as any);

    const responseContent = completion.choices[0].message.content || "{}";
    const responseData = useJsonFormat ? JSON.parse(responseContent) : responseContent;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData),
    };

  } catch (error: any) {
    console.error("Secure Proxy Error:", error);
    
    // Don't expose detailed errors in production
    const isProduction = process.env.NODE_ENV === 'production';
    const errorMessage = isProduction ? "Internal server error" : error.message;

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
