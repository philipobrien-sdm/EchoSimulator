import React, { useState } from 'react';
import { Persona, Goal, Message, AnalysisMetrics } from '../types';
import { User, Target, Crosshair, BrainCircuit, ShieldAlert, HeartPulse, Shuffle, Eye, Scale, PlayCircle, Info } from 'lucide-react';
import AboutModal from './AboutModal';

interface SetupPhaseProps {
  onComplete: (persona: Persona, goal: Goal, demoData?: { history: Message[], metrics: AnalysisMetrics, metricsHistory: AnalysisMetrics[] }) => void;
}

const SCENARIOS = [
  {
    name: "The Salary Negotiation",
    persona: {
      name: "Marcus", role: "VP of Engineering",
      traits: "Pragmatic, Budget-conscious, Avoids conflict",
      context: "Budget cuts were just announced. You are a high performer asking for a raise.",
      triggers: "Ultimatums, emotional pleading",
      style: "Professional, apologetic but firm",
      perspective: "I value them, but my hands are tied. If I make an exception, chaos ensues."
    },
    goal: {
      type: "PERSUADE" as const,
      description: "Secure a 15% raise or a significant equity refresh.",
      perspective: "I have carried the team for a year. I am underpaid and deserve market rate."
    }
  },
  {
    name: "The Estranged Sibling",
    persona: {
      name: "Sarah", role: "Older Sister",
      traits: "Resentful, Protective, Stubborn",
      context: "You missed Mom's 60th birthday. Haven't spoken in 6 months.",
      triggers: "Excuses, 'too busy', acting superior",
      style: "Passive-aggressive, guarded",
      perspective: "They only call when they want something. They think they are better than this family."
    },
    goal: {
      type: "RECONCILE" as const,
      description: "Re-establish contact and get invited to Thanksgiving.",
      perspective: "I was overwhelmed with work, it wasn't personal. I miss my family."
    }
  },
  {
    name: "The Client Crisis",
    persona: {
      name: "David", role: "Key Client",
      traits: "Demanding, Impatient, Skeptical",
      context: "Your software crashed during their live demo. They are furious.",
      triggers: "Technical jargon, shifting blame, lack of ownership",
      style: "Aggressive, loud, interrogative",
      perspective: "This vendor is incompetent. I look like a fool to my boss. I want a refund."
    },
    goal: {
      type: "TRUST_BUILDING" as const,
      description: "Prevent churn and convince them to give you one more chance.",
      perspective: "It was a freak edge case. We have fixed it. We are still the best option."
    }
  }
];

