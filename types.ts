export interface Persona {
  name: string;
  role: string; // e.g., "Estranged Brother", "Boss"
  traits: string; // "INTJ, avoidant attachment"
  context: string; // "Trauma from past failure"
  triggers: string; // "Being ignored, condescension"
  style: string; // "Direct, logical, cold"
  perspective: string; // "How they see the situation"
}

export interface Goal {
  type: 'PERSUADE' | 'RECONCILE' | 'TRUST_BUILDING' | 'INFO_EXTRACTION' | 'BOUNDARY_SETTING';
  description: string;
  perspective: string; // "How I (the user) see the situation"
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  strategyType?: StrategyType;
  rhetoricAnalysis?: string;
  timestamp: number;
  metricsSnapshot?: AnalysisMetrics; // Capture metrics at this point in time
  availableOptions?: ReplyOption[]; // The options that were presented to the user at this turn
  internalMonologue?: string; // What the persona was thinking
}

export type StrategyType = 'DEFENSIVE' | 'MODERATE' | 'RISKY' | 'CUSTOM';

export interface ReplyOption {
  type: StrategyType;
  content: string;
  rhetoricalTechnique: string;
  timing: string; // "Immediate", "Wait 2 hours", etc.
  predictedReaction: {
    likelyOutcome: string;
    bestCase: string;
    worstCase: string;
    emotionalImpact: string;
    riskScore: number; // 0-100
  };
}

export interface AnalysisMetrics {
  trustScore: number; // 0-100
  tensionLevel: number; // 0-100
  goalProgress: number; // 0-100
  authenticityScore: number; // 0-100
  lastAssessment: string;
  turnNumber: number;
  // New fields for closing advice
  closingReadiness?: number; // 0-100 indicating wisdom of ending now
  suggestedClosing?: string; // AI generated sign-off line
}

export interface SimulationState {
  step: 'SETUP' | 'SIMULATION';
  persona: Persona;
  goal: Goal;
  chatHistory: Message[];
  metrics: AnalysisMetrics;
  metricsHistory: AnalysisMetrics[];
  currentOptions: ReplyOption[] | null;
  isThinking: boolean;
}