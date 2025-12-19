
import { GoogleGenAI, Type } from "@google/genai";
import { WoopStep, WoopData, AiFeedback, CommStyleResult, ProjectChange, TowsAnalysis, Task } from "./types";

const SYSTEM_INSTRUCTION = `
אתה "המצפן האסטרטגי" - העוזר הדיגיטלי הבכיר של גלעד קילון. 
תפקידך לסייע להנהלות ליישם את המודלים המתקדמים ביותר בפיתוח ארגוני.
אתה חד, ממוקד, משתמש בשפה עסקית גבוהה ומחויב לתוצאות.
בניתוח TOWS, עליך להצליב בין גורמים פנימיים (חוזקות/חולשות) לחיצוניים (הזדמנויות/איומים) כדי לייצר אסטרטגיות פעולה.
`;

// Fix: Added missing export analyzeTowsStrategy
export const analyzeTowsStrategy = async (tows: Partial<TowsAnalysis>) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
בצע ניתוח TOWS מעמיק עבור המהלך האסטרטגי: "${tows.title}".
נתונים:
חוזקות (Strengths): ${tows.strengths?.join(', ')}
חולשות (Weaknesses): ${tows.weaknesses?.join(', ')}
הזדמנויות (Opportunities): ${tows.opportunities?.join(', ')}
איומים (Threats): ${tows.threats?.join(', ')}

אנא בצע הצלבה והפק:
1. אסטרטגיות SO (צמיחה): איך להשתמש בחוזקות כדי לנצל הזדמנויות?
2. אסטרטגיות ST (הגנה): איך להשתמש בחוזקות כדי לצמצם איומים?
3. אסטרטגיות WO (שיפור): איך לתקן חולשות באמצעות הזדמנויות?
4. אסטרטגיות WT (הישרדות): איך לצמצם חולשות ולהימנע איומים?

החזר את התשובה בפורמט JSON בלבד.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
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

// Fix: Added missing export getToolRecommendation
export const getToolRecommendation = async (userInput: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
המשתמש משתף מה מעסיק אותו: "${userInput}".
יש לנו את המודולות הבאות במערכת:
1. dashboard: ניהול שינוי אסטרטגי (WOOP)
2. tasks: ניהול משימות שוטפות
3. executive: פורום הנהלה (TOWS)
4. synergy: דופק צוותי (Pulse)
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

// Fix: Added missing export suggestTasksForWoop
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

// Fix: Added missing export getCollaborativeFeedback
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

// Fix: Added missing export processIdea
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

// Fix: Added missing export getSynergyInsight
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

// Fix: Added analyzeCommStyle function to resolve import error in CommunicationDNA.tsx
export const analyzeCommStyle = async (answers: Record<string, number>): Promise<CommStyleResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
נתח את סגנון התקשורת של המשתמש על בסיס התשובות לשאלון (בסולם 1-10):
${JSON.stringify(answers)}

השאלות היו:
q1: התמקדות בתוצאה ("השורה התחתונה")
q2: חשיבות ההרמוניה והאווירה בשיחה
q3: צורך בנתונים ועובדות לפני החלטה
q4: הנעה של אחרים והתלהבות
q5: העדפת תקשורת ישירה וקצרה

החזר ניתוח מעמיק בפורמט JSON בלבד.
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

// Fix: Added analyze360Feedback function to resolve import error in Feedback360.tsx
export const analyze360Feedback = async (self: string, peers: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
בצע סינתזה של משוב 360.
משוב עצמי: "${self}"
משוב עמיתים/סביבה:
${peers.map((p, i) => `${i + 1}. ${p}`).join('\n')}

זהה נקודות עיוורון (Blind Spots), חוזקות על (Superpowers) וגבש תוכנית פעולה אינטגרטיבית (Action Plan).
החזר תשובה בפורמט JSON בלבד.
`;

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
