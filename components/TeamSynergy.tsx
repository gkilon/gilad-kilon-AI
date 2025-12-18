
import React, { useState, useEffect } from 'react';
import { TeamSynergyPulse } from '../types';
import { getSynergyInsight } from '../geminiService';
import { db, saveTeamPulse, getTeamPulses } from '../firebase';

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
  const [isSurveyMode, setIsSurveyMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [cloudHistory, setCloudHistory] = useState<any[]>([]);

  // יצירת מזהה צוות ייחודי למנהל (לצורך הדגמה, נשתמש במזהה קבוע או מה-URL)
  const managerId = "gilad_default_team"; 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'survey') {
      setIsSurveyMode(true);
    } else {
      // אם אנחנו במצב מנהל, נטען נתונים מהענן
      loadCloudData();
    }
  }, []);

  const loadCloudData = async () => {
    const data = await getTeamPulses(managerId);
    setCloudHistory(data);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isSurveyMode) {
        // שמירה לענן עבור המשיב
        await saveTeamPulse(managerId, pulse);
        alert("תודה! תשובתך נשלחה למערכת המנהל.");
        window.close();
      } else {
        // מצב מנהל - אבחון עצמי + שמירה
        const insight = await getSynergyInsight(pulse);
        const newPulse = { ...pulse, timestamp: Date.now(), aiInsight: insight };
        onSave(newPulse);
        await saveTeamPulse(managerId, newPulse);
        setPulse({ ownership: 5, roleClarity: 5, routines: 5, communication: 5, commitment: 5, respect: 5, vibe: '', timestamp: 0 });
        loadCloudData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const shareLink = (platform: 'wa' | 'slack' | 'mail') => {
    const url = `${window.location.origin}${window.location.pathname}?mode=survey&team=${managerId}`;
    const text = `הי, אשמח להשתתפותך בשאלון קצר על השתתפות וסינרגיה בצוות שלנו: ${url}`;
    
    if (platform === 'wa') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    else if (platform === 'slack') navigator.clipboard.writeText(text).then(() => setCopySuccess(true));
    else if (platform === 'mail') window.open(`mailto:?subject=שאלון השתתפות בצוות&body=${encodeURIComponent(text)}`, '_blank');
    
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const metrics = [
    { key: 'ownership', label: 'תחושת Ownership על המטרה', icon: '🎯' },
    { key: 'roleClarity', label: 'בהירות בתפקידים ובאחריות', icon: '📋' },
    { key: 'routines', label: 'שגרות וסדר', icon: '🔄' },
    { key: 'communication', label: 'תקשורת פתוחה', icon: '💬' },
    { key: 'commitment', label: 'מחויבות', icon: '🤝' },
    { key: 'respect', label: 'כבוד הדדי', icon: '✨' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20">
      <div className="text-center space-y-4">
        <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">Collective Synergy Audit</span>
        <h2 className="text-6xl font-black text-white tracking-tighter uppercase">השתתפות בצוות</h2>
        <p className="text-slate-400 text-xl font-medium">אבחון ששת עמודי התווך של צוות מנצח וסנכרון הציפיות.</p>
      </div>

      {!isSurveyMode && (
        <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right">
            <h4 className="text-lg font-black text-white">הפץ שאלון לצוות</h4>
            <p className="text-sm text-slate-400">שלח לינק לכל חברי הצוות. התשובות ייאספו כאן בזמן אמת.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => shareLink('wa')} className="p-4 bg-green-600/20 hover:bg-green-600 text-green-500 hover:text-white rounded-2xl transition-all border border-green-600/20 flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
              <span>WhatsApp</span>
            </button>
            <button onClick={() => shareLink('slack')} className="p-4 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white rounded-2xl transition-all border border-purple-600/20 flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
              <span>{copySuccess ? 'Copied!' : 'Slack/Link'}</span>
            </button>
            <button onClick={() => shareLink('mail')} className="p-4 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-2xl transition-all border border-blue-600/20 flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
              <span>Email</span>
            </button>
          </div>
        </div>
      )}

      <div className="glass-card rounded-[3.5rem] p-12 space-y-12 border-amber-500/20 shadow-[0_0_100px_rgba(245,158,11,0.05)]">
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {metrics.map(metric => (
            <div key={metric.key} className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <label className="text-lg font-bold text-slate-200 flex items-center gap-3">
                  <span className="opacity-50">{metric.icon}</span> {metric.label}
                </label>
                <span className="text-2xl font-black text-amber-500">{pulse[metric.key as keyof TeamSynergyPulse]}</span>
              </div>
              <input 
                type="range" min="1" max="10" 
                value={pulse[metric.key as keyof TeamSynergyPulse]} 
                onChange={(e) => setPulse({...pulse, [metric.key]: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <label className="text-lg font-bold text-slate-200 pr-2">הערות ותחושות (אופציונלי):</label>
          <textarea 
            className="w-full bg-slate-950/50 rounded-3xl p-8 border border-white/5 text-slate-200 min-h-[120px] outline-none focus:border-amber-500/50 transition-all resize-none"
            placeholder="מה עובד טוב? איפה המקומות שצריך לחזק?"
            value={pulse.vibe}
            onChange={(e) => setPulse({...pulse, vibe: e.target.value})}
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white text-slate-950 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-amber-500 hover:text-white transition-all shadow-2xl disabled:opacity-20 flex items-center justify-center gap-4"
        >
          {loading ? <span className="animate-pulse italic text-amber-600">שולח נתונים...</span> : (isSurveyMode ? "שלח תשובה למנהל" : "בצע אבחון השתתפות בצוות")}
        </button>
      </div>

      {!isSurveyMode && (cloudHistory.length > 0 || history.length > 0) && (
        <div className="space-y-8">
          <div className="flex justify-between items-center px-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Synergy & Participation Logs</h4>
            <button onClick={loadCloudData} className="text-[9px] text-amber-500 font-bold hover:underline">רענן נתונים מהצוות ↻</button>
          </div>
          
          {[...cloudHistory, ...history].sort((a,b) => b.timestamp - a.timestamp).map((h, i) => (
            <div key={i} className="glass-card rounded-[3rem] p-10 border-amber-500/10 hover:border-amber-500/30 transition-all group">
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
              <div className="p-8 bg-slate-950/50 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-1 h-full bg-amber-500 opacity-30"></div>
                 {h.vibe && <p className="text-slate-400 text-sm mb-4 italic">"{h.vibe}"</p>}
                 {h.aiInsight && (
                   <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">
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
