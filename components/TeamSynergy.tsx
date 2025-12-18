
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TeamSynergyPulse } from '../types';
import { saveTeamPulse, getTeamPulses } from '../firebase';

const TeamSynergy: React.FC<{ history: TeamSynergyPulse[], onSave: (p: TeamSynergyPulse) => void }> = ({ history, onSave }) => {
  const [pulse, setPulse] = useState<TeamSynergyPulse>({ 
    ownership: 3, 
    roleClarity: 3, 
    routines: 3, 
    communication: 3, 
    commitment: 3, 
    respect: 3, 
    vibe: '',
    timestamp: 0 
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [teamUsername, setTeamUsername] = useState(localStorage.getItem('gk_team_username') || '');
  const [isManager, setIsManager] = useState(localStorage.getItem('gk_is_manager') === 'true');
  const [showManagerLogin, setShowManagerLogin] = useState(false);
  const [cloudHistory, setCloudHistory] = useState<TeamSynergyPulse[]>([]);
  const [isSurveyMode, setIsSurveyMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const refreshInterval = useRef<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get('team');
    if (codeFromUrl) {
      setTeamUsername(codeFromUrl.trim().toLowerCase());
      setIsSurveyMode(true);
      setIsManager(false);
    }
    
    if (teamUsername && isManager && !isSurveyMode) {
      loadCloudData();
      refreshInterval.current = window.setInterval(loadCloudData, 8000);
    }

    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [teamUsername, isManager, isSurveyMode]);

  const loadCloudData = async () => {
    if (!teamUsername) return;
    try {
      const data = await getTeamPulses(teamUsername);
      setCloudHistory(data as TeamSynergyPulse[]);
    } catch (e) {
      console.error("Error loading pulses:", e);
    }
  };

  const handleManagerLogin = () => {
    const tid = teamUsername.trim().toLowerCase();
    if (tid) {
      setTeamUsername(tid);
      setIsManager(true);
      setShowManagerLogin(false);
      localStorage.setItem('gk_is_manager', 'true');
      localStorage.setItem('gk_team_username', tid);
      loadCloudData();
    }
  };

  const handleLogout = () => {
    setIsManager(false);
    localStorage.removeItem('gk_is_manager');
    localStorage.removeItem('gk_team_username');
    setCloudHistory([]);
    if (refreshInterval.current) clearInterval(refreshInterval.current);
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

  const handleSubmit = async () => {
    if (!teamUsername) {
      alert("נא להזין קוד צוות.");
      return;
    }
    setLoading(true);
    try {
      const tid = teamUsername.trim().toLowerCase();
      const newPulse = { ...pulse, timestamp: Date.now() };
      await saveTeamPulse(tid, newPulse);
      setSubmitted(true);
      if (!isSurveyMode) onSave(newPulse);
    } catch (e) {
      alert("שגיאת תקשורת.");
    } finally {
      setLoading(false);
    }
  };

  const shareLink = () => {
    if (!teamUsername) return;
    const url = `${window.location.origin}${window.location.pathname}?mode=survey&team=${teamUsername.trim().toLowerCase()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const metrics: { key: keyof TeamSynergyPulse; label: string; icon: string }[] = [
    { key: 'ownership', label: 'תחושת Ownership על המטרה', icon: '🎯' },
    { key: 'roleClarity', label: 'בהירות בתפקידים ובאחריות', icon: '📋' },
    { key: 'routines', label: 'שגרות וסדר', icon: '🔄' },
    { key: 'communication', label: 'תקשורת פתוחה', icon: '💬' },
    { key: 'commitment', label: 'מחויבות', icon: '🤝' },
    { key: 'respect', label: 'כבוד הדדי', icon: '✨' }
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center animate-fadeIn space-y-8">
        <div className="w-24 h-24 bg-cyan-brand rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white/20">
          <svg className="w-12 h-12 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-5xl font-black text-white italic">נשלח בהצלחה!</h2>
        <p className="text-slate-400 text-xl font-medium">התשובות שלך התקבלו. המנהל יוכל לראות את הממוצע המעודכן.</p>
        {!isSurveyMode && (
          <button onClick={() => setSubmitted(false)} className="px-12 py-4 bg-amber-500 text-slate-950 rounded-2xl font-black shadow-xl">חזור</button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20 text-right">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
         <div className="space-y-4">
            <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs">Collective Synergy Audit</span>
            <h2 className="text-6xl font-black text-white tracking-tighter uppercase">איכות עבודת צוות</h2>
            <p className="text-slate-400 text-xl font-medium">אבחון עומק של הדינמיקה הצוותית.</p>
          </div>
          
          {!isSurveyMode && (
            <div className="flex gap-3">
              {!isManager ? (
                <button onClick={() => setShowManagerLogin(true)} className="px-6 py-2 border border-amber-500/30 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all">כניסת מנהל</button>
              ) : (
                <button onClick={handleLogout} className="px-6 py-2 border border-red-500/30 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">יציאה</button>
              )}
            </div>
          )}
      </div>

      {showManagerLogin && (
        <div className="glass-card p-10 rounded-[3rem] border-amber-500/40 bg-slate-900/90 space-y-6 animate-fadeIn">
          <h3 className="text-2xl font-black text-white">צפייה בתוצאות</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="הזן קוד צוות (למשל: משה)..." 
              className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500 text-right"
              value={teamUsername}
              onChange={(e) => setTeamUsername(e.target.value)}
            />
            <button onClick={handleManagerLogin} className="bg-amber-500 text-slate-950 px-10 py-4 rounded-2xl font-black shadow-lg">הצג דשבורד</button>
          </div>
        </div>
      )}

      {isManager && teamUsername && (
        <div className="space-y-12 animate-fadeIn">
          <div className="glass-card rounded-[2.5rem] p-8 border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-right">
              <h4 className="text-lg font-black text-white">דוח פעיל עבור: <span className="text-amber-500">{teamUsername}</span></h4>
              <p className="text-xs text-slate-500 italic">הנתונים מתעדכנים אוטומטית בכל כמה שניות.</p>
            </div>
            <button onClick={shareLink} className="p-5 bg-amber-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
              {copySuccess ? 'הלינק הועתק!' : 'העתק לינק לשאלון עובדים'}
            </button>
          </div>

          {aggregateMetrics ? (
            <>
              <div className="glass-card rounded-[3rem] p-10 border-amber-500/30 bg-slate-900/50 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 left-0 bg-amber-500 text-slate-950 px-6 py-1 font-black text-[10px] uppercase tracking-widest rounded-br-2xl">ממוצעי צוות ({aggregateMetrics.count} משיבים)</div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-6">
                   {metrics.map(m => (
                     <div key={m.key} className="text-center space-y-2">
                       <span className="text-4xl font-black text-amber-500 block">{aggregateMetrics[m.key as keyof typeof aggregateMetrics]} / 6</span>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{m.label}</p>
                       <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden w-24 mx-auto mt-2">
                          <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(parseFloat(aggregateMetrics[m.key as keyof typeof aggregateMetrics] as string) / 6) * 100}%` }}></div>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest pr-4">פירוט תשובות גולמיות (אנונימי)</h4>
                 <div className="grid gap-4">
                    {cloudHistory.map((h, i) => (
                      <div key={i} className="glass-card p-6 rounded-2xl border-white/5 bg-slate-900/40 text-sm">
                         <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] text-slate-500">{new Date(h.timestamp).toLocaleString('he-IL')}</span>
                            <div className="flex gap-2 text-[9px] font-black text-amber-500">
                               {metrics.map(m => <span key={m.key}>{m.label.split(' ')[0]}: {h[m.key]}</span>)}
                            </div>
                         </div>
                         {h.vibe && <p className="text-slate-300 italic border-r-2 border-amber-500/30 pr-3">"{h.vibe}"</p>}
                      </div>
                    ))}
                 </div>
              </div>
            </>
          ) : (
            <div className="glass-card p-20 text-center rounded-[3rem] border-dashed border-white/10 bg-slate-900/40 italic text-slate-500">
               {loading ? 'מושך נתונים...' : 'עדיין לא התקבלו תשובות מהעובדים תחת קוד זה.'}
            </div>
          )}
        </div>
      )}

      {!isManager && (
        <div className="glass-card rounded-[3.5rem] p-12 space-y-12 border-amber-500/20 shadow-[0_0_100px_rgba(245,158,11,0.05)] bg-slate-900/40">
          <div className="text-center space-y-4 bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-500/10">
            <h3 className="text-3xl font-black text-white italic">שאלון אבחון צוותי</h3>
            <p className="text-slate-200 font-bold text-xl leading-relaxed">
              באיזו מידה הדברים הבאים מתקיימים בצוות שלך?
              <br/>
              <span className="text-amber-500 font-black tracking-widest text-sm uppercase">(סקאלה 1-6 משמאל לימין)</span>
            </p>
          </div>

          {!isSurveyMode && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest pr-4">קוד הצוות (חובה לשליחה)</label>
              <input type="text" placeholder="הזן קוד צוות..." className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500 text-right font-bold" value={teamUsername} onChange={(e) => setTeamUsername(e.target.value)} />
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {metrics.map(metric => (
              <div key={metric.key} className="space-y-4 group">
                <div className="flex justify-between items-center px-2">
                  <label className="text-lg font-bold text-slate-200">{metric.label}</label>
                  <span className="text-4xl font-black text-amber-500">{pulse[metric.key] as number}</span>
                </div>
                
                <div className="relative pt-10 px-2" dir="ltr">
                  <div className="absolute top-0 left-0 text-[11px] font-black text-slate-500 uppercase tracking-widest">נמוך</div>
                  <div className="absolute top-0 right-0 text-[11px] font-black text-amber-500 uppercase tracking-widest">גבוה</div>
                  <input type="range" min="1" max="6" step="1" value={pulse[metric.key] as number} onChange={(e) => setPulse({...pulse, [metric.key]: parseInt(e.target.value)})} className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                  <div className="flex justify-between mt-2 text-[10px] font-black text-slate-700">
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <label className="text-lg font-bold text-slate-200 pr-2 italic">הערות אנונימיות נוספות:</label>
            <textarea className="w-full bg-slate-950/50 rounded-3xl p-8 border border-white/5 text-slate-200 min-h-[140px] outline-none focus:border-amber-500/50 resize-none text-right placeholder-slate-800" placeholder="מה עובד טוב? מה פחות?" value={pulse.vibe} onChange={(e) => setPulse({...pulse, vibe: e.target.value})} />
          </div>

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-white text-slate-950 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-amber-500 hover:text-white transition-all shadow-2xl disabled:opacity-30 active:scale-95">
            {loading ? "שולח תשובות..." : "שלח תשובה למערכת"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamSynergy;
