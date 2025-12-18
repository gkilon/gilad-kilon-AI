
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TeamSynergyPulse, UserSession } from '../types';
import { saveTeamPulse, getTeamPulses, isFirebaseReady, checkWorkspaceExists } from '../firebase';
import { getSynergyInsight } from '../geminiService';

interface TeamSynergyProps {
  session: UserSession | null;
}

const TeamSynergy: React.FC<TeamSynergyProps> = ({ session }) => {
  const [pulse, setPulse] = useState<TeamSynergyPulse>({ 
    ownership: 3, 
    roleClarity: 3, 
    routines: 3, 
    communication: 3, 
    commitment: 3, 
    respect: 3, 
    vibe: '',
    timestamp: Date.now(),
    teamId: session?.teamId || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cloudHistory, setCloudHistory] = useState<TeamSynergyPulse[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [workspaceExists, setWorkspaceExists] = useState<boolean | null>(null);
  
  const refreshInterval = useRef<number | null>(null);

  const teamId = session?.teamId || '';
  const isManager = session?.isManager || false;

  useEffect(() => {
    const verifyAndLoad = async () => {
      const exists = await checkWorkspaceExists(teamId);
      setWorkspaceExists(exists);
      if (exists && isManager) {
        loadCloudData();
        refreshInterval.current = window.setInterval(loadCloudData, 15000);
      }
    };
    if (teamId) verifyAndLoad();
    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [teamId, isManager]);

  const loadCloudData = async () => {
    if (!teamId) return;
    const data = await getTeamPulses(teamId);
    setCloudHistory(data as TeamSynergyPulse[]);
  };

  const aggregateMetrics = useMemo(() => {
    if (cloudHistory.length === 0) return null;
    const totals = { ownership: 0, roleClarity: 0, routines: 0, communication: 0, commitment: 0, respect: 0 };
    cloudHistory.forEach(h => {
      totals.ownership += (h.ownership || 0);
      totals.roleClarity += (h.roleClarity || 0);
      totals.routines += (h.routines || 0);
      totals.communication += (h.communication || 0);
      totals.commitment += (h.commitment || 0);
      totals.respect += (h.respect || 0);
    });
    const count = cloudHistory.length;
    return {
      ownership: (totals.ownership / count).toFixed(1),
      roleClarity: (totals.roleClarity / count).toFixed(1),
      routines: (totals.routines / count).toFixed(1),
      communication: (totals.communication / count).toFixed(1),
      commitment: (totals.commitment / count).toFixed(1),
      respect: (totals.respect / count).toFixed(1),
      count
    };
  }, [cloudHistory]);

  const handleGetAiInsight = async () => {
    if (!aggregateMetrics) return;
    setIsAiAnalyzing(true);
    try {
      const vibes = cloudHistory.map(h => h.vibe).filter(v => v && v.length > 2);
      const insight = await getSynergyInsight(aggregateMetrics, vibes);
      setAiInsight(insight);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!teamId) return;
    setLoading(true);
    const success = await saveTeamPulse(teamId, { ...pulse });
    if (success) {
      setSubmitted(true);
      if (isManager) loadCloudData();
    } else {
      alert("שגיאה: מרחב עבודה זה לא נמצא.");
    }
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

  if (workspaceExists === false) {
    return (
      <div className="max-w-2xl mx-auto py-40 text-center animate-fadeIn space-y-6">
        <h2 className="text-4xl font-black text-white">מרחב עבודה לא נמצא</h2>
        <p className="text-slate-400">הקוד "{teamId}" אינו מוכר במערכת.</p>
        <button onClick={() => window.location.href = window.location.origin} className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black">חזור לדף הבית</button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center animate-fadeIn space-y-8">
        <div className="w-24 h-24 bg-cyan-brand rounded-full flex items-center justify-center mx-auto shadow-2xl">
          <svg className="w-12 h-12 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-5xl font-black text-white italic">העדכון נשלח!</h2>
        <p className="text-slate-400 text-xl font-medium">המשוב שלך עודכן אצל מנהל הצוות.</p>
        <button onClick={() => setSubmitted(false)} className="px-12 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black hover:bg-white/10 transition-all">שלח עדכון נוסף</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fadeIn pb-20 text-right">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${isFirebaseReady() ? 'bg-cyan-brand animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Team Environment | {teamId}</span>
            </div>
            <h2 className="text-6xl font-black text-white tracking-tighter uppercase">איכות עבודת הצוות</h2>
            <p className="text-slate-400 text-xl font-medium">מדידת דופק צוותי, סנכרון ותחושת מסוגלות.</p>
          </div>
      </div>

      {isManager && (
        <div className="space-y-12 animate-fadeIn border-b border-white/10 pb-16">
          <div className="glass-card rounded-[2.5rem] p-8 border-cyan-brand/20 bg-cyan-brand/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-right">
              <h4 className="text-lg font-black text-white italic">ניהול Pulse של {teamId}</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">מבט על נתוני הצוות</p>
            </div>
            <button onClick={shareLink} className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-cyan-brand transition-all">
              {copySuccess ? 'הקישור הועתק!' : 'העתק קישור שאלון לצוות'}
            </button>
          </div>

          {aggregateMetrics ? (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-8">
                <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-slate-900/50 shadow-2xl">
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                     {metrics.map(m => (
                       <div key={m.key} className="text-center space-y-2">
                         <span className="text-4xl font-black text-cyan-brand block">{aggregateMetrics[m.key as keyof typeof aggregateMetrics]}</span>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{m.label}</p>
                         <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden w-24 mx-auto" dir="ltr">
                            <div className="h-full bg-cyan-brand transition-all duration-1000" style={{ width: `${(parseFloat(aggregateMetrics[m.key as keyof typeof aggregateMetrics] as string) / 6) * 100}%` }}></div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-slate-900/50">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">מה אומרים בשטח (אנונימי)</h4>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                    {cloudHistory.filter(h => h.vibe && h.vibe.length > 2).map((h, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 text-slate-300 text-sm italic">
                        "{h.vibe}"
                        <div className="text-[9px] text-slate-600 mt-2 font-black uppercase">
                          {new Date(h.timestamp).toLocaleDateString('he-IL')} | Pulse Response
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
                        <div className="w-10 h-10 bg-cyan-brand rounded-xl flex items-center justify-center text-slate-900 text-xl shadow-lg">🧠</div>
                        <h4 className="text-lg font-black text-white italic">AI Analyst</h4>
                     </div>
                     <button 
                      onClick={handleGetAiInsight}
                      disabled={isAiAnalyzing}
                      className="w-full py-3 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-brand transition-all shadow-md"
                     >
                       {isAiAnalyzing ? "מנתח נתונים..." : "הפק תובנות ניהוליות"}
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
            <div className="glass-card p-20 text-center rounded-[4rem] border-dashed border-white/5 bg-slate-900/20">
               <h3 className="text-2xl font-black text-white">אין עדיין נתוני Pulse</h3>
               <p className="text-slate-500 italic mt-2">שלח לצוות את הקישור למעלה כדי להתחיל לאסוף נתונים.</p>
            </div>
          )}
        </div>
      )}

      {/* שאלון הדירוג */}
      <div className="glass-card rounded-[3.5rem] p-10 space-y-12 border-white/5 shadow-2xl bg-slate-900/40">
        <div className="text-center space-y-2">
          <h3 className="text-3xl font-black text-white italic">איך אתה חווה את הצוות?</h3>
          <p className="text-slate-400 font-bold text-lg">דרג לפי התחושה האישית שלך כרגע (1-6)</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {metrics.map(metric => (
            <div key={metric.key} className="space-y-4 p-6 bg-white/[0.02] rounded-3xl border border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-lg font-black text-white">{metric.label}</label>
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
          <label className="text-sm font-bold text-slate-500 pr-2 uppercase tracking-widest">משוב פתוח (אנונימי לגמרי)</label>
          <textarea 
            className="w-full bg-slate-950 rounded-3xl p-6 border border-white/5 text-slate-200 text-lg min-h-[120px] outline-none focus:border-cyan-brand transition-all resize-none text-right placeholder-slate-800" 
            placeholder="מה מעכב אותנו? מה עובד טוב? מה היית משנה?" 
            value={pulse.vibe} 
            onChange={(e) => setPulse({...pulse, vibe: e.target.value})} 
          />
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="w-full bg-cyan-brand text-slate-950 py-7 rounded-[3rem] font-black text-2xl hover:bg-white transition-all shadow-xl active:scale-95 disabled:opacity-20"
        >
          {loading ? "מעדכן..." : "שלח דירוג צוותי"}
        </button>
      </div>
    </div>
  );
};

export default TeamSynergy;
