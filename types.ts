

export enum WoopStep {
  WISH = 'WISH',
  OUTCOME = 'OUTCOME',
  OBSTACLE = 'OBSTACLE',
  PLAN = 'PLAN'
}

export interface WoopData {
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
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  // Added priority to fix TaskHub errors
  priority?: 'low' | 'medium' | 'high';
}

// Updated WoopProject to include managerId and match its usage in App.tsx
export interface WoopProject {
  id: string;
  title: string;
  data: WoopData;
  tasks: Task[];
  readinessScore: number;
  createdAt: number;
  managerId: string;
}

// Added missing ViewType
export type ViewType = 'home' | 'about' | 'clients' | 'articles' | 'lab' | 'dashboard' | 'executive' | 'synergy' | 'ideas' | 'communication' | 'feedback360' | 'tasks' | 'login' | 'admin' | 'article_detail';

// Added missing UserSession
export interface UserSession {
  teamId: string;
  isManager: boolean;
  isAdmin?: boolean;
}

// Added missing TowsAnalysis
export interface TowsAnalysis {
  id: string;
  title: string;
  timestamp: number;
  managerId: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  analysis: {
    strategiesSO: string[];
    strategiesWO: string[];
    strategiesST: string[];
    strategiesWT: string[];
    executiveSummary: string;
  };
}

// Added missing IdeaEntry
export interface IdeaEntry {
  id: string;
  date: number;
  rawContent: string;
  type: 'voice' | 'text';
  analysis: {
    title: string;
    summary: string;
    matchedProjectId?: string;
    matchingExplanation?: string;
    nextSteps: string[];
  };
}

// Added missing ProjectChange
export interface ProjectChange {
  id: string;
  title: string;
}

// Added missing Article
export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  link?: string;
  content?: string;
}

// Added missing ClientLogo
export interface ClientLogo {
  id: string;
  name: string;
  url: string;
}

// Added missing Collaboration
export interface Collaboration {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  link?: string;
}

// Added missing TeamSynergyPulse
export interface TeamSynergyPulse {
  [key: string]: any;
  teamId: string;
  timestamp: number;
  vibe: string;
}