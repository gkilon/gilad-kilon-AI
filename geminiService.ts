import { GoogleGenAI, Type } from "@google/genai";
import { WoopStep, WoopData, AiFeedback, ProjectChange, TowsAnalysis } from "./types.ts";

/**
 * Gets strategic feedback for a specific step in the WOOP model.
 * Uses gemini-3-pro-preview for advanced strategic reasoning.
 */
export const getWoopFeedback = async (step: WoopStep, currentData: Partial<WoopData>): Promise<AiFeedback> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const stepValue = currentData[step.toLowerCase() as keyof WoopData] || "";
  
  const prompt = `אתה סוכן AI מומחה לייעוץ ארגוני המשתמש במודל ה-WOOP (Wish, Outcome, Obstacle, Plan).
  המטרה שלך היא לעזור למשתמש לזקק את המחשבות שלו ולהפוך אותן לתוכנית פעולה עוצמתית.
  
  נתח את שלב ה-${step} של המשתמש.
  הקלט של המשתמש: "${stepValue}"
  הקשר מלא: ${JSON.stringify(currentData)}
  
  החזר תגובה במבנה JSON הכולל:
  1. score: ציון עומק מחשבתי (1-100).
  2. analysis: ניתוח קצר ומקצועי בעברית של מה שהמשתמש כתב.
  3. refinedText: הצעה לניסוח מלוטש ומדויק יותר של הקלט.
  4. clarifyingQuestion: שאלה אחת מעוררת מחשבה שתעזור לו להעמיק עוד יותר.
  5. isReady: האם השלב הזה מבושל מספיק? (boolean).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            analysis: { type: Type.STRING },
            refinedText: { type: Type.STRING },
            clarifyingQuestion: { type: Type.STRING },
            isReady: { type: Type.BOOLEAN }
          },
          required: ["score", "analysis", "refinedText", "clarifyingQuestion", "isReady"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini API Error (getWoopFeedback):", error);
    throw error;
  }
};

/**
 * Generates actionable tasks based on a completed WOOP model.
 */
export const generateTasksFromWoop = async (woop: WoopData): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `בהתבסס על מודל ה-WOOP שהושלם (משאלה: ${woop.wish}, תוצאה רצויה: ${woop.outcome}, מכשול: ${woop.obstacle}, תוכנית: ${woop.plan}), גזור 5 משימות אופרטיביות קונקרטיות וקצרות בעברית.
  החזר רק מערך JSON של מחרוזות.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini API Error (generateTasksFromWoop):", error);
    return ["להתחיל ביישום התוכנית", "מעקב אחר התקדמות"];
  }
};

/**
 * Recommends tools based on a user's strategic challenge.
 */
export const getLabRecommendation = async (userInput: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `אתה "המנווט של המעבדה" עבור גלעד קילון. 
  תפקידך הבלעדי: לנתח את מצוקת המשתמש ולהמליץ על הכלים הנכונים במעבדה (The Lab) שבהם תתבצע העבודה מולו.
  
  הכלים הקיימים:
  - dashboard: ניהול שינוי WOOP
  - executive: פורום הנהלה TOWS
  - synergy: דופק צוותי Pulse
  - tasks: ניהול משימות
  - ideas: מעבדת רעיונות
  - communication: DNA תקשורת
  - feedback360: משוב 360
  
  המשתמש אומר: "${userInput}". איזה כלים מהמעבדה יפתרו לו את זה?
  החזר JSON עם: explanation (משפט אחד בעברית), recommendedToolIds (מערך של לפחות 2 מזהי כלים).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            recommendedToolIds: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["explanation", "recommendedToolIds"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return {
      explanation: "כדי להתקדם, כדאי להשתמש בכלים הבאים במעבדה:",
      recommendedToolIds: ["dashboard", "executive"]
    };
  }
};

/**
 * Generates an executive insight based on team synergy metrics.
 */
export const getSynergyInsight = async (metrics: any, vibes: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const metricsSummary = Object.entries(metrics)
    .filter(([key]) => key !== 'count')
    .map(([key, val]) => `${key}: ${val}/6`)
    .join(', ');

  const prompt = `נתח את מצב הצוות: ${metricsSummary}. תגובות הצוות: ${vibes.join('\n')}. 
  תן תובנה אסטרטגית אחת והמלצה אחת פשוטה בעברית. סיגנון: Simple. Deep. Real.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 2000 } }
    });
    return response.text || "לא הצלחתי לגבש תובנה.";
  } catch (e) {
    return "שגיאה בניתוח הנתונים.";
  }
};

/**
 * Deconstructs a task into subtasks and provides managerial insights.
 */
export const analyzeTaskMission = async (taskText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `נתח את המשימה: "${taskText}". פרק אותה לתת-משימות וספק טיפ ניהולי קצר.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: { type: Type.ARRAY, items: { type: Type.STRING } },
            priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
            managerTip: { type: Type.STRING },
            quickWin: { type: Type.STRING }
          },
          required: ["subtasks", "priority", "managerTip", "quickWin"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { subtasks: [], priority: 'medium', managerTip: 'בצע בנחישות.', quickWin: 'התחל עכשיו.' };
  }
};

/**
 * Analyzes a TOWS matrix to generate strategic options.
 */
export const analyzeTowsStrategy = async (tows: Partial<TowsAnalysis>) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `בצע ניתוח TOWS אסטרטגי עבור: ${tows.title}. 
  נתונים: 
  חוזקות: ${tows.strengths?.join(', ')}
  חולשות: ${tows.weaknesses?.join(', ')}
  הזדמנויות: ${tows.opportunities?.join(', ')}
  איומים: ${tows.threats?.join(', ')}
  
  החזר ניתוח אסטרטגי עמוק בעברית במבנה JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 8000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategiesSO: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategiesST: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategiesWO: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategiesWT: { type: Type.ARRAY, items: { type: Type.STRING } },
            executiveSummary: { type: Type.STRING }
          },
          required: ["strategiesSO", "strategiesST", "strategiesWO", "strategiesWT", "executiveSummary"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    throw e;
  }
};

/**
 * Processes a creative idea and maps it to existing projects.
 */
export const processIdea = async (content: string, projects: ProjectChange[], isAudio: boolean = false) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const projectContext = projects.map(p => ({ id: p.id, title: p.title }));
  const prompt = `נתח את הרעיון הבא (${isAudio ? 'קולי' : 'טקסט'}): "${content}". 
  נסה לקשר אותו לאחד מהפרויקטים הקיימים: ${JSON.stringify(projectContext)}.
  החזר ניתוח מלא כולל כותרת, קטגוריה וצעדים הבאים בעברית.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            summary: { type: Type.STRING },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            priority: { type: Type.STRING },
            matchedProjectId: { type: Type.STRING },
            matchingExplanation: { type: Type.STRING }
          },
          required: ["title", "category", "summary", "nextSteps", "priority"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { title: 'רעיון חדש', category: 'כללי', summary: content, nextSteps: [], priority: 'medium' };
  }
};
