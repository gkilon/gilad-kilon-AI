
import { GoogleGenAI, Type } from "@google/genai";
import { WoopStep, WoopData, AiFeedback, CommStyleResult, ProjectChange, TeamSynergyPulse, Task } from "./types";

const SYSTEM_INSTRUCTION = `
אתה העוזר האסטרטגי הדיגיטלי של גלעד קילון. 
תפקידך לסייע למנהלים ליישם את המתודולוגיה של גלעד: "~~מדברים~~ עושים AI בפיתוח ארגוני".
אתה מומחה באבחון צרכים ניהוליים, ניתוח דאטה צוותי והכוונת המשתמש לפעולות פרקטיות.
`;

export const getToolRecommendation = async (userInput: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
המשתמש משתף מה מעסיק אותו: "${userInput}".
יש לנו את המודולות הבאות במערכת:
1. dashboard: ניהול שינוי אסטרטגי (WOOP)
2. tasks: ניהול משימות שוטפות
3. executive: פיתוח הנהלה
4. synergy: השתתפות בצוות
5. communication: DNA תקשורת
6. feedback360: משוב 360
7. ideas: מעבדת רעיונות

החזר תשובה בפורמט JSON עם מזהה המודולה, הסבר קצר (2-3 משפטים) בגובה העיניים ומחויב לשינוי.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
              },
              required: ["moduleId", "explanation", "title"]
            }
          }
        },
        required: ["recommendations"]
      }
    }
  });
  return JSON.parse(response.text || '{"recommendations": []}');
};

export const suggestTasksForWoop = async (woop: WoopData): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
  על בסיס מודל ה-WOOP הבא, צור רשימה של 4-5 משימות אופרטיביות קונקרטיות לביצוע מיידי:
  Wish: ${woop.wish}
  Outcome: ${woop.outcome}
  Obstacle: ${woop.obstacle}
  Plan: ${woop.plan}
  
  החזר רק מערך של מחרוזות (המשימות).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "אתה מנהל תפעול חד ומהיר. הפוך אסטרטגיה למשימות.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return ["להתחיל במימוש שלב ה-Plan", "שיחת עדכון עם הצוות", "קביעת מדדי הצלחה"];
  }
};

export const getCollaborativeFeedback = async (step: WoopStep, currentData: Partial<WoopData>): Promise<AiFeedback> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `נתח את שלב ${step} ב-WOOP עבור: "${currentData[step.toLowerCase() as keyof WoopData]}". החזר ניתוח אסטרטגי.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
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
        },
        required: ["score", "analysis", "refinedText", "clarifyingQuestion", "isReady"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const processIdea = async (content: string, projects: ProjectChange[], isAudio: boolean = false) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const projectsContext = projects.map(p => `ID: ${p.id}, Title: ${p.title}, Wish: ${p.woop.wish}`).join(' | ');
  const prompt = `נתח את הרעיון הבא: "${content}". צור כותרת, סיווג, סיכום ו-3 צעדים. בדוק התאמה לפרויקטים: [${projectsContext}].`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
        },
        required: ["title", "category", "summary", "nextSteps", "priority"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getSynergyInsight = async (avgScores: any, vibes: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
נתח את מצב הצוות על בסיס נתוני Pulse:
ממוצעים (סולם 1-6):
Ownership: ${avgScores.ownership}
Role Clarity: ${avgScores.roleClarity}
Routines: ${avgScores.routines}
Communication: ${avgScores.communication}
Commitment: ${avgScores.commitment}
Respect: ${avgScores.respect}

תגובות מילוליות מהשטח: "${vibes.join(' | ')}"

כתוב ניתוח קצר מאוד (עד 4-5 משפטים סה"כ) בפורמט הבא:
1. חוזקה מרכזית: (מה הכי גבוה ומה המשמעות)
2. נקודת תורפה: (מה הכי נמוך ואיזה סיכון זה מייצר)
3. שורה תחתונה ניהולית: (פעולה אחת פרקטית לביצוע)
`;
  
  const response = await ai.models.generateContent({ 
    model: 'gemini-3-flash-preview', 
    contents: prompt, 
    config: { systemInstruction: SYSTEM_INSTRUCTION } 
  });
  return response.text || "";
};

export const analyzeExecutiveStrategy = async (title: string, description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `בצע Stress Test למהלך: "${title} - ${description}".`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { 
      systemInstruction: SYSTEM_INSTRUCTION, 
      responseMimeType: "application/json",
      responseSchema: { 
        type: Type.OBJECT, 
        properties: { 
          risks: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          alignmentGaps: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          criticalQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          recommendation: { type: Type.STRING } 
        },
        required: ["risks", "alignmentGaps", "criticalQuestions", "recommendation"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeCommStyle = async (answers: Record<string, number>): Promise<CommStyleResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `נתח סגנון תקשורת: ${JSON.stringify(answers)}`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { 
      systemInstruction: SYSTEM_INSTRUCTION, 
      responseMimeType: "application/json",
      responseSchema: { 
        type: Type.OBJECT, 
        properties: { 
          style: { type: Type.STRING }, 
          characteristics: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          howToCommunicateWithMe: { type: Type.STRING } 
        },
        required: ["style", "characteristics", "strengths", "growthAreas", "howToCommunicateWithMe"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyze360Feedback = async (self: string, peers: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `בצע סינתזה של משוב 360: ${self} | ${JSON.stringify(peers)}`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { 
      systemInstruction: SYSTEM_INSTRUCTION, 
      responseMimeType: "application/json",
      responseSchema: { 
        type: Type.OBJECT, 
        properties: { 
          blindSpots: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          superpowers: { type: Type.ARRAY, items: { type: Type.STRING } }, 
          actionPlan: { type: Type.STRING } 
        },
        required: ["blindSpots", "superpowers", "actionPlan"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
