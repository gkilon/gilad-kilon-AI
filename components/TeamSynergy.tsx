
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TeamSynergyPulse, UserSession } from '../types';
import { saveTeamPulse, getTeamPulses, isFirebaseReady, checkWorkspaceExists } from '../firebase';
import { getSynergyInsight } from '../geminiService';

const LineChart: React.FC<{ data: TeamSynergyPulse[], metric: keyof TeamSynergyPulse, color: string }> = ({ data, metric, color }) => {
  if (data.length < 2) return <div className="h-1 bg-slate-800 rounded-full w-full opacity-20"></div>;
  
  const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
  const minVal = 1;
  const maxVal = 6;
  const points = sorted.map((d, i) => {
    const x = (i / (sorted.length - 1)) * 100;
    const y = 100 - (( (d[metric] as number) - minVal) / (maxVal - minVal)) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-12 relative mt-2 opacity-60 hover:opacity-100 transition-opacity">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" points={points} />
      </svg>
    </div>
  );
};

const TeamSynergy: React.FC<{ session: UserSession | null }> = ({ session }) => {
  const [pulse, setPulse] = useState<TeamSynergyPulse>({ 
    ownership: 3, roleClarity: 3, routines: 3, communication: 3, commitment: 3, respect: 3, 
    vibe: '', timestamp: Date.now(), teamId: session?.teamId || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cloudHistory, setCloudHistory] = useState<TeamSynergyPulse[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [workspaceExists, setWorkspaceExists] = useState<boolean | null>(null);
  
  const teamId = session?.teamId || '';
  const isManager = session?.isManager || false;

  useEffect(() => {
    const verifyAndLoad = async () => {
      const exists = await checkWorkspaceExists(teamId);
      setWorkspaceExists(exists);
      if (exists && isManager) loadCloudData();
    };
    if (teamId) verifyAndLoad();
  }, [teamId, isManager]);

  const loadCloudData = async () => {
    const data = await getTeamPulses(teamId);
    setCloudHistory(data as TeamSynergyPulse[]);
  };

  const aggregateMetrics = useMemo(() => {
    if (cloudHistory.length === 0) return null;
    const latestCount = Math.min(10, cloudHistory.length);
    const recentData = cloudHistory.slice(0, latestCount);
    
    const totals = { ownership: 0, roleClarity: 0, routines: 0, communication: 0, commitment: 0, respect: 0 };
    recentData.forEach(h => {
      totals.ownership += (h.ownership || 0);
      totals.roleClarity += (h.roleClarity || 0);
      totals.routines += (h.routines || 0);
      totals.communication += (h.communication || 0);
      totals.commitment += (h.commitment || 0);
      totals.respect += (h.respect || 0);
    });
    
    return {
      ownership: (totals.ownership / latestCount).toFixed(1),
      roleClarity: (totals.roleClarity / latestCount).toFixed(1),
      routines: (totals.routines / latestCount).toFixed(1),
      communication: (totals.communication / latestCount).toFixed(1),
      commitment: (totals.commitment / latestCount).toFixed(1),
      respect: (totals.respect / latestCount).toFixed(1),
      count: latestCount
    };
  }, [cloudHistory]);

  const handleGetAiInsight = async () => {
    if (!aggregateMetrics) return;
    setIsAiAnalyzing(true);
    try {
      const vibes = cloudHistory.map(h => h.vibe).filter(v => v && v.length > 2);
      const insight = await getSynergyInsight(aggregateMetrics, vibes);
      setAiInsight(insight);
    } catch (e) { console.error(e); } finally { setIsAiAnalyzing(false); }
  };

  const handleSubmit = async () => {
    if (!teamId) return;
    setLoading(true);
    const success = await saveTeamPulse(teamId, { ...pulse });
    if (success) { setSubmitted(true); if (isManager) loadCloudData(); }
    setLoading(false);
  };

  const shareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?team=${teamId.toLowerCase()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const metrics: { key: keyof TeamSynergyPulse; label: string; icon: string }[] = [
    { key: 'ownership', label: 'Ownership על היעדים', icon: '🎯' },
    { key: 'roleClarity', label: 'בהירות בתחומי אחריות', icon: '📋' },
    { key: 'routines', label: 'שגרות וסדר יום', icon: '🔄' },
    { key: 'communication', label: 'איכות התקשורת', icon: '💬' },
    { key: 'commitment', label: 'רמת מחויבות', icon: '🤝' },
    { key: 'respect', label: 'כבוד ואמון הדדי', icon: '✨' }
  ];

  if (workspaceExists === false) return (
    <div className="max-w-2xl mx-auto py-40 text-center animate-fadeIn space-y-6">
      <h2 className="text-4xl font-black text-white">מרחב עבודה לא נמצא</h2>
      <button onClick={() => window.location.href = window.location.origin} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black">חזור</button>
    </div>
  );

  if (submitted) return (
    <div className="max-w-2xl mx-auto py-32 text-center animate-fadeIn space-y-8">
      <div className="w-24 h-24 bg-cyan-brand rounded-full flex items-center justify-center mx-auto shadow-2xl">
        <svg className="w-12 h-12 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h2 className="text-5xl font-black text-white italic">העדכון נשלח!</h2>
      <button onClick={() => setSubmitted(false)} className="px-12 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black">שלח שוב</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn pb-20 text-right">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${isFirebaseReady() ? 'bg-cyan-brand animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Quarterly Pulse Tracker | {teamId}</span>
            </div>
            <h2 className="text-6xl font-black text-white tracking-tighter uppercase">דופק צוותי תקופתי</h2>
            <p className="text-slate-400 text-xl font-medium">מדידת מגמות, סנכרון ואיכות עבודת הצוות על פני זמן.</p>
          </div>
      </div>

      {isManager && (
        <div className="space-y-12 animate-fadeIn border-b border-white/10 pb-16">
          <div className="glass-card rounded-[2.5rem] p-8 border-cyan-brand/20 bg-cyan-brand/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-right">
              <h4 className="text-lg font-black text-white italic">ניהול מגמות של {teamId}</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">מבט רבעוני והשוואתי</p>
            </div>
            <button onClick={shareLink} className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-cyan-brand transition-all">
              {copySuccess ? 'הקישור הועתק!' : 'שלח לינק Pulse לצוות'}
            </button>
          </div>

          {aggregateMetrics ? (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-8">
                <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-slate-900/50 shadow-2xl">
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                     {metrics.map(m => (
                       <div key={m.key} className="text-center space-y-2 group">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-3xl font-black text-cyan-brand">{aggregateMetrics[m.key as keyof typeof aggregateMetrics]}</span>
                            <span className="text-[8px] font-black text-slate-600 uppercase">Trend</span>
                         </div>
                         <LineChart data={cloudHistory} metric={m.key} color="#2dd4bf" />
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight pt-2">{m.label}</p>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-slate-900/50">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 italic">Feedback Feed (אנונימי)</h4>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                    {cloudHistory.filter(h => h.vibe && h.vibe.length > 2).map((h, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 text-slate-300 text-sm italic">
                        "{h.vibe}"
                        <div className="text-[9px] text-slate-600 mt-2 font-black uppercase">
                          {new Date(h.timestamp).toLocaleDateString('he-IL')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="glass-card rounded-[3rem] p-8 border-cyan-brand/30 bg-cyan-brand/5 space-y-6 h-full">
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-brand rounded-xl flex items-center justify-center text-slate-900 text-xl shadow-lg">⚡</div>
                        <h4 className="text-lg font-black text-white italic">Pulse Analysis</h4>
                     </div>
                     <button 
                      onClick={handleGetAiInsight}
                      disabled={isAiAnalyzing}
                      className="w-full py-3 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest"
                     >
                       {isAiAnalyzing ? "מנתח נתונים..." : "ניתוח מגמות AI"}
                     </button>
                  </div>
                  {aiInsight && (
                    <div className="text-slate-200 text-sm leading-relaxed italic border-r-2 border-cyan-brand/30 pr-4 py-2 animate-fadeIn whitespace-pre-line">
                      {aiInsight}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-20 text-center rounded-[4rem] border-dashed border-white/5 bg-slate-900/20 opacity-40 italic">מחכה לנתוני דופק ראשונים...</div>
          )}
        </div>
      )}

      {/* שאלון הדירוג */}
      <div className="glass-card rounded-[3.5rem] p-12 space-y-12 border-white/5 shadow-2xl bg-slate-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-brand/5 rounded-full blur-3xl"></div>
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-black text-white italic">הערכת דופק צוותי</h3>
          <p className="text-slate-400 font-bold text-lg">דרג את איכות עבודת הצוות ברבעון האחרון</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {metrics.map(metric => (
            <div key={metric.key} className="space-y-4 p-6 bg-white/[0.02] rounded-3xl border border-white/5 hover:border-cyan-brand/20 transition-all group">
              <div className="flex justify-between items-center">
                <label className="text-lg font-black text-white group-hover:text-cyan-brand transition-colors">{metric.label}</label>
                <span className="text-3xl font-black text-cyan-brand">{pulse[metric.key] as number}</span>
              </div>
              <div className="relative" dir="ltr">
                <input 
                  type="range" min="1" max="6" step="1" 
                  value={pulse[metric.key] as number} 
                  onChange={(e) => setPulse({...pulse, [metric.key]: parseInt(e.target.value)})} 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-brand" 
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-500 pr-2 uppercase tracking-widest italic">שיתוף תחושות ומחשבות מהשטח</label>
          <textarea 
            className="w-full bg-slate-950 rounded-3xl p-6 border border-white/5 text-slate-200 text-lg min-h-[140px] outline-none focus:border-cyan-brand transition-all resize-none text-right placeholder-slate-800" 
            placeholder="מה עבד טוב? מה היית משנה לקראת הרבעון הבא?" 
            value={pulse.vibe} 
            onChange={(e) => setPulse({...pulse, vibe: e.target.value})} 
          />
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="w-full bg-cyan-brand text-slate-950 py-7 rounded-[3rem] font-black text-2xl hover:bg-white transition-all shadow-xl active:scale-95 disabled:opacity-20"
        >
          {loading ? "מעדכן דופק..." : "שלח דירוג רבעוני"}
        </button>
      </div>
    </div>
  );
};

export default TeamSynergy;
