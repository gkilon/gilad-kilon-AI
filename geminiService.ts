import { WoopStep, WoopData, AiFeedback, ProjectChange, TowsAnalysis } from "./types.ts";

const API_ENDPOINT = "/.netlify/functions/api";

const callServerlessApi = async (action: string, payload: any) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn("Rate limit exceeded");
      }
      let errorText = response.statusText || "Unknown Error";
      try {
        const errorBody = await response.json();
        if (errorBody && errorBody.error) errorText = errorBody.error;
      } catch (e) {
        // Fallback to text if JSON parsing fails
        try {
          const textBody = await response.text();
          if (textBody) errorText = textBody;
        } catch (e2) {}
      }
      throw new Error(`API Error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call Error (${action}):`, error);
    throw error;
  }
};

export const getWoopFeedback = async (step: WoopStep, currentData: Partial<WoopData>): Promise<AiFeedback> => {
  try {
    return await callServerlessApi('getWoopFeedback', { step, currentData });
  } catch (error) {
    return {
      score: 50,
      analysis: "שגיאת תקשורת עם השרת.",
      refinedText: currentData[step.toLowerCase() as keyof WoopData] || "",
      clarifyingQuestion: "אנא נסה שנית בעוד רגע.",
      isReady: false
    };
  }
};

export const generateTasksFromWoop = async (woop: WoopData): Promise<string[]> => {
  try {
    return await callServerlessApi('generateTasksFromWoop', { woop });
  } catch (error) {
    return ["להתחיל ביישום התוכנית", "מעקב אחר התקדמות"];
  }
};

export const getLabRecommendation = async (userInput: string) => {
  try {
    return await callServerlessApi('getLabRecommendation', { userInput });
  } catch (error) {
    return {
      explanation: "כדי להתקדם, כדאי להשתמש בכלים הבאים במעבדה:",
      recommendedToolIds: ["dashboard", "executive"]
    };
  }
};

export const getSynergyInsight = async (metrics: any, vibes: string[]) => {
  try {
    return await callServerlessApi('getSynergyInsight', { metrics, vibes });
  } catch (error) {
    return "שגיאה בניתוח הנתונים.";
  }
};

export const analyzeTaskMission = async (taskText: string) => {
  try {
    return await callServerlessApi('analyzeTaskMission', { taskText });
  } catch (error) {
    return { subtasks: [], priority: 'medium', managerTip: 'בצע בנחישות.', quickWin: 'התחל עכשיו.' };
  }
};

export const analyzeTowsStrategy = async (tows: Partial<TowsAnalysis>) => {
  try {
    return await callServerlessApi('analyzeTowsStrategy', { tows });
  } catch (error) {
    throw error;
  }
};

export const processIdea = async (content: string, projects: ProjectChange[], isAudio: boolean = false) => {
  try {
    return await callServerlessApi('processIdea', { content, projects, isAudio });
  } catch (error) {
    return { title: 'רעיון חדש', category: 'כללי', summary: content, nextSteps: [], priority: 'medium' };
  }
};

/**
 * NEW: Search for a suitable organizational solution based on user query
 */
export const searchSolutions = async (query: string) => {
  try {
    return await callServerlessApi('searchSolutions', { query });
  } catch (error) {
    return {
      recommendedTool: "שגיאת תקשורת",
      reasoning: "לא הצלחנו להתחבר לשרת כרגע.",
      structure: "אנא נסה שוב מאוחר יותר."
    };
  }
};
