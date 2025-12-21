
import React, { useState, useEffect, useMemo } from 'react';
import { TeamSynergyPulse, UserSession } from '../types';
import { saveTeamPulse, getTeamPulses, getSystemConfig } from '../firebase';
import { getSynergyInsight } from '../geminiService';

const TrendLine: React.FC<{ data: TeamSynergyPulse[], metric: string, color: string }> = ({ data, metric, color }) => {
  if (data.length < 2) return <div className="h-2 bg-brand-dark/5 rounded-full w-full"></div>;
  const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
  
  const points = sorted.map((d, i) => {
    const x = (i / (sorted.length - 1)) * 100;
    const val = (d[metric as keyof TeamSynergyPulse] as number) || 3;
    const y = 100 - ((val - 1) / 5) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-24 relative mt-4 group">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <polyline 
          fill="none" 
          stroke={color} 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          points={points} 
          className="drop-shadow-sm"
        />
        {sorted.map((d, i) => {
          const x = (i / (sorted.length - 1)) * 100;
          const val = (d[metric as keyof TeamSynergyPulse] as number) || 3;
          const y = 100 - ((val - 1) / 5) * 100;
          return (
            <circle 
              key={i} 
              cx={x} cy={y} r="3" 
              fill="#1a1a1a" 
              className="hover:r-5 transition-all cursor-pointer"
            >
              <title>{new Date(d.timestamp).toLocaleDateString()}: {val}</title>
            </circle>
          );
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
    if (!session?.teamId) return;
    const data = await getTeamPulses(session.teamId);
    setCloudHistory(data as TeamSynergyPulse[]);
  };

  const handleShare = () => {
    // קישור ישיר למילוי הדופק עבור העובדים
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
      setAiInsight("חל פיצוץ בניתוח הנתונים. נסה שוב בעוד רגע.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!session?.teamId) {
      // אם הגענו מקישור ישיר בלי סשן, אנחנו מחלצים את ה-teamId מה-URL
      const params = new URLSearchParams(window.location.search);
      const urlTeamId = params.get('teamId');
      if (!urlTeamId) return alert("שגיאה: חסר מזהה צוות בקישור.");
      setPulse(prev => ({ ...prev, teamId: urlTeamId }));
    }
    
    setLoading(true);
    const targetTeamId = session?.teamId || new URLSearchParams(window.location.search).get('teamId');
    await saveTeamPulse(targetTeamId!, pulse);
    setSubmitted(true);
    setLoading(false);
    if (session?.isManager) loadCloudData();
  };

  if (submitted) return (
    <div className="py-40 text-center space-y-8 animate-fadeIn px-6">
      <div className="text-8xl">🚀</div>
      <h2 className="text-5xl font-black text-brand-dark italic">הדופק עודכן!</h2>
      <p className="text-brand-muted text-xl font-bold">הקול שלך עוזר לצוות להיות מסונכרן ומדויק יותר.</p>
      {session?.isManager && (
        <button onClick={() => setSubmitted(false)} className="bg-brand-dark text-white px-10 py-4 font-black">חזרה ללוח הבקרה</button>
      )}
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

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b-4 border-brand-dark pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-end">
             <span className="text-[11px] font-black text-brand-accent uppercase tracking-[0.4em]">Real-time Team Pulse</span>
             <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-brand-dark tracking-tighter uppercase italic leading-none">דופק צוותי</h2>
          <p className="text-brand-muted text-2xl font-bold italic">מדידת מגמות, אמון ואיכות עבודת הצוות לאורך זמן.</p>
        </div>

        {session?.isManager && (
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={handleShare}
              className="bg-brand-accent text-white px-10 py-5 font-black text-sm uppercase tracking-[0.2em] hover:bg-brand-dark transition-all shadow-[8px_8px_0px_#1a1a1a] active:scale-95 flex items-center gap-3"
            >
              <span className="text-xl">🔗</span>
              <span>{copyStatus ? "✓ הועתק" : "שלח שאלון לצוות"}</span>
            </button>
            <button 
              onClick={handleAiAnalysis}
              disabled={isAiAnalyzing || cloudHistory.length < 1}
              className="bg-brand-dark text-white px-10 py-5 font-black text-sm uppercase tracking-[0.2em] hover:bg-brand-accent transition-all shadow-[8px_8px_0px_rgba(90,125,154,0.3)] disabled:opacity-20 active:scale-95 flex items-center gap-3"
            >
              <span>🪄</span>
              <span>{isAiAnalyzing ? "מנתח נתונים..." : "ניתוח מגמות AI"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Analytics View for Manager */}
      {session?.isManager && (
        <div className="space-y-12 animate-fadeIn pt-8">
          {aggregateMetrics ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {metrics.map(m => (
                <div key={m.key} className="studio-card p-10 bg-white border-brand-dark shadow-[10px_10px_0px_rgba(26,26,26,0.05)] hover:border-brand-accent transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-4xl">{m.icon}</span>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{m.label}</p>
                      <h4 className="text-5xl font-black text-brand-dark">{aggregateMetrics[m.key]} <span className="text-sm opacity-30">/ 6</span></h4>
                    </div>
                  </div>
                  <div className="border-t border-brand-dark/5 pt-4">
                     <p className="text-[9px] font-black text-brand-muted uppercase tracking-widest mb-2">Trend Analysis (History)</p>
                     <TrendLine data={cloudHistory} metric={m.key} color="#5a7d9a" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="studio-card p-24 text-center border-dashed border-brand-dark/20 opacity-40 italic bg-white/50">
               אין עדיין נתונים מהצוות. לחץ על "שלח שאלון לצוות" כדי להתחיל.
            </div>
          )}

          {aiInsight && (
            <div className="studio-card p-12 bg-brand-dark text-white shadow-[16px_16px_0px_#5a7d9a] animate-fadeIn">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-brand-accent text-white flex items-center justify-center text-2xl rounded-full">🪄</div>
                  <h3 className="text-[11px] font-black text-brand-accent uppercase tracking-[0.6em] italic">AI STRATEGIC TEAM INSIGHT</h3>
               </div>
               <div className="text-2xl font-black italic leading-tight whitespace-pre-wrap border-r-4 border-brand-accent pr-8 py-2">
                 {aiInsight}
               </div>
            </div>
          )}
        </div>
      )}

      {/* Input Form for Staff/Members */}
      <div className="studio-card p-12 border-brand-dark bg-white shadow-[16px_16px_0px_rgba(26,26,26,0.05)] space-y-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-brand-accent"></div>
        <div className="space-y-4 border-b-2 border-brand-dark pb-6">
           <h3 className="text-3xl font-black text-brand-dark italic">עדכון דופק שוטף</h3>
           <p className="text-brand-muted font-bold italic">איך נראית העבודה שלנו ביומיום? תהיה כנה, זה מה שיעזור לנו להשתפר.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {metrics.map(metric => (
            <div key={metric.key} className="space-y-6 p-6 bg-brand-beige/20 border border-transparent hover:border-brand-dark/10 transition-all">
              <div className="flex justify-between items-center">
                <label className="text-2xl font-black text-brand-dark italic">{metric.label}</label>
                <div className="flex items-baseline gap-1">
                   <span className="text-5xl font-black text-brand-accent">{pulse[metric.key]}</span>
                   <span className="text-xs font-black opacity-30">/6</span>
                </div>
              </div>
              <input 
                type="range" min="1" max="6" step="1" 
                value={pulse[metric.key]} 
                onChange={e => setPulse({...pulse, [metric.key]: parseInt(e.target.value)})} 
                className="w-full h-4 bg-brand-beige border-2 border-brand-dark appearance-none cursor-pointer accent-brand-dark" 
              />
              <div className="flex justify-between text-[9px] font-black text-brand-muted uppercase tracking-widest px-1">
                 <span>נמוך מאוד</span>
                 <span>בינוני</span>
                 <span>גבוה מאוד</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
           <label className="text-[11px] font-black text-brand-muted uppercase tracking-widest">משהו שחשוב להגיד על האווירה בצוות כרגע?</label>
           <textarea 
             className="w-full bg-brand-beige/20 border-4 border-brand-dark p-8 text-2xl font-bold text-brand-dark outline-none focus:border-brand-accent min-h-[160px] resize-none" 
             placeholder="שתף מחשבות, קשיים או ניצחונות..." 
             value={pulse.vibe} 
             onChange={e => setPulse({...pulse, vibe: e.target.value})} 
           />
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="w-full bg-brand-dark text-white py-10 font-black text-3xl hover:bg-brand-accent transition-all shadow-[12px_12px_0px_#5a7d9a] active:scale-95 disabled:opacity-20"
        >
          {loading ? "מעדכן נתונים..." : "שלח עדכון דופק ←"}
        </button>
      </div>
    </div>
  );
};

export default TeamSynergy;
