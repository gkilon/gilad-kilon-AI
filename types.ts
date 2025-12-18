
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

export interface StrategyTest {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  analysis?: {
    risks: string[];
    alignmentGaps: string[];
    criticalQuestions: string[];
    recommendation: string;
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
