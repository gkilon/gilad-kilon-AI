
export enum WoopStep {
  CONTEXT = 'CONTEXT',
  WISH = 'WISH',
  OUTCOME = 'OUTCOME',
  OBSTACLE = 'OBSTACLE',
  PLAN = 'PLAN'
}

export interface WoopData {
  context: string;
  wish: string;
  outcome: string;
  obstacle: string;
  plan: string;
}

export interface AiFeedback {
  score: number;
  analysis: string;
  refinedText: string;
  clarifyingQuestion: string;
  isReady: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  createdAt: number;
}

export interface ProjectChange {
  id: string;
  title: string;
  createdAt: number;
  woop: WoopData;
  tasks: Task[];
  readinessScore: number;
}

export interface IdeaEntry {
  id: string;
  date: number;
  rawContent: string;
  type: 'text' | 'voice';
  analysis?: {
    title: string;
    category: string;
    summary: string;
    nextSteps: string[];
    priority: 'low' | 'medium' | 'high';
    matchedProjectId?: string;
    matchingExplanation?: string;
  };
}

export interface TeamSynergyPulse {
  ownership: number;
  roleClarity: number;
  routines: number;
  communication: number;
  commitment: number;
  respect: number;
  vibe: string;
  timestamp: number;
  teamId: string;
}

export interface TowsAnalysis {
  id: string;
  title: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  timestamp: number;
  managerId: string;
  analysis?: {
    strategiesSO: string[]; // Strengths-Opportunities (Growth)
    strategiesST: string[]; // Strengths-Threats (Defensive)
    strategiesWO: string[]; // Weaknesses-Opportunities (Development)
    strategiesWT: string[]; // Weaknesses-Threats (Survival)
    executiveSummary: string;
  };
}

export interface CommStyleResult {
  style: string;
  characteristics: string[];
  strengths: string[];
  growthAreas: string[];
  howToCommunicateWithMe: string;
}

export interface UserSession {
  isManager: boolean;
  teamId: string;
}
