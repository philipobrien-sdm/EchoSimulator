import React, { useState } from 'react';
import { AnalysisMetrics } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Activity, Lock, Search, TrendingUp, BarChart2, LogOut, CheckCircle2 } from 'lucide-react';

interface AnalysisDashboardProps {
  metrics: AnalysisMetrics;
  history: AnalysisMetrics[];
  lastMonologue?: string;
  onTurnSelect?: (turnNumber: number) => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ metrics, history, lastMonologue, onTurnSelect }) => {
  const [view, setView] = useState<'LIVE' | 'TIMELINE'>('LIVE');

  const liveData = [
    { name: 'Trust', value: metrics.trustScore, color: '#10b981' }, 
    { name: 'Tension', value: metrics.tensionLevel, color: '#f59e0b' }, 
    { name: 'Goal', value: metrics.goalProgress, color: '#3b82f6' }, 
    { name: 'Auth', value: metrics.authenticityScore, color: '#8b5cf6' }, 
  ];

  const getClosingReadinessColor = (score: number) => {
      if (score >= 80) return 'text-emerald-400';
      if (score >= 50) return 'text-yellow-400';
      return 'text-slate-500';
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Meters Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col h-[280px]">
        <div className="flex justify-between items-center mb-4">
             <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                {view === 'LIVE' ? <Activity className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                {view === 'LIVE' ? "Real-time Metrics" : "Trajectory Timeline"}
            </h3>
            <div className="flex bg-slate-800 rounded-lg p-1">
                <button 
                    onClick={() => setView('LIVE')}
                    className={`p-1.5 rounded-md transition ${view === 'LIVE' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    title="Live View"
                >
                    <BarChart2 className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setView('TIMELINE')}
                    className={`p-1.5 rounded-md transition ${view === 'TIMELINE' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    title="Timeline View"
                >
                    <TrendingUp className="w-4 h-4" />
                </button>
            </div>
        </div>
       
        <div className="flex-1 w-full min-h-0">
            {view === 'LIVE' ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={liveData} layout="vertical" margin={{ left: 0, right: 30, bottom: 0 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={40} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                        <Tooltip 
                            cursor={{fill: '#1e293b'}}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {liveData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <ResponsiveContainer width="100%" height="100%" className="cursor-pointer">
                    <LineChart 
                        data={history} 
                        margin={{ left: -20, right: 10, top: 5, bottom: 5 }}
                        onClick={(e) => {
                            if (e && e.activePayload && e.activePayload[0]) {
                                onTurnSelect?.(e.activePayload[0].payload.turnNumber);
                            }
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="turnNumber" tick={{fill: '#64748b', fontSize: 10}} interval={0} />
                        <YAxis tick={{fill: '#64748b', fontSize: 10}} domain={[0, 100]} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                        />
                        <Line type="monotone" dataKey="trustScore" stroke="#10b981" strokeWidth={2} dot={{ r: 4, strokeWidth: 0, fill: '#10b981' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} name="Trust" />
                        <Line type="monotone" dataKey="tensionLevel" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, strokeWidth: 0, fill: '#f59e0b' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} name="Tension" />
                        <Line type="monotone" dataKey="goalProgress" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} name="Goal" />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
      </div>

      {/* Analysis Text */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex-1 overflow-auto space-y-4">
         <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" /> Tactical Insight
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
                {metrics.lastAssessment || "No analysis available yet."}
            </p>
        </div>

        {/* Closing Readiness */}
        {metrics.closingReadiness !== undefined && (
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                        <LogOut className="w-3 h-3" /> Closing Wisdom
                    </h3>
                    <span className={`text-xs font-bold ${getClosingReadinessColor(metrics.closingReadiness)}`}>
                        {metrics.closingReadiness}% Ready
                    </span>
                 </div>
                 
                 {metrics.closingReadiness >= 70 ? (
                    <div className="flex items-start gap-2">
                         <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                         <div>
                            <p className="text-xs text-emerald-200 mb-1">Good time to sign off.</p>
                            <p className="text-xs text-slate-400 italic">"{metrics.suggestedClosing}"</p>
                         </div>
                    </div>
                 ) : (
                     <p className="text-xs text-slate-500">Not recommended to end yet. Continue building value.</p>
                 )}
            </div>
        )}
        
        {lastMonologue && (
            <div className="pt-2 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Persona Internal State
                </h3>
                <p className="text-xs text-slate-400 italic bg-slate-950 p-3 rounded border border-slate-800/50">
                    "{lastMonologue}"
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDashboard;