import React, { useState } from 'react';
import { MessageSquare, Send, X, UserCog } from 'lucide-react';

interface PersonaInputModalProps {
  personaName: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
}

const PersonaInputModal: React.FC<PersonaInputModalProps> = ({ personaName, onConfirm, onCancel }) => {
  const [text, setText] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-lg font-bold text-purple-200 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-purple-400" /> Self-Play Mode
          </h2>
          <button onClick={onCancel} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
            <div className="bg-purple-900/10 border border-purple-500/20 p-3 rounded-lg">
                <p className="text-xs text-purple-300">
                    You are controlling <strong>{personaName}</strong>. Enter their response below to proceed. 
                    The AI will analyze the impact of this response on the metrics.
                </p>
            </div>

            <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`What does ${personaName} say?`}
                className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none placeholder:text-slate-600"
                autoFocus
            />

            <div className="flex justify-end gap-3 pt-2">
                <button 
                    onClick={onCancel} 
                    className="px-4 py-2 text-slate-400 hover:text-white transition"
                >
                    Cancel
                </button>
                <button 
                    onClick={() => onConfirm(text)}
                    disabled={!text.trim()}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition shadow-lg shadow-purple-900/20"
                >
                    <Send className="w-4 h-4" /> Submit Response
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaInputModal;