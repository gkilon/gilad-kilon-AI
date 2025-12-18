import { GoogleGenAI, Type } from "@google/genai";
import { WoopStep, WoopData, AiFeedback, CommStyleResult, ProjectChange, TeamSynergyPulse } from "./types";

// Helper for system instructions
const SYSTEM_INSTRUCTION = `
אתה העוזר האסטרטגי הדיגיטלי של גלעד קילון. 
תפקידך לסייע למנהלים ליישם את המתודולוגיה של גלעד: "~~מדברים~~ עושים AI בפיתוח ארגוני".
אתה מומחה באבחון צרכים ניהוליים והכוונת המשתמש לכלי הנכון ביותר עבורו.
`;

export const getToolRecommendation = async (userInput: string) => {
  // Always use the named parameter initialization for GoogleGenAI.
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

  // Use the recommended model for basic text tasks.
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
  
  // Access .text property directly as it's a property, not a method.
  return JSON.parse(response.text || '{"recommendations": []}');
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

export const getSynergyInsight = async (pulse: Partial<TeamSynergyPulse>) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `נתח השתתפות וסינרגיה בצוות לפי הפרמטרים הבאים:
  Ownership: ${pulse.ownership}, Role Clarity: ${pulse.roleClarity}, Routines: ${pulse.routines}, 
  Comm: ${pulse.communication}, Commitment: ${pulse.commitment}, Respect: ${pulse.respect}.
  Vibe: "${pulse.vibe}".`;
  
  const response = await ai.models.generateContent({ 
    model: 'gemini-3-pro-preview', 
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
