import React, { useState } from 'react';
import { X, BookOpen, Activity, Zap, Shield, Brain, Lightbulb, Target, AlertTriangle, AlertOctagon, UserCog, Bot, Mic, Scale } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'PURPOSE' | 'DEVICES' | 'FALLACIES'>('PURPOSE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
             <button 
                onClick={() => setActiveTab('PURPOSE')}
                className={`text-xs md:text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'PURPOSE' ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50' : 'text-slate-500 hover:text-slate-300'}`}
             >
                Mission & Mechanics
             </button>
             <button 
                onClick={() => setActiveTab('DEVICES')}
                className={`text-xs md:text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'DEVICES' ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' : 'text-slate-500 hover:text-slate-300'}`}
             >
                Rhetorical Library
             </button>
             <button 
                onClick={() => setActiveTab('FALLACIES')}
                className={`text-xs md:text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'FALLACIES' ? 'bg-rose-900/30 text-rose-400 border border-rose-800/50' : 'text-slate-500 hover:text-slate-300'}`}
             >
                Logical Fallacies
             </button>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-2 hover:bg-slate-800 rounded-full transition shrink-0 ml-4">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'PURPOSE' && (
                <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-300">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                            <Target className="w-6 h-6 text-cyan-500" />
                            The Purpose
                        </h2>
                        <p className="text-slate-300 leading-relaxed text-lg">
                            EchoSimulator is a <strong>tactical training ground</strong> for high-stakes conversations. 
                            Whether you are negotiating a salary, navigating a family conflict, or de-escalating a client crisis, 
                            the outcome often depends on <em>emotional regulation</em> and <em>strategic foresight</em>.
                        </p>
                    </section>

                     <section className="bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                             <Activity className="w-5 h-5 text-cyan-400" /> Two Ways to Play
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                                    <Bot className="w-4 h-4" /> AUTO MODE (Simulation)
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    The AI roleplays the target completely. It reacts to your messages based on its psychological profile. 
                                    Use this to test your ability to persuade an unpredictable agent.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                                    <UserCog className="w-4 h-4" /> SELF-PLAY MODE (Analysis)
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    You control <strong>both sides</strong>. You write what you say, and you write what the target says. 
                                    The AI acts as an analyst, scoring your exchange and revealing the hidden emotional subtext of the words you chose for the target.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                            <Brain className="w-8 h-8 text-emerald-400 mb-3" />
                            <h3 className="font-bold text-slate-200 mb-2">Predictive Analysis</h3>
                            <p className="text-sm text-slate-400">
                                Before you commit to a reply, the engine predicts the likely emotional impact and outcome, allowing you to test risky moves.
                            </p>
                        </div>
                        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                            <Activity className="w-8 h-8 text-orange-400 mb-3" />
                            <h3 className="font-bold text-slate-200 mb-2">Real-time Metrics</h3>
                            <p className="text-sm text-slate-400">
                                Watch metrics like <span className="text-emerald-400">Trust</span> and <span className="text-orange-400">Tension</span> evolve turn-by-turn.
                            </p>
                        </div>
                        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                            <Shield className="w-8 h-8 text-blue-400 mb-3" />
                            <h3 className="font-bold text-slate-200 mb-2">Strategy Selection</h3>
                            <p className="text-sm text-slate-400">
                                Choose between Defensive (Safety), Moderate (Progress), or Risky (Leverage) approaches.
                            </p>
                        </div>
                    </div>

                    <div className="bg-yellow-950/20 border border-yellow-700/30 p-4 rounded-xl mt-8 flex gap-4">
                         <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
                         <div>
                            <h3 className="font-bold text-yellow-500 text-sm uppercase mb-1">Disclaimer</h3>
                            <p className="text-sm text-yellow-200/70 leading-relaxed">
                                This tool is intended for <strong>simulation and practice purposes only</strong>. It is designed to help you build skills and develop an appreciation for the art of negotiation. 
                                It should not be relied upon as a substitute for professional advice or used in real-time during critical high-stakes situations. Real human interactions are infinitely complex; use this tool to sharpen your instincts, not to replace them.
                            </p>
                         </div>
                    </div>
                </div>
            )}

            {activeTab === 'DEVICES' && (
                <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-300">
                     <section>
                        <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-purple-500" />
                            The Rhetorical Toolkit
                        </h2>
                        <p className="text-slate-300 mb-8">
                            Rhetoric is the art of persuasion. In high-stakes environments, 
                            <strong> perception often overrides fact</strong>. These devices are tools to shape that perception. 
                        </p>

                        <div className="space-y-8">
                            
                            <div className="flex gap-4">
                                <div className="mt-1"><Zap className="w-5 h-5 text-yellow-400" /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-200">Anchoring</h3>
                                    <p className="text-sm text-slate-400 mb-2 italic">"I usually charge $50k for this, but..."</p>
                                    <p className="text-slate-300 text-sm">
                                        <strong>The Mechanic:</strong> Establishing a reference point (often extreme) early in a negotiation. 
                                        Even if the number is rejected, it warps the counter-party's perception of value.
                                    </p>
                                </div>
                            </div>

                            <hr className="border-slate-800" />

                             <div className="flex gap-4">
                                <div className="mt-1"><Lightbulb className="w-5 h-5 text-cyan-400" /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-200">Reframing</h3>
                                    <p className="text-sm text-slate-400 mb-2 italic">"It's not a cost; it's an investment in security."</p>
                                    <p className="text-slate-300 text-sm">
                                        <strong>The Mechanic:</strong> Changing the conceptual or emotional setting of a viewpoint. 
                                        A "problem" becomes a "challenge"; a "spending" becomes "saving later".
                                    </p>
                                </div>
                            </div>

                            <hr className="border-slate-800" />

                            <div className="flex gap-4">
                                <div className="mt-1"><Activity className="w-5 h-5 text-emerald-400" /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-200">Tactical Empathy / Labeling</h3>
                                    <p className="text-sm text-slate-400 mb-2 italic">"It seems like you feel this is unfair to the team."</p>
                                    <p className="text-slate-300 text-sm">
                                        <strong>The Mechanic:</strong> Vocalizing the other person's emotions. 
                                        If they are angry, labeling it diffuses it. If they are hesitant, labeling it validates them.
                                    </p>
                                </div>
                            </div>

                            <hr className="border-slate-800" />

                             <div className="flex gap-4">
                                <div className="mt-1"><Shield className="w-5 h-5 text-rose-400" /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-200">The "No" Strategy</h3>
                                    <p className="text-sm text-slate-400 mb-2 italic">"Is it ridiculous to ask for an extension?"</p>
                                    <p className="text-slate-300 text-sm">
                                        <strong>The Mechanic:</strong> People feel safe saying "No" because it feels like protection/control. 
                                        Phrasing questions to invite a "No" often yields more honest engagement than fishing for a "Yes".
                                    </p>
                                </div>
                            </div>

                            <hr className="border-slate-800" />

                            <div className="flex gap-4">
                                <div className="mt-1"><Mic className="w-5 h-5 text-indigo-400" /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-200">Mirroring</h3>
                                    <p className="text-sm text-slate-400 mb-2 italic">Them: "I'm really busy." You: "You're really busy?"</p>
                                    <p className="text-slate-300 text-sm">
                                        <strong>The Mechanic:</strong> Repeating the last 3 words (or critical keywords) the other person said. 
                                        It insinuates similarity and encourages them to elaborate without you having to ask a direct question.
                                    </p>
                                </div>
                            </div>

                            <hr className="border-slate-800" />

                            <div className="flex gap-4">
                                <div className="mt-1"><Scale className="w-5 h-5 text-teal-400" /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-200">Calibrated Questions</h3>
                                    <p className="text-sm text-slate-400 mb-2 italic">"How am I supposed to do that?"</p>
                                    <p className="text-slate-300 text-sm">
                                        <strong>The Mechanic:</strong> Open-ended questions (usually starting with 'How' or 'What') that force the other party to pause and think. 
                                        It shifts the burden of solving the problem onto them, while making you appear to be asking for help rather than refusing.
                                    </p>
                                </div>
                            </div>
                            
                            <hr className="border-slate-800" />

                             <div className="flex gap-4">
                                <div className="mt-1"><Brain className="w-5 h-5 text-pink-400" /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-200">Accusation Audit</h3>
                                    <p className="text-sm text-slate-400 mb-2 italic">"You're probably going to think I'm demanding and unreasonable..."</p>
                                    <p className="text-slate-300 text-sm">
                                        <strong>The Mechanic:</strong> Listing every negative thing the other person is likely thinking about you <em>before</em> they can say it. 
                                        By bringing the accusations into the light yourself, you deflate their power and show high self-awareness.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'FALLACIES' && (
                <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-300">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                            <AlertOctagon className="w-6 h-6 text-rose-500" />
                            Logical Fallacies
                        </h2>
                        <p className="text-slate-300 mb-8">
                            A logical fallacy is a flaw in reasoning. Negotiators often use them (intentionally or not) to manipulate outcomes. 
                            Identifying them is the first step to neutralizing them.
                        </p>

                        <div className="grid grid-cols-1 gap-6">
                            
                            {/* Fallacy Card 1 */}
                            <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-6 hover:border-rose-900/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-slate-200">Straw Man</h3>
                                    <span className="text-xs bg-rose-900/20 text-rose-400 px-2 py-1 rounded border border-rose-900/30">Distortion</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-3 italic">
                                    "So you're saying we should just give away our product for free?" (When you asked for a small discount).
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">The Mechanism</h4>
                                        <p className="text-sm text-slate-300">Attacking a distorted, extreme, or simplified version of your argument rather than the argument itself.</p>
                                    </div>
                                    <div className="bg-slate-900 p-3 rounded border border-slate-800">
                                        <h4 className="text-xs font-bold text-emerald-400 uppercase mb-1">The Counter</h4>
                                        <p className="text-sm text-slate-300">"That's not what I said. Let's look at the actual numbers I proposed." Ignore the distortion and return to the original point immediately.</p>
                                    </div>
                                </div>
                            </div>

                             {/* Fallacy Card 2 */}
                             <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-6 hover:border-rose-900/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-slate-200">False Dichotomy</h3>
                                    <span className="text-xs bg-rose-900/20 text-rose-400 px-2 py-1 rounded border border-rose-900/30">Manipulation</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-3 italic">
                                    "You're either with us, or you're against us."
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">The Mechanism</h4>
                                        <p className="text-sm text-slate-300">Presenting a situation as having only two options (usually extremes) when there are actually other possibilities.</p>
                                    </div>
                                    <div className="bg-slate-900 p-3 rounded border border-slate-800">
                                        <h4 className="text-xs font-bold text-emerald-400 uppercase mb-1">The Counter</h4>
                                        <p className="text-sm text-slate-300">"Are those really the only two options? What if we tried [Option C]?" Refuse to accept the binary frame.</p>
                                    </div>
                                </div>
                            </div>

                             {/* Fallacy Card 3 */}
                             <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-6 hover:border-rose-900/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-slate-200">Ad Hominem</h3>
                                    <span className="text-xs bg-rose-900/20 text-rose-400 px-2 py-1 rounded border border-rose-900/30">Attack</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-3 italic">
                                    "You're too young to understand how this business works."
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">The Mechanism</h4>
                                        <p className="text-sm text-slate-300">Attacking your character, age, or background instead of addressing your argument. It attempts to discredit the source to invalidate the fact.</p>
                                    </div>
                                    <div className="bg-slate-900 p-3 rounded border border-slate-800">
                                        <h4 className="text-xs font-bold text-emerald-400 uppercase mb-1">The Counter</h4>
                                        <p className="text-sm text-slate-300">"My age isn't on the table, but this proposal is. Let's focus on the merits of the deal." Maintain cool professionalism; do not defend yourself, defend the topic.</p>
                                    </div>
                                </div>
                            </div>

                             {/* Fallacy Card 4 */}
                             <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-6 hover:border-rose-900/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-slate-200">Sunk Cost Fallacy</h3>
                                    <span className="text-xs bg-rose-900/20 text-rose-400 px-2 py-1 rounded border border-rose-900/30">Bias</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-3 italic">
                                    "We've already spent $50,000 on this software, we can't switch now."
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">The Mechanism</h4>
                                        <p className="text-sm text-slate-300">Reasoning that further investment is warranted on the fact that resources have already been invested, even if the future outcome is bleak.</p>
                                    </div>
                                    <div className="bg-slate-900 p-3 rounded border border-slate-800">
                                        <h4 className="text-xs font-bold text-emerald-400 uppercase mb-1">The Counter</h4>
                                        <p className="text-sm text-slate-300">"If we were starting from scratch today with zero investment, would we still choose this path?" Isolate the future decision from the past expense.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-center">
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm font-medium">
                Close Guide
            </button>
        </div>

      </div>
    </div>
  );
};

export default AboutModal;