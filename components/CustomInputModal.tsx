import React, { useState } from 'react';
import { ReplyOption } from '../types';
import { Sparkles, Send, X, Edit3, Loader2 } from 'lucide-react';

interface CustomInputModalProps {
  onEvaluate: (text: string) => Promise<ReplyOption>;
  onConfirm: (option: ReplyOption) => void;
  onCancel: () => void;
}

const CustomInputModal: React.FC<CustomInputModalProps> = ({ onEvaluate, onConfirm, onCancel }) => {
  const [draft, setDraft] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluatedOption, setEvaluatedOption] = useState<ReplyOption | null>(null);

  const handleEvaluate = async () => {
    if (!draft.trim()) return;
    setIsEvaluating(true);
    try {
        const option = await onEvaluate(draft);
        setEvaluatedOption(option);
    } finally {
        setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-cyan-400" /> Write Custom Reply
          </h2>
          <button onClick={onCancel} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
            {!evaluatedOption ? (
                <>
                    <textarea 
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Type your response here..."
                        className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none resize-none placeholder:text-slate-600"
                        autoFocus
                    />
                    <div className="flex justify-end gap-3">
                        <button onClick={onCancel} className="px-4 py-2 text-slate-400 hover:text-white transition">Cancel</button>
                        <button 
                            onClick={handleEvaluate}
                            disabled={!draft.trim() || isEvaluating}
                            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition"
                        >
                            {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Evaluate Strategy
                        </button>
                    </div>
                </>
            ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                     <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <p className="text-slate-300 italic">"{evaluatedOption.content}"</p>
                     </div>

                     <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-800/50 p-2 rounded-lg">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Risk</div>
                            <div className={`text-sm font-bold ${evaluatedOption.predictedReaction.riskScore > 70 ? 'text-orange-400' : 'text-emerald-400'}`}>
                                {evaluatedOption.predictedReaction.riskScore}%
                            </div>
                        </div>
                         <div className="bg-slate-800/50 p-2 rounded-lg">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Type</div>
                            <div className="text-sm font-bold text-cyan-400">{evaluatedOption.type}</div>
                        </div>
                         <div className="bg-slate-800/50 p-2 rounded-lg">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Impact</div>
                            <div className="text-sm font-bold text-slate-300">{evaluatedOption.predictedReaction.emotionalImpact}</div>
                        </div>
                     </div>

                     <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <div className="text-xs text-slate-400 mb-1 font-semibold uppercase">Likely Outcome</div>
                        <div className="text-sm text-slate-200">{evaluatedOption.predictedReaction.likelyOutcome}</div>
                     </div>

                     <div className="flex justify-between gap-3 pt-2">
                        <button 
                            onClick={() => setEvaluatedOption(null)}
                            className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => onConfirm(evaluatedOption)}
                            className="flex-[2] px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" /> Send Message
                        </button>
                     </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default CustomInputModal;