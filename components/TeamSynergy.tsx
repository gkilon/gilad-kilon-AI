
import React, { useState, useEffect, useMemo } from 'react';
import { TeamSynergyPulse, UserSession } from '../types';
import { saveTeamPulse, getTeamPulses, isFirebaseReady, checkWorkspaceExists, getSystemConfig } from '../firebase';
import { getSynergyInsight } from '../geminiService';

const LineChart: React.FC<{ data: TeamSynergyPulse[], metric: string, color: string }> = ({ data, metric, color }) => {
  if (data.length < 2) return <div className="h-1 bg-slate-800 rounded-full w-full opacity-20"></div>;
  const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
  const points = sorted.map((d, i) => {
    const x = (i / (sorted.length - 1)) * 100;
    const y = 100 - (((d[metric as keyof TeamSynergyPulse] as number || 3) - 1) / 5) * 100;
    return `${x},${y}`;
  }).join(' ');
  return (
    <div className="w-full h-12 relative mt-2 opacity-60">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" points={points} />
      </svg>
    </div>
  );
};

const TeamSynergy: React.FC<{ session: UserSession | null }> = ({ session }) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [pulse, setPulse] = useState<any>({ vibe: '', timestamp: Date.now(), teamId: session?.teamId || '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cloudHistory, setCloudHistory] = useState<TeamSynergyPulse[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  
  useEffect(() => {
    getSystemConfig().then(config => {
      setMetrics(config.metrics);
      const initialPulse: any = { vibe: '', timestamp: Date.now(), teamId: session?.teamId || '' };
      config.metrics.forEach((m: any) => initialPulse[m.key] = 3);
      setPulse(initialPulse);
    });
    if (session?.teamId && session.isManager) loadCloudData();
  }, [session]);

  const loadCloudData = async () => {
    const data = await getTeamPulses(session!.teamId);
    setCloudHistory(data as TeamSynergyPulse[]);
  };

  const aggregateMetrics = useMemo(() => {
    if (cloudHistory.length === 0 || metrics.length === 0) return null;
    const result: any = { count: cloudHistory.length };
    metrics.forEach(m => {
      const sum = cloudHistory.reduce((acc, curr) => acc + (curr[m.key as keyof TeamSynergyPulse] as number || 0), 0);
      result[m.key] = (sum / cloudHistory.length).toFixed(1);
    });
    return result;
  }, [cloudHistory, metrics]);

  const handleSubmit = async () => {
    if (!session?.teamId) return;
    setLoading(true);
    await saveTeamPulse(session.teamId, pulse);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) return <div className="py-40 text-center text-white text-3xl font-black italic animate-bounce">תודה! העדכון נשלח בהצלחה.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn pb-20 text-right">
      <div className="space-y-4">
        <h2 className="text-6xl font-black text-white tracking-tighter uppercase">דופק צוותי תקופתי</h2>
        <p className="text-slate-400 text-xl font-medium">מדידת מגמות, סנכרון ואיכות עבודת הצוות.</p>
      </div>

      {session?.isManager && aggregateMetrics && (
        <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-slate-900/50 shadow-2xl grid md:grid-cols-3 gap-12">
          {metrics.map(m => (
            <div key={m.key} className="text-center space-y-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-3xl font-black text-cyan-brand">{aggregateMetrics[m.key]}</span>
                <span className="text-2xl">{m.icon}</span>
              </div>
              <LineChart data={cloudHistory} metric={m.key} color="#2dd4bf" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight pt-2">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card rounded-[3.5rem] p-12 space-y-12 border-white/5 shadow-2xl bg-slate-900/40">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {metrics.map(metric => (
            <div key={metric.key} className="space-y-4 p-6 bg-white/[0.02] rounded-3xl border border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-lg font-black text-white">{metric.label}</label>
                <span className="text-3xl font-black text-cyan-brand">{pulse[metric.key]}</span>
              </div>
              <input type="range" min="1" max="6" step="1" value={pulse[metric.key]} onChange={e => setPulse({...pulse, [metric.key]: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-brand" />
            </div>
          ))}
        </div>
        <textarea className="w-full bg-slate-950 rounded-3xl p-6 border border-white/5 text-slate-200 text-lg min-h-[140px] text-right" placeholder="שיתוף תחושות מהשטח..." value={pulse.vibe} onChange={e => setPulse({...pulse, vibe: e.target.value})} />
        <button onClick={handleSubmit} disabled={loading} className="w-full bg-cyan-brand text-slate-950 py-7 rounded-[3rem] font-black text-2xl hover:bg-white transition-all">{loading ? "שולח..." : "שלח דירוג רבעוני"}</button>
      </div>
    </div>
  );
};

export default TeamSynergy;
