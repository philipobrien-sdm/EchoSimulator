import React from 'react';
import { ReplyOption } from '../types';
import { Shield, ArrowRight, Zap, AlertTriangle, Brain, Thermometer, Clock, CheckCircle, X, ThumbsUp, ThumbsDown, Activity } from 'lucide-react';

interface OptionDetailModalProps {
  option: ReplyOption;
  onConfirm: () => void;
  onCancel: () => void;
  isHistorical?: boolean;
}

const OptionDetailModal: React.FC<OptionDetailModalProps> = ({ option, onConfirm, onCancel, isHistorical }) => {
  const getColors = () => {
    switch (option.type) {
      case 'DEFENSIVE': return { bg: 'bg-blue-950', border: 'border-blue-500', text: 'text-blue-100', accent: 'text-blue-400' };
      case 'MODERATE': return { bg: 'bg-emerald-950', border: 'border-emerald-500', text: 'text-emerald-100', accent: 'text-emerald-400' };
      case 'RISKY': return { bg: 'bg-orange-950', border: 'border-orange-500', text: 'text-orange-100', accent: 'text-orange-400' };
    }
  };
  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-2xl ${colors.bg} border ${colors.border} rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start">
          <div>
            <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${colors.accent} mb-2`}>
               {option.type === 'DEFENSIVE' && <Shield className="w-4 h-4" />}
               {option.type === 'MODERATE' && <ArrowRight className="w-4 h-4" />}
               {option.type === 'RISKY' && <Zap className="w-4 h-4" />}
               {option.type} STRATEGY
            </div>
            <h2 className="text-2xl font-semibold text-white leading-tight">"{option.content}"</h2>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Technique & Timing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                    <Brain className="w-4 h-4" /> Rhetorical Technique
                </div>
                <div className="text-slate-200">{option.rhetoricalTechnique}</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                    <Clock className="w-4 h-4" /> Recommended Timing
                </div>
                <div className="text-slate-200">{option.timing}</div>
            </div>
          </div>

          {/* Predictions */}
          <div className="space-y-3">
             <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Activity className="w-4 h-4" /> Outcome Simulations
             </div>
             
             <div className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex gap-3">
                    <div className="mt-1"><ThumbsUp className="w-5 h-5 text-emerald-500" /></div>
                    <div>
                        <div className="text-xs text-emerald-400 font-bold uppercase mb-1">Best Case Scenario</div>
                        <div className="text-sm text-slate-300">{option.predictedReaction.bestCase}</div>
                    </div>
                </div>
                <div className="p-4 border-b border-white/5 flex gap-3 bg-white/5">
                    <div className="mt-1"><Activity className="w-5 h-5 text-blue-400" /></div>
                    <div>
                        <div className="text-xs text-blue-400 font-bold uppercase mb-1">Likely Outcome</div>
                        <div className="text-sm text-white">{option.predictedReaction.likelyOutcome}</div>
                    </div>
                </div>
                 <div className="p-4 flex gap-3">
                    <div className="mt-1"><ThumbsDown className="w-5 h-5 text-rose-500" /></div>
                    <div>
                        <div className="text-xs text-rose-400 font-bold uppercase mb-1">Worst Case Scenario</div>
                        <div className="text-sm text-slate-300">{option.predictedReaction.worstCase}</div>
                    </div>
                </div>
             </div>
          </div>

           {/* Stats */}
           <div className="flex items-center gap-6 p-4 bg-slate-900/30 rounded-xl">
             <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${colors.accent}`} />
                <span className="text-sm text-slate-400">Risk Score:</span>
                <span className={`text-lg font-bold ${colors.accent}`}>{option.predictedReaction.riskScore}%</span>
             </div>
             <div className="h-8 w-px bg-white/10"></div>
             <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-400">Impact:</span>
                <span className="text-sm font-medium text-slate-200">{option.predictedReaction.emotionalImpact}</span>
             </div>
           </div>

        </div>

        {/* Footer */}
        {!isHistorical && (
            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-slate-900/50">
            <button 
                onClick={onCancel}
                className="px-6 py-3 rounded-lg text-slate-300 hover:bg-white/5 font-medium transition"
            >
                Return to Options
            </button>
            <button 
                onClick={onConfirm}
                className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg flex items-center gap-2 transition hover:scale-[1.02] ${
                    option.type === 'DEFENSIVE' ? 'bg-blue-600 hover:bg-blue-500' :
                    option.type === 'MODERATE' ? 'bg-emerald-600 hover:bg-emerald-500' :
                    'bg-orange-600 hover:bg-orange-500'
                }`}
            >
                <CheckCircle className="w-5 h-5" /> Confirm Selection
            </button>
            </div>
        )}
         {isHistorical && (
            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-slate-900/50">
            <button 
                onClick={onCancel}
                className="px-6 py-3 rounded-lg text-slate-300 hover:bg-white/5 font-medium transition"
            >
                Close Analysis
            </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default OptionDetailModal;