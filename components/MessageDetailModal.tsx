import React from 'react';
import { Message, ReplyOption } from '../types';
import { X, BrainCircuit, User, Shield, Zap, ArrowRight, Lock, Activity, Eye, CheckCircle2 } from 'lucide-react';

interface MessageDetailModalProps {
  message: Message;
  personaName: string;
  onClose: () => void;
}

const MessageDetailModal: React.FC<MessageDetailModalProps> = ({ message, personaName, onClose }) => {
  const isUser = message.role === 'user';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className={`p-5 border-b flex justify-between items-center ${isUser ? 'bg-cyan-950/30 border-cyan-800/30' : 'bg-slate-800/50 border-slate-700'}`}>
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${isUser ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-300'}`}>
                {isUser ? <User className="w-5 h-5" /> : <BrainCircuit className="w-5 h-5" />}
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-100">
                    {isUser ? "Your Move Analysis" : `${personaName}'s Internal State`}
                </h2>
                <div className="text-xs text-slate-500 font-mono uppercase">
                    Turn Analysis
                </div>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
            
            {/* The Message Itself */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                    <Eye className="w-3 h-3" /> Visible Message
                </label>
                <div className={`p-4 rounded-xl border text-lg leading-relaxed ${isUser ? 'bg-cyan-950/20 border-cyan-900/50 text-cyan-50' : 'bg-slate-950 border-slate-800 text-slate-200'}`}>
                    "{message.text}"
                </div>
                {message.strategyType && isUser && (
                    <div className="flex justify-end">
                        <span className={`text-xs font-bold px-2 py-1 rounded border uppercase ${
                            message.strategyType === 'DEFENSIVE' ? 'text-blue-400 border-blue-900/50 bg-blue-900/20' :
                            message.strategyType === 'RISKY' ? 'text-orange-400 border-orange-900/50 bg-orange-900/20' :
                            'text-emerald-400 border-emerald-900/50 bg-emerald-900/20'
                        }`}>
                            {message.strategyType} Strategy
                        </span>
                    </div>
                )}
            </div>

            {/* IF MODEL: Internal Monologue & Metrics */}
            {!isUser && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-purple-400 uppercase flex items-center gap-2">
                            <Lock className="w-3 h-3" /> Hidden Internal Monologue
                        </label>
                        <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-xl text-purple-200 italic">
                            {message.internalMonologue || "No internal thought process recorded for this turn."}
                        </div>
                    </div>

                    {message.metricsSnapshot && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <Activity className="w-3 h-3" /> Emotional State at this moment
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <MetricCard label="Trust" value={message.metricsSnapshot.trustScore} color="text-emerald-400" />
                                <MetricCard label="Tension" value={message.metricsSnapshot.tensionLevel} color="text-orange-400" />
                                <MetricCard label="Goal" value={message.metricsSnapshot.goalProgress} color="text-blue-400" />
                                <MetricCard label="Auth" value={message.metricsSnapshot.authenticityScore} color="text-purple-400" />
                            </div>
                            <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-400">
                                <span className="text-slate-500 font-bold uppercase text-xs mr-2">Analysis:</span>
                                {message.metricsSnapshot.lastAssessment}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* IF USER: Alternatives */}
            {isUser && message.availableOptions && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">
                            Options Available At This Turn
                        </label>
                    </div>
                    
                    <div className="space-y-3">
                        {message.availableOptions.map((opt, idx) => {
                            const isChosen = opt.content === message.text;
                            return (
                                <div key={idx} className={`p-3 rounded-lg border flex flex-col gap-2 ${isChosen ? 'bg-cyan-950/30 border-cyan-500/50' : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100 transition-opacity'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            {isChosen && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                                            <span className={`text-xs font-bold uppercase ${
                                                opt.type === 'DEFENSIVE' ? 'text-blue-400' : 
                                                opt.type === 'RISKY' ? 'text-orange-400' : 'text-emerald-400'
                                            }`}>
                                                {opt.type}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono">Risk: {opt.predictedReaction.riskScore}%</span>
                                    </div>
                                    <p className="text-sm text-slate-300 line-clamp-2">"{opt.content}"</p>
                                    {!isChosen && (
                                        <div className="text-xs text-slate-500 pt-2 border-t border-slate-800 mt-1">
                                            <span className="font-semibold text-slate-400">Predicted:</span> {opt.predictedReaction.likelyOutcome}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{label}</div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
);

export default MessageDetailModal;