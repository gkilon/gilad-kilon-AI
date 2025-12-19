
import React, { useState, useEffect, useMemo } from 'react';
import { TeamSynergyPulse, UserSession } from '../types';
import { saveTeamPulse, getTeamPulses, getSystemConfig } from '../firebase';
import { getSynergyInsight } from '../geminiService';

const LineChart: React.FC<{ data: TeamSynergyPulse[], metric: string, color: string }> = ({ data, metric, color }) => {
  if (data.length < 2) return <div className="h-1 bg-slate-800 rounded-full w-full opacity-10"></div>;
  const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
  
  const points = sorted.map((d, i) => {
    const x = (i / (sorted.length - 1)) * 100;
    const val = (d[metric as keyof TeamSynergyPulse] as number) || 3;
    const y = 100 - ((val - 1) / 5) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-16 relative mt-4">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <polyline 
          fill="none" 
          stroke={color} 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          points={points} 
          className="drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]"
        />
        {sorted.map((d, i) => {
          const x = (i / (sorted.length - 1)) * 100;
          const val = (d[metric as keyof TeamSynergyPulse] as number) || 3;
          const y = 100 - ((val - 1) / 5) * 100;
          return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
        })}
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
  const [copyStatus, setCopyStatus] = useState(false);
  
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

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?teamId=${session?.teamId}&view=synergy`;
    navigator.clipboard.writeText(url);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
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

  const handleAiAnalysis = async () => {
    if (!aggregateMetrics) return;
    setIsAiAnalyzing(true);
    try {
      const vibes = cloudHistory.map(h => h.vibe).filter(v => v);
      const insight = await getSynergyInsight(aggregateMetrics, vibes);
      setAiInsight(insight);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!session?.teamId) return;
    setLoading(true);
    await saveTeamPulse(session.teamId, pulse);
    setSubmitted(true);
    setLoading(false);
    if (session.isManager) loadCloudData();
  };

  if (submitted && !session?.isManager) return (
    <div className="py-40 text-center space-y-8 animate-fadeIn">
      <div className="text-8xl">🚀</div>
      <h2 className="text-5xl font-bold text-white italic">תודה על השיתוף!</h2>
      <p className="text-slate-400 text-xl">הקול שלך עוזר לצוות להשתפר ולהיות מסונכרן יותר.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn pb-20 text-right">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-end">
             <span className="text-[10px] font-black text-cyan-brand uppercase tracking-widest">Team Performance Pulse</span>
             <div className="w-2 h-2 rounded-full bg-cyan-brand animate-pulse"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic">דופק <span className="text-cyan-brand">צוותי</span></h2>
          <p className="text-slate-400 text-xl font-medium max-w-2xl">מדידת מגמות, סנכרון ואיכות עבודת הצוות על בסיס קריטריונים אסטרטגיים.</p>
        </div>

        {session?.isManager && (
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={handleShare}
              className="bg-slate-900 border border-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-cyan-brand transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              {copyStatus ? "✓ הקישור הועתק" : "🔗 שלח שאלון לצוות"}
            </button>
            <button 
              onClick={handleAiAnalysis}
              disabled={isAiAnalyzing || cloudHistory.length === 0}
              className="bg-cyan-brand text-slate-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all shadow-2xl disabled:opacity-20 flex items-center justify-center gap-3"
            >
              {isAiAnalyzing ? "מנתח נתונים..." : "🪄 ניתוח AI לתובנות מנהל"}
            </button>
          </div>
        )}
      </div>

      {/* Manager's View: Analytics & Progress */}
      {session?.isManager && (
        <div className="space-y-10 animate-fadeIn">
          {aggregateMetrics ? (
            <div className="glass-card rounded-[3.5rem] p-10 border-white/5 bg-slate-900/50 shadow-2xl grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {metrics.map(m => (
                <div key={m.key} className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5 group hover:border-cyan-brand/30 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl group-hover:scale-125 transition-transform">{m.icon}</span>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</p>
                      <h4 className="text-4xl font-black text-white">{aggregateMetrics[m.key]} <span className="text-sm text-slate-600">/ 6</span></h4>
                    </div>
                  </div>
                  <LineChart data={cloudHistory} metric={m.key} color="#2dd4bf" />
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tight mt-4">מגמה לאורך {cloudHistory.length} דגימות</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-[3.5rem] p-20 text-center border-dashed border-white/10 opacity-40 italic">
               אין עדיין מספיק נתונים להצגת גרף מגמות. שלח את הקישור לצוות כדי להתחיל.
            </div>
          )}

          {aiInsight && (
            <div className="glass-card p-12 rounded-[3.5rem] bg-gradient-to-br from-slate-950 to-black border-cyan-brand/20 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 w-2 h-full bg-cyan-brand"></div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-cyan-brand/10 rounded-xl flex items-center justify-center text-2xl">🪄</div>
                  <h3 className="text-xs font-black text-cyan-brand uppercase tracking-[0.5em]">AI STRATEGIC SYNTHESIS</h3>
               </div>
               <div className="text-2xl font-bold text-white leading-relaxed whitespace-pre-wrap italic">
                 {aiInsight}
               </div>
            </div>
          )}
        </div>
      )}

      {/* Input Section */}
      <div className="glass-card rounded-[3.5rem] p-12 space-y-12 border-white/5 shadow-2xl bg-slate-900/40 relative">
        <div className="flex items-center gap-4 mb-4">
           <span className="w-12 h-12 rounded-2xl bg-cyan-brand/10 flex items-center justify-center text-2xl">📊</span>
           <h3 className="text-2xl font-black text-white">עדכון דופק שוטף</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {metrics.map(metric => (
            <div key={metric.key} className="space-y-4 p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 hover:border-cyan-brand/20 transition-all">
              <div className="flex justify-between items-center">
                <label className="text-xl font-bold text-white">{metric.label}</label>
                <div className="flex items-center gap-2">
                   <span className="text-sm text-slate-500 font-bold uppercase">דירוג:</span>
                   <span className="text-3xl font-black text-cyan-brand">{pulse[metric.key]}</span>
                </div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="6" 
                step="1" 
                value={pulse[metric.key]} 
                onChange={e => setPulse({...pulse, [metric.key]: parseInt(e.target.value)})} 
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-brand" 
              />
              <div className="flex justify-between text-[9px] font-black text-slate-700 uppercase tracking-widest">
                <span>חלש מאוד</span>
                <span>מצוין</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-4">מה התחושה הכללית בצוות כרגע? (אופציונלי)</label>
           <textarea 
             className="w-full bg-slate-950 rounded-3xl p-8 border border-white/5 text-slate-200 text-xl min-h-[160px] text-right focus:border-cyan-brand transition-all outline-none placeholder-slate-800 font-medium" 
             placeholder="שתף כאן מחשבות, תסכולים או הצלחות..." 
             value={pulse.vibe} 
             onChange={e => setPulse({...pulse, vibe: e.target.value})} 
           />
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="w-full bg-cyan-brand text-slate-950 py-8 rounded-[3rem] font-black text-3xl hover:bg-white transition-all shadow-2xl active:scale-95 disabled:opacity-20"
        >
          {loading ? "שולח נתונים..." : "שלח דירוג ועדכן דופק"}
        </button>
      </div>

      {session?.isManager && cloudHistory.length > 0 && (
        <div className="space-y-6 pt-10">
           <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] pr-4">היסטוריית תגובות מילוליות (Raw Vibe)</h3>
           <div className="grid gap-4">
              {cloudHistory.filter(h => h.vibe).slice(0, 5).map((h, i) => (
                <div key={i} className="glass-card p-6 rounded-3xl border-white/5 text-slate-300 italic font-medium">
                   "{h.vibe}"
                   <div className="text-[9px] text-slate-600 mt-2 font-black uppercase">
                     {new Date(h.timestamp).toLocaleDateString('he-IL')}
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default TeamSynergy;