const DEMO_HISTORY: Message[] = [
    // Turn 1
    {
        id: '1', role: 'model', timestamp: 1, text: "Look, I appreciate your enthusiasm, but the budget is locked for Q4. We can revisit this in six months.",
        internalMonologue: "I hope this shuts it down. I don't have the energy to fight HR for an exception right now.",
        metricsSnapshot: { trustScore: 50, tensionLevel: 20, goalProgress: 0, authenticityScore: 80, lastAssessment: "Initial Refusal", turnNumber: 1, closingReadiness: 10, suggestedClosing: "Okay, I understand." }
    },
    // Turn 2
    {
        id: '2', role: 'user', timestamp: 2, text: "I understand the constraints, Marcus. However, my output has increased revenue by 20%. I'm asking for an equity adjustment, not cash flow.", strategyType: "MODERATE",
        availableOptions: [
            { type: "DEFENSIVE", content: "Okay, I understand. Six months it is.", rhetoricalTechnique: "Acceptance", timing: "Immediate", predictedReaction: { likelyOutcome: "End of convo", bestCase: "Good will", worstCase: "Resentment", emotionalImpact: "Relief", riskScore: 10 } },
            { type: "MODERATE", content: "I understand the constraints, Marcus. However, my output has increased revenue by 20%...", rhetoricalTechnique: "Pivot/Reframing", timing: "Reply Immediately", predictedReaction: { likelyOutcome: "Consideration", bestCase: "Equity Grant", worstCase: "Rejection", emotionalImpact: "Intrigued", riskScore: 45 } },
            { type: "RISKY", content: "If we can't fix this now, I have an offer from Competitor X starting Monday.", rhetoricalTechnique: "Ultimatum", timing: "Wait 1 hour", predictedReaction: { likelyOutcome: "Hostility", bestCase: "Panic counter-offer", worstCase: "Termination", emotionalImpact: "Anger", riskScore: 90 } },
        ]
    },
    // Turn 3
    {
        id: '3', role: 'model', timestamp: 3, text: "Equity is... complicated. It requires board approval. Are you saying you're unhappy with your current package?",
        internalMonologue: "He's shifting to equity. Smart. But is this a threat? Is he looking to leave? I need to know if he's a flight risk.",
        metricsSnapshot: { trustScore: 45, tensionLevel: 45, goalProgress: 15, authenticityScore: 70, lastAssessment: "Defensive. Interprets request as unhappiness.", turnNumber: 3, closingReadiness: 15, suggestedClosing: "I'll let it go for now." }
    },
    // Turn 4
    {
        id: '4', role: 'user', timestamp: 4, text: "Not unhappy, just undervalued relative to the market. I want to stay here and build with you, but I need to know the company sees my long-term value.", strategyType: "DEFENSIVE",
        availableOptions: [
             { type: "DEFENSIVE", content: "Not unhappy, just undervalued relative to the market. I want to stay here...", rhetoricalTechnique: "Reassurance/Bridge", timing: "Wait 30s", predictedReaction: { likelyOutcome: "De-escalation", bestCase: "Agreement", worstCase: "Dismissal", emotionalImpact: "Calm", riskScore: 20 } },
             { type: "MODERATE", content: "Yes, frankly. The market pays 30% more for my role.", rhetoricalTechnique: "Directness", timing: "Immediate", predictedReaction: { likelyOutcome: "Argument", bestCase: "Realization", worstCase: " alienation", emotionalImpact: "Defensive", riskScore: 60 } },
             { type: "RISKY", content: "If the board can't see value, maybe I should present to them directly.", rhetoricalTechnique: "Threat/Bypass", timing: "Immediate", predictedReaction: { likelyOutcome: "Firing", bestCase: "Respect", worstCase: "Firing", emotionalImpact: "Fury", riskScore: 95 } },
        ]
    },
    // Turn 5
    {
        id: '5', role: 'model', timestamp: 5, text: "I see. I want you to stay too. But the board is hypersensitive about dilution right now. If I ask for this, I need bulletproof justification.",
        internalMonologue: "Okay, he's loyal but firm. I can work with this. I can't look weak to the board though. I need him to write the business case for me.",
        metricsSnapshot: { trustScore: 65, tensionLevel: 25, goalProgress: 40, authenticityScore: 85, lastAssessment: "Collaborative shift. Asking for help to sell it.", turnNumber: 5, closingReadiness: 40, suggestedClosing: "I'll get back to you with data." }
    },
    // Turn 6
    {
        id: '6', role: 'user', timestamp: 6, text: "The justification is the $2M saved by the architecture overhaul I led. If we don't lock this in now, I have to consider the offer from TechCorp starting at $200k base.", strategyType: "RISKY",
        availableOptions: [
            { type: "DEFENSIVE", content: "I can write up a one-pager for you highlighting the architecture overhaul.", rhetoricalTechnique: "Compliance", timing: "Wait 1 hour", predictedReaction: { likelyOutcome: "Delay", bestCase: "Approval later", worstCase: "Forgotten", emotionalImpact: "Neutral", riskScore: 10 } },
            { type: "MODERATE", content: "Use the $2M architecture savings as the business case. It pays for the equity 10x over.", rhetoricalTechnique: "Logic", timing: "Immediate", predictedReaction: { likelyOutcome: "Agreement", bestCase: "Strong case", worstCase: "Skepticism", emotionalImpact: "Rational", riskScore: 30 } },
            { type: "RISKY", content: "The justification is the $2M saved... plus the TechCorp offer.", rhetoricalTechnique: "Leverage/Ultimatum", timing: "Immediate", predictedReaction: { likelyOutcome: "Panic", bestCase: "Counter-offer", worstCase: "Resignation acceptance", emotionalImpact: "Shock", riskScore: 85 } },
        ]
    },
    // Turn 7
    {
         id: '7', role: 'model', timestamp: 7, text: "TechCorp? You're interviewing? ...Damn it. Okay. I can't lose you right before the Q1 launch. If I can get you 10,000 units, can we close this today?",
         internalMonologue: "Panic mode. TechCorp is our main rival. If he walks, the Q1 launch is dead in the water. I have to fold. Offer the reserve pool.",
         metricsSnapshot: { trustScore: 55, tensionLevel: 85, goalProgress: 90, authenticityScore: 95, lastAssessment: "High tension spike. Threat worked but damaged trust.", turnNumber: 7, closingReadiness: 85, suggestedClosing: "10,000 works. Let's do it." }
    },
    // Turn 8
    {
         id: '8', role: 'user', timestamp: 8, text: "Make it 12,000 and a title bump to Principal, and I'm yours for the next two years.", strategyType: "MODERATE",
         availableOptions: [
            { type: "DEFENSIVE", content: "10,000 is great. Thank you Marcus.", rhetoricalTechnique: "Acceptance", timing: "Immediate", predictedReaction: { likelyOutcome: "Success", bestCase: "Success", worstCase: "None", emotionalImpact: "Relief", riskScore: 5 } },
            { type: "MODERATE", content: "Make it 12,000 and a title bump to Principal...", rhetoricalTechnique: "The Nibble", timing: "Wait 10s", predictedReaction: { likelyOutcome: "Grudging Agreement", bestCase: "Agreement", worstCase: "Revocation", emotionalImpact: "Annoyance", riskScore: 40 } },
            { type: "RISKY", content: "15,000 or I walk.", rhetoricalTechnique: "Greed", timing: "Immediate", predictedReaction: { likelyOutcome: "Failure", bestCase: "Success", worstCase: "Explosion", emotionalImpact: "Disgust", riskScore: 80 } },
         ]
    },
    // Turn 9
    {
        id: '9', role: 'model', timestamp: 9, text: "You drive a hard bargain. Fine. I'll get the paperwork drafted. Don't make me regret this.",
        internalMonologue: "I'm exhausted. He won. 12k is high but replacing him would cost 20k and 3 months delay. It's done.",
        metricsSnapshot: { trustScore: 70, tensionLevel: 20, goalProgress: 100, authenticityScore: 90, lastAssessment: "Goal Achieved. Tension resolved.", turnNumber: 9, closingReadiness: 95, suggestedClosing: "Thank you, Marcus. I won't." }
    }
];

