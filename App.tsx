import React, { useState } from 'react';
import SetupPhase from './components/SetupPhase';
import SimulationView from './components/SimulationView';
import { Persona, Goal, Message, AnalysisMetrics } from './types';

interface SimulationSession {
  persona: Persona;
  goal: Goal;
  initialHistory?: Message[];
  initialMetrics?: AnalysisMetrics;
  initialMetricsHistory?: AnalysisMetrics[];
}

const App: React.FC = () => {
  const [session, setSession] = useState<SimulationSession | null>(null);

  const handleSetupComplete = (
    persona: Persona, 
    goal: Goal, 
    demoData?: { history: Message[], metrics: AnalysisMetrics, metricsHistory: AnalysisMetrics[] }
  ) => {
    if (demoData) {
        setSession({
            persona,
            goal,
            initialHistory: demoData.history,
            initialMetrics: demoData.metrics,
            initialMetricsHistory: demoData.metricsHistory
        });
    } else {
        setSession({ persona, goal });
    }
  };

  const handleExit = () => {
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      {!session ? (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
             <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"></div>
             <div className="relative z-10 w-full">
                 <SetupPhase onComplete={handleSetupComplete} />
             </div>
        </div>
      ) : (
        <SimulationView 
          persona={session.persona} 
          goal={session.goal} 
          initialHistory={session.initialHistory}
          initialMetrics={session.initialMetrics}
          initialMetricsHistory={session.initialMetricsHistory}
          onExit={handleExit} 
        />
      )}
    </div>
  );
};

export default App;