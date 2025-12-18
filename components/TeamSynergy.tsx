
import React, { useState, useEffect, useMemo } from 'react';
import { TeamSynergyPulse } from '../types';
import { getSynergyInsight } from '../geminiService';
import { saveTeamPulse, getTeamPulses } from '../firebase';

const TeamSynergy: React.FC<{ history: TeamSynergyPulse[], onSave: (p: TeamSynergyPulse) => void }> = ({ history, onSave }) => {
  const [pulse, setPulse] = useState<TeamSynergyPulse>({ 
    ownership: 5, 
    roleClarity: 5, 
    routines: 5, 
    communication: 5, 
    commitment: 5, 
    respect: 5, 
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get('team');
    if (codeFromUrl) {
      setTeamUsername(codeFromUrl);
      setIsSurveyMode(true);
      setIsManager(false);
    }
    
    if (teamUsername && isManager && !isSurveyMode) {
      loadCloudData();
    }
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
    if (teamUsername.trim()) {
      setIsManager(true);
      setShowManagerLogin(false);
      localStorage.setItem('gk_is_manager', 'true');
      localStorage.setItem('gk_team_username', teamUsername);
      loadCloudData();
    }
  };

  const handleLogout = () => {
    setIsManager(false);
    localStorage.removeItem('gk_is_manager');
    localStorage.removeItem('gk_team_username');
    setCloudHistory([]);
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
      alert("נא להזין את שם המשתמש/קוד הצוות של המנהל.");
      return;
    }
    setLoading(true);
    try {
      const newPulse = { ...pulse, timestamp: Date.now() };
      const savedDoc = await saveTeamPulse(teamUsername, newPulse);
      
      if (savedDoc) {
        // AI Insight only locally for manual diagnosis
        if (!isSurveyMode) {
           getSynergyInsight(pulse).then(insight => {
             onSave({ ...newPulse, aiInsight: insight });
           });
        }
        setSubmitted(true);
        if (isManager) loadCloudData();
      } else {
        alert("שגיאת תקשורת עם בסיס הנתונים. נא לוודא שקוד הצוות תקין.");
      }
    } catch (e) {
      console.error("Submit error:", e);
      alert("אירעה שגיאה בשליחה. נא לוודא חיבור לאינטרנט.");
    } finally {
      setLoading(false);
    }
  };

  const shareLink = () => {
    if (!teamUsername) {
      alert("נא להזין שם משתמש תחילה.");
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}?mode=survey&team=${teamUsername}`;
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
          <svg className="w-12 h-12 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-white italic">נשלח בהצלחה!</h2>
          <p className="text-slate-400 text-xl font-medium">התשובות שלך התקבלו. המנהל יוכל לראות את השקלול בדשבורד שלו.</p>
        </div>
        {!isSurveyMode && (
          <button onClick={() => setSubmitted(false)} className="px-12 py-4 bg-amber-500 text-slate-950 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform">בצע אבחון נוסף</button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20 text-right">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
         <div className="space-y-4">
            <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">Collective Synergy Audit</span>
            <h2 className="text-6xl font-black text-white tracking-tighter uppercase">איכות עבודת צוות</h2>
            <p className="text-slate-400 text-xl font-medium">אבחון ששת עמודי התווך של צוות מנצח וסנכרון הציפיות.</p>
          </div>
          
          {!isSurveyMode && (
            <div className="flex gap-3">
              {!isManager ? (
                <button 
                  onClick={() => setShowManagerLogin(true)}
                  className="px-6 py-2 border border-amber-500/30 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all"
                >
                  כניסת מנהל
                </button>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="px-6 py-2 border border-red-500/30 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  יציאה מהדשבורד
                </button>
              )}
            </div>
          )}
      </div>

      {showManagerLogin && (
        <div className="glass-card p-10 rounded-[3rem] border-amber-500/40 bg-slate-900/90 space-y-6 animate-fadeIn shadow-[0_0_60px_rgba(245,158,11,0.1)]">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">כניסת מנהל לדשבורד</h3>
            <p className="text-slate-400">הזן את ה"יוזר" (שם המשתמש) שהגדרת כדי לצפות בתוצאות המצטברות.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="שם משתמש..." 
              className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xl text-white outline-none focus:border-amber-500 transition-all text-right"
              value={teamUsername}
              onChange={(e) => setTeamUsername(e.target.value)}
            />
            <button onClick={handleManagerLogin} className="bg-amber-500 text-slate-950 px-10 py-4 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all">הצג דשבורד</button>
          </div>
          <button onClick={() => setShowManagerLogin(false)} className="text-slate-500 text-xs hover:underline">ביטול וחזרה</button>
        </div>
      )}

      {isManager && teamUsername && !isSurveyMode && (
        <div className="space-y-8 animate-fadeIn">
          <div className="glass-card rounded-[2.5rem] p-8 border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-right">
              <h4 className="text-lg font-black text-white">דוח פעיל עבור: <span className="text-amber-500">{teamUsername}</span></h4>
              <p className="text-sm text-slate-400">העתק את הלינק ושלח אותו לעובדים שלך לאיסוף אנונימי של הנתונים.</p>
            </div>
            <button onClick={shareLink} className="p-5 bg-amber-500 text-slate-950 rounded-2xl transition-all font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {copySuccess ? 'הלינק הועתק!' : 'העתק לינק לשליחה לעובדים'}
            </button>
          </div>

          {aggregateMetrics ? (
            <div className="glass-card rounded-[3rem] p-10 border-amber-500/30 bg-slate-900/50 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 left-0 bg-amber-500 text-slate-950 px-6 py-1 font-black text-[10px] uppercase tracking-widest rounded-br-2xl">ממוצעי צוות ({aggregateMetrics.count} משיבים)</div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-6">
                 {metrics.map(m => (
                   <div key={m.key} className="text-center space-y-2 group">
                     <span className="text-4xl font-black text-amber-500 group-hover:scale-110 transition-transform block">{aggregateMetrics[m.key as keyof typeof aggregateMetrics]}</span>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{m.label}</p>
                     <div className="h-2 bg-slate-800 rounded-full overflow-hidden w-28 mx-auto mt-2 border border-white/5">
                        <div className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-1000" style={{ width: `${(parseFloat(aggregateMetrics[m.key as keyof typeof aggregateMetrics] as string) / 10) * 100}%` }}></div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          ) : (
            <div className="glass-card p-20 text-center rounded-[3rem] border-dashed border-white/10 bg-slate-900/40">
               <p className="text-slate-500 text-lg italic">עדיין לא התקבלו תשובות מהעובדים תחת יוזר זה.</p>
            </div>
          )}
        </div>
      )}

      <div className="glass-card rounded-[3.5rem] p-12 space-y-12 border-amber-500/20 shadow-[0_0_100px_rgba(245,158,11,0.05)] bg-slate-900/40">
        <div className="text-center space-y-4 bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-500/10">
          <h3 className="text-3xl font-black text-white">שאלון אבחון צוותי</h3>
          <p className="text-slate-200 font-bold text-xl leading-relaxed">
            באיזו מידה הדברים הבאים מתקיימים בצוות שלך?
            <br/>
            <span className="text-amber-500 font-black tracking-widest text-sm">(סולם: 1 = כלל לא, 10 = במידה רבה מאוד)</span>
          </p>
        </div>

        {isSurveyMode ? (
          <div className="text-center text-slate-500 text-xs font-black uppercase tracking-widest border-b border-white/5 pb-4">
             שולח לצוות: <span className="text-cyan-brand font-black">{teamUsername}</span>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest pr-4">שם משתמש / קוד צוות (חובה לשליחה)</label>
            <input 
              type="text" 
              placeholder="הזן קוד צוות שקיבלת מהמנהל..." 
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500 transition-all text-right"
              value={teamUsername}
              onChange={(e) => setTeamUsername(e.target.value)}
            />
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {metrics.map(metric => (
            <div key={metric.key} className="space-y-4 group">
              <div className="flex justify-between items-center px-2">
                <label className="text-lg font-bold text-slate-200 flex items-center gap-3">
                  <span className="opacity-40 group-hover:opacity-100 transition-opacity">{metric.icon}</span> {metric.label}
                </label>
                <span className="text-3xl font-black text-amber-500">{pulse[metric.key] as number}</span>
              </div>
              <input 
                type="range" min="1" max="10" 
                value={pulse[metric.key] as number} 
                onChange={(e) => setPulse({...pulse, [metric.key]: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-black text-slate-600 px-1 uppercase tracking-tighter">
                <span>כלל לא</span>
                <span>במידה רבה</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <label className="text-lg font-bold text-slate-200 pr-2 italic">הערות אנונימיות (אופציונלי):</label>
          <textarea 
            className="w-full bg-slate-950/50 rounded-3xl p-8 border border-white/5 text-slate-200 min-h-[140px] outline-none focus:border-amber-500/50 transition-all resize-none text-right placeholder-slate-800"
            placeholder="מה עובד טוב? איפה לדעתך הצוות צריך להשתפר?"
            value={pulse.vibe}
            onChange={(e) => setPulse({...pulse, vibe: e.target.value})}
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white text-slate-950 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-amber-500 hover:text-white transition-all shadow-2xl disabled:opacity-30 flex items-center justify-center gap-4 active:scale-95"
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <span>שומר ומעדכן...</span>
            </>
          ) : (isSurveyMode ? "שלח תשובות למנהל" : "שלח ושמור אבחון")}
        </button>
      </div>

      {!isSurveyMode && (cloudHistory.length > 0 || history.length > 0) && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center px-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">היסטוריית אבחונים</h4>
            {isManager && <button onClick={loadCloudData} className="text-[10px] text-amber-500 font-black hover:underline uppercase tracking-widest">רענן נתונים ↻</button>}
          </div>
          
          {[...cloudHistory, ...history].sort((a,b) => b.timestamp - a.timestamp).map((h, i) => (
            <div key={i} className="glass-card rounded-[3rem] p-10 border-white/5 hover:border-amber-500/20 transition-all group shadow-lg">
              <div className="flex justify-between items-start mb-6">
                 <span className="text-[10px] font-bold text-slate-500">{new Date(h.timestamp).toLocaleString('he-IL')}</span>
                 <div className="flex gap-4 text-[9px] font-black text-amber-500 uppercase tracking-widest flex-wrap max-w-md justify-end">
                    <span>Ownership: {h.ownership}</span>
                    <span>Roles: {h.roleClarity}</span>
                    <span>Routines: {h.routines}</span>
                    <span>Comm: {h.communication}</span>
                    <span>Commit: {h.commitment}</span>
                    <span>Respect: {h.respect}</span>
                 </div>
              </div>
              <div className="p-8 bg-slate-950/40 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-1 h-full bg-amber-500 opacity-20"></div>
                 {h.vibe && <p className="text-slate-400 text-sm mb-4 italic pr-4">"{h.vibe}"</p>}
                 {h.aiInsight && (
                   <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                     {h.aiInsight}
                   </p>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamSynergy;
