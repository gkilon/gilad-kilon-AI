
import { GoogleGenAI, Type } from "@google/genai";
import { WoopStep, WoopData, AiFeedback, CommStyleResult, ProjectChange, TeamSynergyPulse } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
אתה העוזר האסטרטגי הדיגיטלי של גלעד קילון. 
תפקידך לסייע למנהלים ליישם את המתודולוגיה של גלעד: "~~מדברים~~ עושים AI בפיתוח ארגוני".
אתה מומחה באבחון צרכים ניהוליים והכוונת המשתמש לכלי הנכון ביותר עבורו.
`;

export const getToolRecommendation = async (userInput: string) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
המשתמש משתף מה מעסיק אותו: "${userInput}".
יש לנו את המודולות הבאות במערכת:
1. dashboard: ניהול שינוי אסטרטגי (WOOP) - מתאים להגדרת מטרות גדולות, חזון וחסמים.
2. tasks: ניהול משימות שוטפות - מתאים לביצוע יומיומי, רשימות עבודה ותעדוף.
3. executive: פיתוח הנהלה - מתאים לסנכרון בין מנהלים בכירים, Stress Test להחלטות קריטיות.
4. synergy: השתתפות בצוות - מתאים לבעיות אמון, זרימת מידע ודינמיקה קבוצתית.
5. communication: DNA תקשורת - מתאים להבנת סגנונות תקשורת אישיים והתאמת תדרים.
6. feedback360: משוב 360 - מתאים לזיהוי נקודות עיוורות וקבלת תמונה שלמה על התפקוד המקצועי.
7. ideas: מעבדת רעיונות - מתאים לתיעוד הבזקי מחשבה, השראה וחיבורם להקשר רחב.

מבוסס על השיתוף של המשתמש, המלץ על המודולה (אחת או שתיים) שהכי תועיל לו כרגע.
החזר תשובה בפורמט JSON עם מזהה המודולה, הסבר קצר (2-3 משפטים) בגובה העיניים ומחויב לשינוי.
`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                moduleId: { type: Type.STRING },
                explanation: { type: Type.STRING },
                title: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '{"recommendations": []}');
};

export const getCollaborativeFeedback = async (step: WoopStep, currentData: Partial<WoopData>): Promise<AiFeedback> => {
  const model = "gemini-3-pro-preview";
  const prompt = `נתח את שלב ${step} ב-WOOP עבור: "${currentData[step.toLowerCase() as keyof WoopData]}". החזר ניתוח אסטרטגי.`;
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          analysis: { type: Type.STRING },
          refinedText: { type: Type.STRING },
          clarifyingQuestion: { type: Type.STRING },
          isReady: { type: Type.BOOLEAN }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const processIdea = async (content: string, projects: ProjectChange[], isAudio: boolean = false) => {
  const model = "gemini-3-flash-preview";
  const projectsContext = projects.map(p => `ID: ${p.id}, Title: ${p.title}, Wish: ${p.woop.wish}`).join(' | ');

  const prompt = `נתח את הרעיון הבא: "${content}". 
  צור כותרת, סיווג, סיכום ו-3 צעדים.
  בנוסף, בדוק התאמה לפרויקטים: [${projectsContext}]. 
  אם יש קשר, ציין ID והסבר איך הרעיון מקדם את המטרה הספציפית שם.`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
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
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getSynergyInsight = async (pulse: Partial<TeamSynergyPulse>) => {
  const model = "gemini-3-pro-preview";
  const prompt = `נתח השתתפות וסינרגיה בצוות לפי הפרמטרים הבאים (בסולם 1-10):
  1. Ownership (בעלות על המטרה): ${pulse.ownership}
  2. Role Clarity (בהירות תפקידים): ${pulse.roleClarity}
  3. Routines (שגרות וסדר): ${pulse.routines}
  4. Communication (תקשורת פתוחה): ${pulse.communication}
  5. Commitment (מחויבות): ${pulse.commitment}
  6. Mutual Respect (כבוד הדדי): ${pulse.respect}
  
  תיאור חופשי של המנהל: "${pulse.vibe}".
  
  תן אבחנה מקצועית חדה המשלבת את הפן האנושי והעסקי. הצע 2 פעולות קונקרטיות לשיפור ההשתתפות בצוות.`;
  
  const response = await ai.models.generateContent({ 
    model, 
    contents: prompt, 
    config: { systemInstruction: SYSTEM_INSTRUCTION } 
  });
  return response.text;
};

export const analyzeExecutiveStrategy = async (title: string, description: string) => {
  const model = "gemini-3-pro-preview";
  const prompt = `בצע Stress Test למהלך: "${title} - ${description}".`;
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION, responseMimeType: "application/json",
      responseSchema: { type: Type.OBJECT, properties: { risks: { type: Type.ARRAY, items: { type: Type.STRING } }, alignmentGaps: { type: Type.ARRAY, items: { type: Type.STRING } }, criticalQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }, recommendation: { type: Type.STRING } } }
    }
  });
  return JSON.parse(response.text);
};

export const analyzeCommStyle = async (answers: Record<string, number>): Promise<CommStyleResult> => {
  const model = "gemini-3-flash-preview";
  const prompt = `נתח סגנון תקשורת: ${JSON.stringify(answers)}`;
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION, responseMimeType: "application/json",
      responseSchema: { type: Type.OBJECT, properties: { style: { type: Type.STRING }, characteristics: { type: Type.ARRAY, items: { type: Type.STRING } }, strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } }, howToCommunicateWithMe: { type: Type.STRING } } }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyze360Feedback = async (self: string, peers: string[]) => {
  const model = "gemini-3-pro-preview";
  const prompt = `בצע סינתזה של משוב 360: ${self} | ${JSON.stringify(peers)}`;
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { systemInstruction: SYSTEM_INSTRUCTION, responseMimeType: "application/json",
      responseSchema: { type: Type.OBJECT, properties: { blindSpots: { type: Type.ARRAY, items: { type: Type.STRING } }, superpowers: { type: Type.ARRAY, items: { type: Type.STRING } }, actionPlan: { type: Type.STRING } } }
    }
  });
  return JSON.parse(response.text || '{}');
};
