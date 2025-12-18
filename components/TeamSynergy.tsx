
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TeamSynergyPulse, UserSession } from '../types';
import { saveTeamPulse, getTeamPulses, isFirebaseReady } from '../firebase';
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
  
  const refreshInterval = useRef<number | null>(null);

  const teamId = session?.teamId || '';
  const isManager = session?.isManager || false;

  useEffect(() => {
    if (teamId && isManager) {
      loadCloudData();
      refreshInterval.current = window.setInterval(loadCloudData, 30000);
    }
    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [teamId, isManager]);

  const loadCloudData = async () => {
    if (!teamId) return;
    setLoading(true);
    const data = await getTeamPulses(teamId);
    setCloudHistory(data as TeamSynergyPulse[]);
    setLoading(false);
  };

  const handleGetAiInsight = async () => {
    if (cloudHistory.length === 0) return;
    setIsAiAnalyzing(true);
    try {
      const lastPulse = cloudHistory[0];
      const insight = await getSynergyInsight(lastPulse);
      setAiInsight(insight);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiAnalyzing(false);
    }
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
    if (!teamId) return;
    setLoading(true);
    const dataToSave = { ...pulse, teamId: teamId, timestamp: Date.now() };
    const success = await saveTeamPulse(teamId, dataToSave);
    if (success) {
      setSubmitted(true);
      if (isManager) loadCloudData();
    }
    setLoading(false);
  };

  const shareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?mode=survey&team=${teamId.toLowerCase()}`;
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

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center animate-fadeIn space-y-8">
        <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
          <svg className="w-12 h-12 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-5xl font-black text-white italic">המשוב נשלח!</h2>
        <p className="text-slate-400 text-xl font-medium">הדופק הצוותי עבור "{teamId}" עודכן.</p>
        <button onClick={() => setSubmitted(false)} className="px-12 py-4 bg-white text-slate-950 rounded-2xl font-black shadow-xl">שלח עדכון נוסף</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20 text-right">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
         <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${isFirebaseReady() ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Team Quality Hub | {teamId}</span>
            </div>
            <h2 className="text-6xl font-black text-white tracking-tighter uppercase">ניהול איכות הצוות</h2>
            <p className="text-slate-400 text-xl font-medium">מדידת אמון, סנכרון וביצועים בזמן אמת.</p>
          </div>
      </div>

      {isManager && (
        <div className="space-y-12 animate-fadeIn border-b border-white/10 pb-16">
          <div className="glass-card rounded-[2.5rem] p-8 border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-right">
              <h4 className="text-lg font-black text-white italic">דשבורד ניהולי: <span className="text-amber-500 uppercase">{teamId}</span></h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">נתונים מצטברים בזמן אמת</p>
            </div>
            <button onClick={shareLink} className="px-8 py-4 bg-amber-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
              {copySuccess ? 'הלינק הועתק!' : 'שלח לינק לדירוג צוותי'}
            </button>
          </div>

          {aggregateMetrics ? (
            <div className="space-y-12">
              <div className="glass-card rounded-[3rem] p-12 border-amber-500/30 bg-slate-900/50 relative overflow-hidden shadow-2xl">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                   {metrics.map(m => (
                     <div key={m.key} className="text-center space-y-3">
                       <span className="text-5xl font-black text-amber-500 block">{aggregateMetrics[m.key as keyof typeof aggregateMetrics]}</span>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{m.label}</p>
                       <div className="h-2 bg-slate-800 rounded-full overflow-hidden w-full max-w-[120px] mx-auto" dir="ltr">
                          <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(parseFloat(aggregateMetrics[m.key as keyof typeof aggregateMetrics] as string) / 6) * 100}%` }}></div>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="glass-card rounded-[3rem] p-10 border-blue-500/30 bg-blue-500/5 space-y-6">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl">🧠</div>
                      <h4 className="text-xl font-black text-white italic">AI Synergy Analyst</h4>
                   </div>
                   <button 
                    onClick={handleGetAiInsight}
                    disabled={isAiAnalyzing}
                    className="px-6 py-2 bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all shadow-lg"
                   >
                     {isAiAnalyzing ? "מנתח נתוני צוות..." : "קבל ניתוח ותובנות AI"}
                   </button>
                </div>
                {aiInsight && (
                  <div className="bg-slate-950/80 p-8 rounded-2xl border border-blue-500/20 text-slate-200 text-lg leading-relaxed italic animate-fadeIn">
                    "{aiInsight}"
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-20 text-center rounded-[4rem] border-dashed border-white/5 bg-slate-900/20">
               <div className="text-4xl mb-4">📡</div>
               <h3 className="text-2xl font-black text-white">מחכה לנתונים מהצוות...</h3>
               <p className="text-slate-500 italic mt-2">שלח את הלינק לעובדים כדי להתחיל לראות את ה-Pulse הצוותי.</p>
            </div>
          )}
        </div>
      )}

      {/* תמיד מציגים את השאלון מתחת, אלא אם המנהל בחר אחרת */}
      <div className="glass-card rounded-[3.5rem] p-12 space-y-12 border-amber-500/20 shadow-[0_0_100px_rgba(245,158,11,0.05)] bg-slate-900/40">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-black text-white italic">דירוג Pulse צוותי</h3>
          <p className="text-slate-400 font-bold text-xl leading-relaxed">איך אתה חווה את עבודת הצוות ברגע זה?</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
          {metrics.map(metric => (
            <div key={metric.key} className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <label className="text-xl font-black text-white">{metric.label}</label>
                <span className="text-4xl font-black text-amber-500">{pulse[metric.key] as number}</span>
              </div>
              
              <div className="relative pt-4 px-2" dir="ltr">
                <input 
                  type="range" min="1" max="6" step="1" 
                  value={pulse[metric.key] as number} 
                  onChange={(e) => setPulse({...pulse, [metric.key]: parseInt(e.target.value)})} 
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <label className="text-lg font-bold text-slate-200 pr-2 italic">משהו שחשוב לשתף? (אנונימי)</label>
          <textarea 
            className="w-full bg-slate-950 rounded-3xl p-8 border border-white/5 text-slate-200 text-xl min-h-[150px] outline-none focus:border-amber-500/50 resize-none text-right placeholder-slate-800" 
            placeholder="איך האווירה? מה מעכב אותנו?" 
            value={pulse.vibe} 
            onChange={(e) => setPulse({...pulse, vibe: e.target.value})} 
          />
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading || !teamId} 
          className="w-full bg-white text-slate-950 py-8 rounded-[3rem] font-black text-3xl hover:bg-amber-500 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-20"
        >
          {loading ? "מעדכן דופק..." : "שלח דירוג צוותי"}
        </button>
      </div>
    </div>
  );
};

export default TeamSynergy;
