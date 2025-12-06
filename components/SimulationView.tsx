import React, { useEffect, useRef, useState } from 'react';
import { Persona, Goal, Message, ReplyOption, SimulationState, AnalysisMetrics } from '../types';
import { generateStrategicOptions, simulatePersonaResponse, generateInitialGreeting, evaluateUserDraft, analyzeManualResponse } from '../services/geminiService';
import StrategyCard from './StrategyCard';
import AnalysisDashboard from './AnalysisDashboard';
import OptionDetailModal from './OptionDetailModal';
import CustomInputModal from './CustomInputModal';
import PersonaInputModal from './PersonaInputModal';
import MessageDetailModal from './MessageDetailModal';
import { Loader2, Eye, History, Edit3, Bot, UserCog, Lock, Info } from 'lucide-react';

interface SimulationViewProps {
  persona: Persona;
  goal: Goal;
  initialHistory?: Message[]; // Support demo loading
  initialMetrics?: AnalysisMetrics;
  initialMetricsHistory?: AnalysisMetrics[];
  onExit: () => void;
}

const SimulationView: React.FC<SimulationViewProps> = ({ 
  persona, 
  goal, 
  initialHistory, 
  initialMetrics, 
  initialMetricsHistory,
  onExit 
}) => {
  
  const defaultMetrics: AnalysisMetrics = {
    trustScore: 50,
    tensionLevel: 20,
    goalProgress: 0,
    authenticityScore: 80,
    lastAssessment: "Initializing simulation...",
    turnNumber: 0
  };

  const [state, setState] = useState<SimulationState>({
    step: 'SIMULATION',
    persona,
    goal,
    chatHistory: initialHistory || [],
    metrics: initialMetrics || defaultMetrics,
    metricsHistory: initialMetricsHistory || [initialMetrics || defaultMetrics],
    currentOptions: null,
    isThinking: !initialHistory // Only think if starting fresh
  });

  const [lastMonologue, setLastMonologue] = useState<string | undefined>();
  const [selectedOption, setSelectedOption] = useState<ReplyOption | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showPersonaInputModal, setShowPersonaInputModal] = useState(false);
  const [controlMode, setControlMode] = useState<'AI' | 'MANUAL'>('AI');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Initialize Chat
  useEffect(() => {
    if (initialHistory) {
      // If demo loaded, just generate options for the NEXT turn
      const generateNext = async () => {
         const nextOptions = await generateStrategicOptions(persona, goal, initialHistory);
         setState(prev => ({
            ...prev,
            currentOptions: nextOptions,
            isThinking: false
         }));
      }
      generateNext();
      return;
    }

    let isMounted = true;
    const init = async () => {
      // 1. Get initial greeting
      const greeting = await generateInitialGreeting(persona, goal);
      if (!isMounted) return;

      const initialMessage: Message = {
        id: 'init',
        role: 'model',
        text: greeting,
        timestamp: Date.now(),
        internalMonologue: "I'll start polite but guarded. I don't know what they want yet."
      };
      
      const newHistory = [initialMessage];

      // 2. Generate initial options for user
      const options = await generateStrategicOptions(persona, goal, newHistory);
      
      if (isMounted) {
        setState(prev => ({
          ...prev,
          chatHistory: newHistory,
          currentOptions: options,
          isThinking: false
        }));
      }
    };
    init();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Auto scroll only if NOT highlighting history
  useEffect(() => {
    if (!highlightedMessageId) {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.chatHistory, state.currentOptions, highlightedMessageId]);

  const handleOptionClick = (option: ReplyOption) => {
    setSelectedOption(option);
  };

  const handleTurnSelect = (turnNumber: number) => {
    // Logic: Turn 1 corresponds to index 0, etc.
    const index = turnNumber - 1;
    
    if (index >= 0 && index < state.chatHistory.length) {
        const msg = state.chatHistory[index];
        setHighlightedMessageId(msg.id);
        
        // 1. Try React Refs
        const refElement = messageRefs.current[msg.id];
        
        // 2. Fallback to DOM lookup if Ref is missing (safeguard)
        const domElement = refElement || document.getElementById(`msg-${msg.id}`);

        if (domElement) {
            domElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
            setHighlightedMessageId(null);
        }, 2500);
    }
  };

  const handleConfirmOption = async (option: ReplyOption) => {
    setSelectedOption(null); // Close modal
    setShowCustomModal(false);

    // 1. Add User Message (Snapshot available options into this message for history)
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: option.content,
      strategyType: option.type,
      timestamp: Date.now(),
      availableOptions: state.currentOptions || [] 
    };

    const updatedHistory = [...state.chatHistory, userMsg];

    setState(prev => ({
      ...prev,
      chatHistory: updatedHistory,
      currentOptions: null,
      isThinking: controlMode === 'AI' // Only think if AI is responding
    }));

    if (controlMode === 'MANUAL') {
        setShowPersonaInputModal(true);
        return;
    }

    // 2. Simulate Persona Response (AI Mode)
    try {
        const simulation = await simulatePersonaResponse(persona, goal, updatedHistory, option.content);
        setLastMonologue(simulation.monologue);

        const modelMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: simulation.text,
            timestamp: Date.now(),
            metricsSnapshot: simulation.metrics,
            internalMonologue: simulation.monologue
        };

        const finalHistory = [...updatedHistory, modelMsg];
        const newMetricsHistory = [...state.metricsHistory, simulation.metrics];

        // 3. Generate Next Options
        const nextOptions = await generateStrategicOptions(persona, goal, finalHistory);

        setState(prev => ({
            ...prev,
            chatHistory: finalHistory,
            metrics: simulation.metrics,
            metricsHistory: newMetricsHistory,
            currentOptions: nextOptions,
            isThinking: false
        }));

    } catch (e) {
        console.error(e);
        setState(prev => ({ ...prev, isThinking: false }));
    }
  };

  const handleManualPersonaSubmit = async (text: string) => {
    setShowPersonaInputModal(false);
    setState(prev => ({ ...prev, isThinking: true }));

    try {
        // We analyze the manual response to generate metrics/monologue
        const analysis = await analyzeManualResponse(persona, goal, state.chatHistory, text);
        
        setLastMonologue(analysis.monologue);

        const modelMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: text,
            timestamp: Date.now(),
            metricsSnapshot: analysis.metrics,
            internalMonologue: analysis.monologue
        };

        const finalHistory = [...state.chatHistory, modelMsg];
        const newMetricsHistory = [...state.metricsHistory, analysis.metrics];

        // Generate User options for next turn
        const nextOptions = await generateStrategicOptions(persona, goal, finalHistory);

        setState(prev => ({
            ...prev,
            chatHistory: finalHistory,
            metrics: analysis.metrics,
            metricsHistory: newMetricsHistory,
            currentOptions: nextOptions,
            isThinking: false
        }));

    } catch (e) {
        console.error(e);
        setState(prev => ({ ...prev, isThinking: false }));
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-950 overflow-hidden relative">
        
        {/* Detail Modal (Strategic Options) */}
        {selectedOption && (
            <OptionDetailModal 
                option={selectedOption}
                onConfirm={() => handleConfirmOption(selectedOption)}
                onCancel={() => setSelectedOption(null)}
            />
        )}

        {/* Message Detail Modal (History Inspection) */}
        {selectedMessage && (
            <MessageDetailModal
                message={selectedMessage}
                personaName={persona.name}
                onClose={() => setSelectedMessage(null)}
            />
        )}

        {/* Custom Input Modal */}
        {showCustomModal && (
            <CustomInputModal 
                onEvaluate={(text) => evaluateUserDraft(persona, goal, state.chatHistory, text)}
                onConfirm={handleConfirmOption}
                onCancel={() => setShowCustomModal(false)}
            />
        )}

        {/* Persona Input Modal (Self-Play) */}
        {showPersonaInputModal && (
            <PersonaInputModal 
                personaName={persona.name}
                onConfirm={handleManualPersonaSubmit}
                onCancel={() => {
                    setShowPersonaInputModal(false);
                    setControlMode('AI');
                    setShowPersonaInputModal(true); 
                }}
            />
        )}

        {/* Left: Chat Area */}
        <div className="flex-1 flex flex-col h-full border-r border-slate-900 relative">
            {/* Header */}
            <header className="h-16 border-b border-slate-900 bg-slate-900/50 flex items-center justify-between px-6">
                <div>
                    <h2 className="font-bold text-slate-100">{persona.name}</h2>
                    <span className="text-xs text-slate-500 uppercase tracking-wide">{persona.role} • {goal.type}</span>
                </div>
                
                <div className="flex items-center gap-4">
                     {/* Control Mode Toggle */}
                    <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700/50">
                        <button 
                            onClick={() => setControlMode('AI')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition ${controlMode === 'AI' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            title="AI controls the persona"
                        >
                            <Bot className="w-3 h-3" /> Auto
                        </button>
                        <button 
                            onClick={() => setControlMode('MANUAL')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition ${controlMode === 'MANUAL' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            title="You control the persona (Self-Play)"
                        >
                            <UserCog className="w-3 h-3" /> Self-Play
                        </button>
                    </div>

                    <button onClick={onExit} className="text-xs text-slate-500 hover:text-slate-300">
                        Exit Sim
                    </button>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                {state.chatHistory.map((msg, index) => (
                    <div 
                        key={msg.id}
                        id={`msg-${msg.id}`}
                        ref={(el) => { messageRefs.current[msg.id] = el; }}
                        className={`flex flex-col max-w-[85%] transition-all duration-500 ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                        <div className="flex items-end gap-2 group/message">
                             {/* Order Number (Left for User) */}
                             {msg.role === 'user' && (
                                <span className="text-[10px] font-mono text-slate-600 mb-4 select-none">#{index + 1}</span>
                             )}

                            <div 
                                onClick={() => setSelectedMessage(msg)}
                                className={`
                                relative cursor-pointer p-4 rounded-2xl shadow-sm text-sm leading-relaxed transition-all duration-300
                                ${highlightedMessageId === msg.id ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-[1.02] shadow-cyan-500/20 shadow-lg z-10' : 'hover:scale-[1.01] hover:shadow-md'}
                                ${msg.role === 'user' 
                                    ? 'bg-cyan-900/40 text-cyan-50 border border-cyan-800/50 rounded-tr-none hover:border-cyan-500/50' 
                                    : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-none hover:border-slate-500/50'}
                            `}>
                                {msg.text}

                                {/* Hover Indicator for Clickability */}
                                <div className={`absolute top-2 ${msg.role === 'user' ? 'left-2' : 'right-2'} opacity-0 group-hover/message:opacity-100 transition-opacity`}>
                                     {msg.role === 'user' ? (
                                        <Info className="w-3 h-3 text-cyan-400/50" />
                                     ) : (
                                        <Lock className="w-3 h-3 text-slate-500/50" />
                                     )}
                                </div>
                            </div>

                            {/* Order Number (Right for Model) */}
                            {msg.role === 'model' && (
                                <span className="text-[10px] font-mono text-slate-600 mb-4 select-none">#{index + 1}</span>
                             )}
                        </div>
                        
                        {msg.strategyType && (
                            <span className="text-[10px] uppercase font-mono mt-1 text-slate-500 mr-1 flex items-center gap-1 self-end">
                                {msg.strategyType} move
                            </span>
                        )}
                    </div>
                ))}
                
                {state.isThinking && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm p-2 animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing & Simulating...</span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input / Strategy Selection Area */}
            <div className="h-auto min-h-[220px] bg-slate-900 border-t border-slate-800 p-6 z-10">
                {!state.isThinking && state.currentOptions ? (
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
                        {state.currentOptions.map((opt, idx) => (
                            <StrategyCard 
                                key={idx} 
                                option={opt} 
                                onSelect={() => handleOptionClick(opt)} 
                            />
                        ))}
                        {/* Custom Option Card */}
                        <div 
                            onClick={() => setShowCustomModal(true)}
                            className="cursor-pointer border border-dashed border-slate-700 rounded-xl p-4 hover:bg-slate-800/50 hover:border-slate-500 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-cyan-400 group"
                        >
                            <div className="p-3 bg-slate-900 rounded-full group-hover:scale-110 transition-transform">
                                <Edit3 className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wide">Write Your Own</span>
                        </div>
                     </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-600">
                        {state.isThinking ? "Simulating trajectory..." : "Waiting for state update..."}
                    </div>
                )}
            </div>
        </div>

        {/* Right: Analysis Panel (Hidden on mobile, togglable in real app, but visible here for desktop) */}
        <div className="hidden md:flex w-96 flex-col bg-slate-950 border-l border-slate-900 p-4">
             <AnalysisDashboard 
                metrics={state.metrics} 
                history={state.metricsHistory} 
                lastMonologue={lastMonologue} 
                onTurnSelect={handleTurnSelect}
             />
        </div>
    </div>
  );
};

export default SimulationView;