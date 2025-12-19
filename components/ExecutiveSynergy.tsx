
import React, { useState, useEffect } from 'react';
import { TowsAnalysis, UserSession } from '../types';
import { analyzeTowsStrategy } from '../geminiService';
import { syncToCloud, fetchFromCloud } from '../firebase';

const ExecutiveSynergy: React.FC<{ session: UserSession | null }> = ({ session }) => {
  const [history, setHistory] = useState<TowsAnalysis[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<Partial<TowsAnalysis>>({
    title: '',
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  });
  const [tempInputs, setTempInputs] = useState({ S: '', W: '', O: '', T: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [view, setView] = useState<'editor' | 'history'>('editor');

  useEffect(() => {
    if (session?.teamId) loadHistory();
  }, [session]);

  const loadHistory = async () => {
    const data = await fetchFromCloud('tows_analyses', session!.teamId);
    setHistory(data as TowsAnalysis[]);
  };

  const addItem = (type: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', key: 'S' | 'W' | 'O' | 'T') => {
    if (!tempInputs[key].trim()) return;
    setActiveAnalysis(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), tempInputs[key].trim()]
    }));
    setTempInputs(prev => ({ ...prev, [key]: '' }));
  };

  const handleAnalyze = async () => {
    if (!activeAnalysis.title) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeTowsStrategy(activeAnalysis);
      const newAnalysis: TowsAnalysis = {
        ...(activeAnalysis as TowsAnalysis),
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        managerId: session!.teamId,
        analysis: result
      };
      await syncToCloud('tows_analyses', newAnalysis);
      setHistory([newAnalysis, ...history]);
      setActiveAnalysis({ title: '', strengths: [], weaknesses: [], opportunities: [], threats: [] });
      setView('history');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Executive Strategy Lab</span>
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter italic">פורום הנהלה: <span className="text-purple-400">TOWS</span></h2>
          <p className="text-slate-400 text-xl font-medium">מעבדת אסטרטגיה להצלבת כוחות פנימיים עם הזדמנויות שוק.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
           <button onClick={() => setView('editor')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'editor' ? 'bg-purple-500 text-white' : 'text-slate-500 hover:text-white'}`}>ניתוח חדש</button>
           <button onClick={() => setView('history')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'history' ? 'bg-purple-500 text-white' : 'text-slate-500 hover:text-white'}`}>ארכיון אסטרטגי</button>
        </div>
      </div>

      {view === 'editor' ? (
        <div className="space-y-8 animate-fadeIn">
          <div className="glass-card rounded-[3rem] p-10 border-white/5 shadow-2xl space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] pr-4">נושא הניתוח האסטרטגי</label>
              <input 
                type="text"
                className="w-full bg-slate-950/50 border border-white/5 rounded-3xl p-6 text-2xl font-bold text-white focus:border-purple-500 transition-all outline-none"
                placeholder="למשל: כניסה לשוק האירופי / ארגון מחדש של חטיבת המכירות"
                value={activeAnalysis.title}
                onChange={e => setActiveAnalysis({...activeAnalysis, title: e.target.value})}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Strengths */}
              <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                 <div className="flex justify-between items-center">
                    <h4 className="font-black text-emerald-400 uppercase text-xs tracking-widest">Strengths (S)</h4>
                    <span className="text-xs opacity-30 text-emerald-400">גורמים פנימיים חיוביים</span>
                 </div>
                 <div className="flex gap-2">
                    <input className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white text-sm" value={tempInputs.S} onChange={e => setTempInputs({...tempInputs, S: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('strengths', 'S')} placeholder="הוסף חוזקה..." />
                    <button onClick={() => addItem('strengths', 'S')} className="p-2 bg-emerald-500 text-slate-950 rounded-xl">+</button>
                 </div>
                 <div className="space-y-2">
                    {activeAnalysis.strengths?.map((s, i) => <div key={i} className="text-sm text-slate-300 bg-white/5 p-2 rounded-lg flex justify-between"><span>• {s}</span></div>)}
                 </div>
              </div>

              {/* Weaknesses */}
              <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 space-y-4">
                 <div className="flex justify-between items-center">
                    <h4 className="font-black text-amber-400 uppercase text-xs tracking-widest">Weaknesses (W)</h4>
                    <span className="text-xs opacity-30 text-amber-400">גורמים פנימיים לעבודה</span>
                 </div>
                 <div className="flex gap-2">
                    <input className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white text-sm" value={tempInputs.W} onChange={e => setTempInputs({...tempInputs, W: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('weaknesses', 'W')} placeholder="הוסף חולשה..." />
                    <button onClick={() => addItem('weaknesses', 'W')} className="p-2 bg-amber-500 text-slate-950 rounded-xl">+</button>
                 </div>
                 <div className="space-y-2">
                    {activeAnalysis.weaknesses?.map((w, i) => <div key={i} className="text-sm text-slate-300 bg-white/5 p-2 rounded-lg flex justify-between"><span>• {w}</span></div>)}
                 </div>
              </div>

              {/* Opportunities */}
              <div className="p-8 rounded-[2.5rem] bg-cyan-brand/5 border-cyan-brand/10 space-y-4">
                 <div className="flex justify-between items-center">
                    <h4 className="font-black text-cyan-brand uppercase text-xs tracking-widest">Opportunities (O)</h4>
                    <span className="text-xs opacity-30 text-cyan-brand">הזדמנויות בשוק</span>
                 </div>
                 <div className="flex gap-2">
                    <input className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white text-sm" value={tempInputs.O} onChange={e => setTempInputs({...tempInputs, O: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('opportunities', 'O')} placeholder="הוסף הזדמנות..." />
                    <button onClick={() => addItem('opportunities', 'O')} className="p-2 bg-cyan-brand text-slate-950 rounded-xl">+</button>
                 </div>
                 <div className="space-y-2">
                    {activeAnalysis.opportunities?.map((o, i) => <div key={i} className="text-sm text-slate-300 bg-white/5 p-2 rounded-lg flex justify-between"><span>• {o}</span></div>)}
                 </div>
              </div>

              {/* Threats */}
              <div className="p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 space-y-4">
                 <div className="flex justify-between items-center">
                    <h4 className="font-black text-rose-400 uppercase text-xs tracking-widest">Threats (T)</h4>
                    <span className="text-xs opacity-30 text-rose-400">איומים חיצוניים</span>
                 </div>
                 <div className="flex gap-2">
                    <input className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white text-sm" value={tempInputs.T} onChange={e => setTempInputs({...tempInputs, T: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('threats', 'T')} placeholder="הוסף איום..." />
                    <button onClick={() => addItem('threats', 'T')} className="p-2 bg-rose-500 text-slate-950 rounded-xl">+</button>
                 </div>
                 <div className="space-y-2">
                    {activeAnalysis.threats?.map((t, i) => <div key={i} className="text-sm text-slate-300 bg-white/5 p-2 rounded-lg flex justify-between"><span>• {t}</span></div>)}
                 </div>
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !activeAnalysis.title || activeAnalysis.strengths!.length < 1}
              className="w-full py-8 bg-white text-slate-950 rounded-[2.5rem] font-black text-2xl hover:bg-purple-500 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-20"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-8 h-8 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>מפעיל "מצפן אסטרטגי" להצלבת נתונים...</span>
                </>
              ) : (
                <>
                  <span>💎</span>
                  ייצר מטריצת אסטרטגיות TOWS
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          {history.length === 0 ? (
            <div className="text-center py-40 glass-card rounded-[3rem] border-dashed border-white/10 opacity-30 italic">אין עדיין ניתוחים בארכיון</div>
          ) : (
            history.map(item => (
              <div key={item.id} className="glass-card rounded-[3.5rem] p-10 space-y-10 border-white/5 hover:border-purple-500/20 transition-all group shadow-2xl">
                 <div className="flex justify-between items-start border-b border-white/5 pb-8">
                    <div>
                      <h3 className="text-4xl font-black text-white italic group-hover:text-purple-400 transition-colors">{item.title}</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">
                        {new Date(item.timestamp).toLocaleDateString('he-IL')} | TOWS Strategic Matrix
                      </p>
                    </div>
                    <div className="bg-slate-950 px-4 py-2 rounded-xl text-purple-400 text-[10px] font-black border border-purple-500/20 uppercase">Completed</div>
                 </div>

                 <div className="grid lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div className="bg-white/5 p-8 rounded-[2.5rem] space-y-4">
                          <h5 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Growth (SO) - מקסימום חוזקה + מקסימום הזדמנות</h5>
                          <ul className="space-y-3">
                             {item.analysis?.strategiesSO.map((s, i) => <li key={i} className="text-slate-200 text-lg font-medium leading-snug">✓ {s}</li>)}
                          </ul>
                       </div>
                       <div className="bg-white/5 p-8 rounded-[2.5rem] space-y-4">
                          <h5 className="text-xs font-black text-cyan-brand uppercase tracking-widest">Development (WO) - צמצום חולשה באמצעות הזדמנות</h5>
                          <ul className="space-y-3">
                             {item.analysis?.strategiesWO.map((s, i) => <li key={i} className="text-slate-200 text-lg font-medium leading-snug">○ {s}</li>)}
                          </ul>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="bg-white/5 p-8 rounded-[2.5rem] space-y-4">
                          <h5 className="text-xs font-black text-amber-400 uppercase tracking-widest">Defensive (ST) - חוזקה לנטרול איומים</h5>
                          <ul className="space-y-3">
                             {item.analysis?.strategiesST.map((s, i) => <li key={i} className="text-slate-200 text-lg font-medium leading-snug">🛡️ {s}</li>)}
                          </ul>
                       </div>
                       <div className="bg-white/5 p-8 rounded-[2.5rem] space-y-4 border border-rose-500/10 bg-rose-500/5">
                          <h5 className="text-xs font-black text-rose-400 uppercase tracking-widest">Survival (WT) - צמצום סיכונים הדדי</h5>
                          <ul className="space-y-3">
                             {item.analysis?.strategiesWT.map((s, i) => <li key={i} className="text-slate-200 text-lg font-medium leading-snug">⚠️ {s}</li>)}
                          </ul>
                       </div>
                    </div>
                 </div>

                 <div className="bg-purple-600/10 p-10 rounded-[3rem] border border-purple-500/20">
                    <h5 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-4">סיכום המצפן האסטרטגי</h5>
                    <p className="text-2xl font-black text-white italic leading-tight">"{item.analysis?.executiveSummary}"</p>
                 </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutiveSynergy;