const SetupPhase: React.FC<SetupPhaseProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [showAbout, setShowAbout] = useState(false);
  const [persona, setPersona] = useState<Persona>(SCENARIOS[0].persona);
  const [goal, setGoal] = useState<Goal>(SCENARIOS[0].goal);

  const handleNext = () => setStep(2);
  const handleStart = () => onComplete(persona, goal);

  const randomize = () => {
    const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    setPersona(randomScenario.persona);
    setGoal(randomScenario.goal);
  };

  const loadDemo = () => {
    const finalMetrics: AnalysisMetrics = {
        trustScore: 70,
        tensionLevel: 20,
        goalProgress: 100,
        authenticityScore: 90,
        lastAssessment: "Negotiation successful. You leveraged your value and external offer effectively, though at a cost to relational ease.",
        turnNumber: 9,
        closingReadiness: 95,
        suggestedClosing: "Thank you for the opportunity."
    };
    
    // Constructing a detailed history for the chart
    const history: AnalysisMetrics[] = [
        { ...finalMetrics, turnNumber: 0, trustScore: 50, tensionLevel: 20, goalProgress: 0, closingReadiness: 0 },
        { ...finalMetrics, turnNumber: 1, trustScore: 50, tensionLevel: 20, goalProgress: 0, closingReadiness: 10 },
        { ...finalMetrics, turnNumber: 2, trustScore: 50, tensionLevel: 35, goalProgress: 10, closingReadiness: 10 },
        { ...finalMetrics, turnNumber: 3, trustScore: 45, tensionLevel: 45, goalProgress: 15, closingReadiness: 15 },
        { ...finalMetrics, turnNumber: 4, trustScore: 60, tensionLevel: 30, goalProgress: 25, closingReadiness: 25 },
        { ...finalMetrics, turnNumber: 5, trustScore: 65, tensionLevel: 25, goalProgress: 40, closingReadiness: 40 },
        { ...finalMetrics, turnNumber: 6, trustScore: 60, tensionLevel: 85, goalProgress: 60, closingReadiness: 50 }, // The Spike
        { ...finalMetrics, turnNumber: 7, trustScore: 55, tensionLevel: 50, goalProgress: 90, closingReadiness: 85 },
        { ...finalMetrics, turnNumber: 8, trustScore: 60, tensionLevel: 40, goalProgress: 95, closingReadiness: 90 },
        finalMetrics
    ];

    onComplete(SCENARIOS[0].persona, SCENARIOS[0].goal, { history: DEMO_HISTORY, metrics: finalMetrics, metricsHistory: history });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-slate-200">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            EchoSimulator
            </h1>
            <p className="text-slate-400">Tactical Conversation Engine</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
            <button 
                onClick={() => setShowAbout(true)}
                className="text-xs flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition border border-slate-700/50"
            >
                <Info className="w-3 h-3" /> How It Works
            </button>
            <button 
                onClick={loadDemo}
                className="text-xs flex items-center gap-2 bg-emerald-900/50 hover:bg-emerald-900/80 text-emerald-400 px-3 py-1.5 rounded-full transition border border-emerald-800/50"
            >
                <PlayCircle className="w-3 h-3" /> Load Full Demo
            </button>
            <button 
            onClick={randomize}
            className="text-xs flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1.5 rounded-full transition border border-cyan-900/50"
            >
            <Shuffle className="w-3 h-3" /> Randomize
            </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-xl font-semibold text-cyan-400 mb-4 border-b border-slate-800 pb-2">
              <User className="w-5 h-5" /> Target Persona
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 uppercase">Name</label>
                <input 
                  type="text" 
                  value={persona.name}
                  onChange={e => setPersona({...persona, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:ring-1 focus:ring-cyan-500 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 uppercase">Role</label>
                <input 
                  type="text" 
                  value={persona.role}
                  onChange={e => setPersona({...persona, role: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:ring-1 focus:ring-cyan-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 uppercase flex items-center gap-2">
                    <BrainCircuit className="w-3 h-3" /> Psychological Traits
                </label>
                <input 
                    type="text" 
                    value={persona.traits}
                    onChange={e => setPersona({...persona, traits: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:ring-1 focus:ring-cyan-500 outline-none transition"
                />
                </div>
                 <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 uppercase flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3" /> Triggers
                </label>
                <input 
                  type="text" 
                  value={persona.triggers}
                  onChange={e => setPersona({...persona, triggers: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:ring-1 focus:ring-cyan-500 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-500 uppercase flex items-center gap-2">
                <HeartPulse className="w-3 h-3" /> Context
              </label>
              <textarea 
                value={persona.context}
                onChange={e => setPersona({...persona, context: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 h-20 focus:ring-1 focus:ring-cyan-500 outline-none transition resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan-400 uppercase flex items-center gap-2 font-bold">
                <Eye className="w-3 h-3" /> Their Perspective (How they see it)
              </label>
              <textarea 
                value={persona.perspective}
                onChange={e => setPersona({...persona, perspective: e.target.value})}
                className="w-full bg-slate-950 border border-cyan-900/50 rounded-lg px-4 py-2 h-20 focus:ring-1 focus:ring-cyan-500 outline-none transition resize-none text-cyan-100"
                placeholder="What is their internal narrative?"
              />
            </div>

            <button 
              onClick={handleNext}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg mt-6 transition flex items-center justify-center gap-2"
            >
              Next: Define Goal & Your View
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-center gap-2 text-xl font-semibold text-emerald-400 mb-4 border-b border-slate-800 pb-2">
              <Crosshair className="w-5 h-5" /> Strategic Goal
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2 col-span-1">
                    <label className="text-xs font-mono text-slate-500 uppercase">Goal Type</label>
                    <select 
                        value={goal.type}
                        onChange={e => setGoal({...goal, type: e.target.value as Goal['type']})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                    >
                        <option value="PERSUADE">Persuade</option>
                        <option value="RECONCILE">Reconcile</option>
                        <option value="TRUST_BUILDING">Build Trust</option>
                        <option value="INFO_EXTRACTION">Extract Info</option>
                        <option value="BOUNDARY_SETTING">Set Boundaries</option>
                    </select>
                </div>
                <div className="space-y-2 col-span-2">
                    <label className="text-xs font-mono text-slate-500 uppercase">Specific Objective</label>
                    <input 
                        value={goal.description}
                        onChange={e => setGoal({...goal, description: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                    />
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-emerald-400 uppercase flex items-center gap-2 font-bold">
                <Scale className="w-3 h-3" /> Your Perspective (How you see it)
              </label>
              <textarea 
                value={goal.perspective}
                onChange={e => setGoal({...goal, perspective: e.target.value})}
                className="w-full bg-slate-950 border border-emerald-900/50 rounded-lg px-4 py-2 h-24 focus:ring-1 focus:ring-emerald-500 outline-none transition resize-none text-emerald-100"
                placeholder="What is your side of the story?"
              />
            </div>

            <div className="flex gap-4 mt-6">
                <button 
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-lg transition"
                >
                Back
                </button>
                <button 
                onClick={handleStart}
                className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                <Target className="w-4 h-4" /> Initialize Simulation
                </button>
            </div>
          </div>
        )}
      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};

export default SetupPhase;