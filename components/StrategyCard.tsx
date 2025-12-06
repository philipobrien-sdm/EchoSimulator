import React from 'react';
import { ReplyOption } from '../types';
import { Shield, ArrowRight, Zap, AlertTriangle, Brain, Thermometer, ThumbsUp, ThumbsDown, Activity, Clock, Maximize2 } from 'lucide-react';

interface StrategyCardProps {
  option: ReplyOption;
  onSelect: () => void;
  disabled?: boolean;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ option, onSelect, disabled }) => {
  const getStyle = () => {
    switch (option.type) {
      case 'DEFENSIVE':
        return 'border-blue-500/30 hover:border-blue-500 bg-blue-950/10 text-blue-100';
      case 'MODERATE':
        return 'border-emerald-500/30 hover:border-emerald-500 bg-emerald-950/10 text-emerald-100';
      case 'RISKY':
        return 'border-orange-500/30 hover:border-orange-500 bg-orange-950/10 text-orange-100';
    }
  };

  const getIcon = () => {
    switch (option.type) {
      case 'DEFENSIVE': return <Shield className="w-4 h-4 text-blue-400" />;
      case 'MODERATE': return <ArrowRight className="w-4 h-4 text-emerald-400" />;
      case 'RISKY': return <Zap className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div 
      onClick={!disabled ? onSelect : undefined}
      className={`
        relative group cursor-pointer border rounded-xl p-4 transition-all duration-300 overflow-hidden
        ${getStyle()}
        ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'shadow-lg hover:shadow-xl hover:scale-[1.02]'}
      `}
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
         <Maximize2 className="w-4 h-4 text-white/50" />
      </div>

      <div className="flex justify-between items-start mb-2 relative z-10 pr-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
          {getIcon()}
          {option.type}
        </div>
        <div className="flex items-center gap-1 text-xs font-mono opacity-60">
           <AlertTriangle className="w-3 h-3" /> Risk: {option.predictedReaction.riskScore}%
        </div>
      </div>
      
      <p className="text-sm font-medium mb-3 min-h-[40px] relative z-10 group-hover:font-bold transition-all line-clamp-3">
        "{option.content}"
      </p>

      {/* Default View */}
      <div className="space-y-2 pt-3 border-t border-slate-700/50 group-hover:opacity-0 transition-opacity duration-200">
        <div className="flex items-start gap-2 text-xs text-slate-400">
           <Brain className="w-3 h-3 mt-0.5 shrink-0" />
           <span className="truncate"><span className="text-slate-300 font-semibold">Technique:</span> {option.rhetoricalTechnique}</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-slate-400">
           <Clock className="w-3 h-3 mt-0.5 shrink-0" />
           <span className="truncate"><span className="text-slate-300 font-semibold">Timing:</span> {option.timing}</span>
        </div>
      </div>

      {/* Hover Overlay View */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-slate-900/95 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-center border-t border-slate-700 text-xs space-y-2 z-20 h-[65%]">
         <div className="flex gap-2">
            <Activity className="w-3 h-3 text-slate-400 mt-0.5" />
            <span className="text-slate-300 line-clamp-1">
                <strong className="text-white">Likely:</strong> {option.predictedReaction.likelyOutcome}
            </span>
         </div>
         <div className="flex gap-2">
            <ThumbsUp className="w-3 h-3 text-emerald-400 mt-0.5" />
             <span className="text-slate-300 line-clamp-1">
                <strong className="text-emerald-400">Best:</strong> {option.predictedReaction.bestCase}
            </span>
         </div>
         <div className="flex gap-2">
            <ThumbsDown className="w-3 h-3 text-rose-400 mt-0.5" />
             <span className="text-slate-300 line-clamp-1">
                <strong className="text-rose-400">Worst:</strong> {option.predictedReaction.worstCase}
            </span>
         </div>
      </div>
    </div>
  );
};

export default StrategyCard;