import { GoogleGenAI, Type } from "@google/genai";
import { WoopStep, WoopData, AiFeedback, CommStyleResult, ProjectChange, TowsAnalysis, Task, Article } from "./types";

const getSystemInstruction = () => {
  return `
אתה "המנווט של המעבדה" עבור גלעד קילון. 
תפקידך הבלעדי: לנתח את מצוקת המשתמש ולהמליץ על הכלים הנכונים במעבדה (The Lab) שבהם תתבצע העבודה מולו.

כלים זמינים (Tool IDs):
- dashboard: ניהול שינוי WOOP (מתאים לסלילת אסטרטגיה ומהלכי שינוי)
- executive: פורום הנהלה TOWS (מתאים לחוסר סנכרון בהנהלה, אסטרטגיה)
- synergy: דופק צוותי Pulse (מתאים לממשקי עבודה, סנכרון צוותי)
- tasks: ניהול משימות (ביצוע שוטף)
- ideas: מעבדת רעיונות (תיעוד מחשבות)
- communication: DNA תקשורת (פיתוח ניהולי, ממשקים)
- feedback360: משוב 360 (פיתוח ניהולי אישי)

חוקים:
1. אל תיתן עצות ניהוליות מילוליות.
2. החזר תמיד לפחות 2 כלים רלוונטיים.
3. כתוב הסבר קצרצר (משפט אחד) למה הכלים האלו הם הדרך לפתרון במעבדה.
`;
};

export const getLabRecommendation = async (userInput: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `המשתמש אומר: "${userInput}". איזה כלים מהמעבדה יפתרו לו את זה?`,
    config: {
      systemInstruction: getSystemInstruction(),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          recommendedToolIds: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          }
        },
        required: ["explanation", "recommendedToolIds"]
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return {
      explanation: "כדי להתקדם, כדאי להשתמש בכלים הבאים במעבדה:",
      recommendedToolIds: ["dashboard", "executive"]
    };
  }
};

export const getSynergyInsight = async (metrics: any, vibes: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const metricsSummary = Object.entries(metrics)
    .filter(([key]) => key !== 'count')
    .map(([key, val]) => `${key}: ${val}/6`)
    .join(', ');

  const prompt = `נתח את מצב הצוות: ${metricsSummary}. תגובות: ${vibes.join('\n')}. תן תובנה אסטרטגית אחת והמלצה אחת פשוטה.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { systemInstruction: "Simple. Deep. Real." }
  });
  return response.text || "לא הצלחתי לגבש תובנה.";
};

export const analyzeTaskMission = async (taskText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `נתח את המשימה: "${taskText}".`,
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
};

export const analyzeTowsStrategy = async (tows: Partial<TowsAnalysis>) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `בצע ניתוח TOWS: ${tows.title}`,
    config: {
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
};

export const getCollaborativeFeedback = async (step: WoopStep, currentData: Partial<WoopData>): Promise<AiFeedback> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `נתח שלב ${step} ב-WOOP`,
    config: {
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
  return JSON.parse(response.text || '{}');
};

export const suggestTasksForWoop = async (woop: WoopData): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `משימות עבור WOOP: ${woop.wish}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  });
  return JSON.parse(response.text || "[]");
};

export const processIdea = async (content: string, projects: ProjectChange[], isAudio: boolean = false) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `נתח רעיון: ${content}`,
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
};