
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
  id?: string;
  teamId: string;
  timestamp: number;
  vibe: string;
  // Dynamic metrics: key is metric ID, value is 1-6
  [key: string]: any; 
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
    strategiesSO: string[];
    strategiesST: string[];
    strategiesWO: string[];
    strategiesWT: string[];
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

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  link?: string;
  content?: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  url: string;
}

export interface SystemConfig {
  masterCode: string;
  metrics: { key: string; label: string; icon: string; }[];
  articles: Article[];
  clients: ClientLogo[];
}

export type ViewType = 'home' | 'lab' | 'dashboard' | 'wizard' | 'ideas' | 'synergy' | 'executive' | 'tasks' | 'about' | 'clients' | 'login' | 'communication' | 'feedback360' | 'admin' | 'articles' | 'article_detail' | 'brand_assets';
