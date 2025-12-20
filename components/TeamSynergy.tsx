
import React, { useState, useEffect, useMemo } from 'react';
import { TeamSynergyPulse, UserSession } from '../types';
import { saveTeamPulse, getTeamPulses, getSystemConfig } from '../firebase';
import { getSynergyInsight } from '../geminiService';

const LineChart: React.FC<{ data: TeamSynergyPulse[], metric: string, color: string }> = ({ data, metric, color }) => {
  if (data.length < 2) return <div className="h-1 bg-brand-dark/5 rounded-full w-full"></div>;
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
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          points={points} 
        />
        {sorted.map((d, i) => {
          const x = (i / (sorted.length - 1)) * 100;
          const val = (d[metric as keyof TeamSynergyPulse] as number) || 3;
          const y = 100 - ((val - 1) / 5) * 100;
          return <circle key={i} cx={x} cy={y} r="4" fill="#1a1a1a" />;
        })}
      </svg>
    </div>
  );
};

const TeamSynergy: React.FC<{ session: UserSession | null, onBack?: () => void }> = ({ session, onBack }) => {
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
    <div className="py-40 text-center space-y-8 animate-fadeIn text-right px-6">
      <div className="text-8xl">🚀</div>
      <h2 className="text-5xl font-black text-brand-dark italic">תודה על השיתוף!</h2>
      <p className="text-brand-muted text-xl font-bold">הקול שלך עוזר לצוות להשתפר ולהיות מסונכרן יותר.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn pt-28 pb-24 text-right px-6">
      
      {onBack && (
        <div className="mb-8">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-brand-accent font-black text-sm uppercase tracking-widest hover:text-brand-dark transition-all group"
          >
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            <span>חזרה לתפריט המעבדה</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b-4 border-brand-dark pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-end">
             <span className="text-[11px] font-black text-brand-accent uppercase tracking-[0.4em]">Performance Pulse</span>
             <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-brand-dark tracking-tighter uppercase italic leading-none">דופק צוותי</h2>
          <p className="text-brand-muted text-2xl font-bold italic max-w-2xl">מדידת מגמות, סנכרון ואיכות עבודת הצוות על בסיס קריטריונים אסטרטגיים.</p>
        </div>

        {session?.isManager && (
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={handleShare}
              className="bg-white border-4 border-brand-dark text-brand-dark px-8 py-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-dark hover:text-white transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.1)] active:scale-95"
            >
              {copyStatus ? "✓ הקישור הועתק" : "🔗 שלח שאלון לצוות"}
            </button>
            <button 
              onClick={handleAiAnalysis}
              disabled={isAiAnalyzing || cloudHistory.length === 0}
              className="bg-brand-accent text-white px-8 py-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-dark transition-all shadow-[8px_8px_0px_rgba(37,99,235,0.2)] disabled:opacity-20 active:scale-95"
            >
              {isAiAnalyzing ? "מנתח נתונים..." : "🪄 ניתוח AI לתובנות"}
            </button>
          </div>
        )}
      </div>

      {/* Manager Dashboard */}
      {session?.isManager && (
        <div className="space-y-12 animate-fadeIn">
          {aggregateMetrics ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {metrics.map(m => (
                <div key={m.key} className="studio-card p-10 bg-white border-brand-dark shadow-[10px_10px_0px_rgba(0,0,0,0.05)] group">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-4xl">{m.icon}</span>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{m.label}</p>
                      <h4 className="text-5xl font-black text-brand-dark">{aggregateMetrics[m.key]} <span className="text-sm text-brand-muted">/ 6</span></h4>
                    </div>
                  </div>
                  <LineChart data={cloudHistory} metric={m.key} color="#2563eb" />
                  <p className="text-[9px] font-bold text-brand-muted uppercase tracking-tight mt-6">מגמה לאורך {cloudHistory.length} דגימות</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="studio-card p-24 text-center border-dashed border-brand-dark/20 opacity-40 italic bg-white/50">
               אין עדיין נתונים. שלח את הקישור לצוות כדי להתחיל במדידה.
            </div>
          )}

          {aiInsight && (
            <div className="studio-card p-12 md:p-16 bg-brand-dark text-white shadow-[16px_16px_0px_rgba(37,99,235,0.2)] relative overflow-hidden">
               <div className="flex items-center gap-4 mb-8">
                  <span className="text-3xl">🪄</span>
                  <h3 className="text-[11px] font-black text-brand-accent uppercase tracking-[0.6em] italic">AI STRATEGIC INSIGHT</h3>
               </div>
               <div className="text-2xl md:text-4xl font-black italic leading-tight whitespace-pre-wrap">
                 "{aiInsight}"
               </div>
            </div>
          )}
        </div>
      )}

      {/* Data Input Form */}
      <div className="studio-card p-12 md:p-16 border-brand-dark bg-white shadow-[16px_16px_0px_rgba(26,26,26,0.05)] space-y-16">
        <div className="flex items-center gap-4 border-b-2 border-brand-dark pb-6">
           <span className="text-4xl">📊</span>
           <h3 className="text-3xl font-black text-brand-dark italic">עדכון דופק שוטף</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {metrics.map(metric => (
            <div key={metric.key} className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-2xl font-black text-brand-dark italic">{metric.label}</label>
                <span className="text-4xl font-black text-brand-accent">{pulse[metric.key]}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="6" 
                step="1" 
                value={pulse[metric.key]} 
                onChange={e => setPulse({...pulse, [metric.key]: parseInt(e.target.value)})} 
                className="w-full h-3 bg-brand-beige border-2 border-brand-dark appearance-none cursor-pointer accent-brand-dark" 
              />
              <div className="flex justify-between text-[10px] font-black text-brand-muted uppercase tracking-widest">
                <span>חלש מאוד</span>
                <span>מצוין</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
           <label className="text-[11px] font-black text-brand-muted uppercase tracking-widest">איך התחושה הכללית בצוות כרגע? (אופציונלי)</label>
           <textarea 
             className="w-full bg-brand-beige/20 border-4 border-brand-dark p-8 text-2xl font-bold text-brand-dark outline-none focus:border-brand-accent transition-all placeholder-brand-dark/10 min-h-[160px]" 
             placeholder="שתף כאן מחשבות, תסכולים או הצלחות..." 
             value={pulse.vibe} 
             onChange={e => setPulse({...pulse, vibe: e.target.value})} 
           />
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="w-full bg-brand-dark text-white py-8 font-black text-3xl hover:bg-brand-accent transition-all shadow-[12px_12px_0px_rgba(0,0,0,0.1)] active:scale-95 disabled:opacity-20"
        >
          {loading ? "שולח נתונים..." : "עדכן דופק צוותי ←"}
        </button>
      </div>

      {session?.isManager && cloudHistory.length > 0 && (
        <div className="space-y-8 pt-10">
           <h3 className="text-[11px] font-black text-brand-muted uppercase tracking-[0.4em] border-b-2 border-brand-dark inline-block italic">קולות מהשטח (Raw Vibe)</h3>
           <div className="grid gap-6">
              {cloudHistory.filter(h => h.vibe).slice(0, 5).map((h, i) => (
                <div key={i} className="studio-card p-8 border-brand-dark bg-white shadow-sm italic text-xl font-bold">
                   "{h.vibe}"
                   <div className="text-[9px] text-brand-muted mt-4 font-black uppercase tracking-widest">
                     {new Date(h.timestamp).toLocaleDateString('he-IL')} • TEAM RESPONSE
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
