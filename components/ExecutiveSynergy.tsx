
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
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 text-right">
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-end">
             <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Strategic Foresight Lab</span>
             <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter italic uppercase">פורום הנהלה: <span className="text-purple-400">TOWS MATRIX</span></h2>
          <div className="bg-purple-500/10 border border-purple-500/20 p-8 rounded-[3rem] max-w-3xl ml-auto shadow-2xl">
            <p className="text-slate-300 text-lg leading-relaxed font-medium">
              <span className="text-purple-400 font-black">המתודולוגיה:</span> TOWS הוא הצעד הבא אחרי ה-SWOT. הוא לא רק ממפה את המצב, אלא **מצליב** אותו. המטרה היא לגזור מהלכי מנע וצמיחה: 
              <br/>
              <span className="text-white">איזו חוזקה פנימית תעזור לנו לממש הזדמנות חיצונית? ואיזו חולשה שלנו מסכנת אותנו אל מול איום חיצוני?</span>
            </p>
          </div>
        </div>
        <div className="flex bg-slate-900/50 p-2 rounded-2xl border border-white/5">
           <button onClick={() => setView('editor')} className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${view === 'editor' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>ניתוח חדש</button>
           <button onClick={() => setView('history')} className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${view === 'history' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>ארכיון החלטות</button>
        </div>
      </div>

      {view === 'editor' ? (
        <div className="space-y-8 animate-fadeIn text-right">
          <div className="glass-card rounded-[4rem] p-12 border-white/5 shadow-2xl space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] pr-6">נושא הדיון האסטרטגי</label>
              <input 
                type="text"
                className="w-full bg-slate-950/50 border border-white/10 rounded-[2.5rem] p-8 text-3xl font-bold text-white focus:border-purple-500 transition-all outline-none text-right placeholder-slate-800"
                placeholder="למשל: בחינת מודל רווחיות / מיצוב מחדש מול מתחרים"
                value={activeAnalysis.title}
                onChange={e => setActiveAnalysis({...activeAnalysis, title: e.target.value})}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Internal Factors Group */}
              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-4">INTERNAL FACTORS / פנים הארגון</h4>
                <div className="grid gap-6">
                   <div className="p-8 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                      <h5 className="font-black text-emerald-400 uppercase text-xs tracking-widest">STRENGTHS (S)</h5>
                      <div className="flex gap-2">
                        <button onClick={() => addItem('strengths', 'S')} className="w-10 h-10 bg-emerald-500 text-slate-950 rounded-xl font-black text-xl">+</button>
                        <input className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white text-sm text-right" value={tempInputs.S} onChange={e => setTempInputs({...tempInputs, S: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('strengths', 'S')} placeholder="הוסף חוזקה..." />
                      </div>
                      <div className="space-y-2">
                        {activeAnalysis.strengths?.map((s, i) => <div key={i} className="text-sm text-slate-300 bg-white/5 p-3 rounded-xl text-right font-medium"><span>{s} •</span></div>)}
                      </div>
                   </div>
                   <div className="p-8 rounded-[3rem] bg-amber-500/5 border border-amber-500/10 space-y-4">
                      <h5 className="font-black text-amber-400 uppercase text-xs tracking-widest">WEAKNESSES (W)</h5>
                      <div className="flex gap-2">
                        <button onClick={() => addItem('weaknesses', 'W')} className="w-10 h-10 bg-amber-500 text-slate-950 rounded-xl font-black text-xl">+</button>
                        <input className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white text-sm text-right" value={tempInputs.W} onChange={e => setTempInputs({...tempInputs, W: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('weaknesses', 'W')} placeholder="הוסף חולשה..." />
                      </div>
                      <div className="space-y-2">
                        {activeAnalysis.weaknesses?.map((w, i) => <div key={i} className="text-sm text-slate-300 bg-white/5 p-3 rounded-xl text-right font-medium"><span>{w} •</span></div>)}
                      </div>
                   </div>
                </div>
              </div>

              {/* External Factors Group */}
              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-4">EXTERNAL FACTORS / חוץ הארגון</h4>
                <div className="grid gap-6">
                   <div className="p-8 rounded-[3rem] bg-cyan-brand/5 border-cyan-brand/10 space-y-4">
                      <h5 className="font-black text-cyan-brand uppercase text-xs tracking-widest">OPPORTUNITIES (O)</h5>
                      <div className="flex gap-2">
                        <button onClick={() => addItem('opportunities', 'O')} className="w-10 h-10 bg-cyan-brand text-slate-950 rounded-xl font-black text-xl">+</button>
                        <input className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white text-sm text-right" value={tempInputs.O} onChange={e => setTempInputs({...tempInputs, O: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('opportunities', 'O')} placeholder="הוסף הזדמנות..." />
                      </div>
                      <div className="space-y-2">
                        {activeAnalysis.opportunities?.map((o, i) => <div key={i} className="text-sm text-slate-300 bg-white/5 p-3 rounded-xl text-right font-medium"><span>{o} •</span></div>)}
                      </div>
                   </div>
                   <div className="p-8 rounded-[3rem] bg-rose-500/5 border border-rose-500/10 space-y-4">
                      <h5 className="font-black text-rose-400 uppercase text-xs tracking-widest">THREATS (T)</h5>
                      <div className="flex gap-2">
                        <button onClick={() => addItem('threats', 'T')} className="w-10 h-10 bg-rose-500 text-slate-950 rounded-xl font-black text-xl">+</button>
                        <input className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-white text-sm text-right" value={tempInputs.T} onChange={e => setTempInputs({...tempInputs, T: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('threats', 'T')} placeholder="הוסף איום..." />
                      </div>
                      <div className="space-y-2">
                        {activeAnalysis.threats?.map((t, i) => <div key={i} className="text-sm text-slate-300 bg-white/5 p-3 rounded-xl text-right font-medium"><span>{t} •</span></div>)}
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !activeAnalysis.title || activeAnalysis.strengths!.length < 1}
              className="w-full py-10 bg-white text-slate-950 rounded-[3rem] font-black text-3xl hover:bg-purple-500 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-6 disabled:opacity-20"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-10 h-10 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>מנתח הצלבות אסטרטגיות...</span>
                </>
              ) : (
                <>
                  <span>💎</span>
                  חלץ מטריצת החלטות TOWS
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn text-right">
          {history.length === 0 ? (
            <div className="text-center py-40 glass-card rounded-[4rem] border-dashed border-white/10 opacity-30 italic">אין עדיין ניתוחים בארכיון הנהלה</div>
          ) : (
            history.map(item => (
              <div key={item.id} className="glass-card rounded-[4rem] p-12 space-y-12 border-white/5 hover:border-purple-500/20 transition-all group shadow-2xl">
                 <div className="flex justify-between items-start border-b border-white/10 pb-10">
                    <div className="bg-slate-950 px-6 py-3 rounded-2xl text-purple-400 text-[11px] font-black border border-purple-500/20 uppercase tracking-widest shadow-inner">STRATEGIC FORESIGHT</div>
                    <div className="text-right">
                      <h3 className="text-5xl font-black text-white italic group-hover:text-purple-400 transition-colors tracking-tight">{item.title}</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-3">
                        {new Date(item.timestamp).toLocaleDateString('he-IL')} | TOWS Matrix Result
                      </p>
                    </div>
                 </div>

                 <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="bg-emerald-500/5 p-10 rounded-[3.5rem] border border-emerald-500/10 space-y-6">
                          <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] text-right">MAX-MAX (SO): GROWTH STRATEGIES</h5>
                          <ul className="space-y-4">
                             {item.analysis?.strategiesSO.map((s, i) => <li key={i} className="text-slate-200 text-xl font-bold leading-tight flex items-start justify-end gap-3"><span className="text-right">{s}</span> <span className="text-emerald-500 mt-1">✓</span></li>)}
                          </ul>
                       </div>
                       <div className="bg-cyan-brand/5 p-10 rounded-[3.5rem] border border-cyan-brand/10 space-y-6">
                          <h5 className="text-[10px] font-black text-cyan-brand uppercase tracking-[0.3em] text-right">MIN-MAX (WO): DEVELOPMENT STRATEGIES</h5>
                          <ul className="space-y-4">
                             {item.analysis?.strategiesWO.map((s, i) => <li key={i} className="text-slate-200 text-xl font-bold leading-tight flex items-start justify-end gap-3"><span className="text-right">{s}</span> <span className="text-cyan-brand mt-1">○</span></li>)}
                          </ul>
                       </div>
                    </div>
                    <div className="space-y-8">
                       <div className="bg-amber-500/5 p-10 rounded-[3.5rem] border border-amber-500/10 space-y-6">
                          <h5 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] text-right">MAX-MIN (ST): DEFENSIVE STRATEGIES</h5>
                          <ul className="space-y-4">
                             {item.analysis?.strategiesST.map((s, i) => <li key={i} className="text-slate-200 text-xl font-bold leading-tight flex items-start justify-end gap-3"><span className="text-right">{s}</span> <span className="text-amber-500 mt-1">🛡️</span></li>)}
                          </ul>
                       </div>
                       <div className="bg-rose-500/5 p-10 rounded-[3.5rem] border border-rose-500/10 space-y-6">
                          <h5 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] text-right">MIN-MIN (WT): SURVIVAL STRATEGIES</h5>
                          <ul className="space-y-4">
                             {item.analysis?.strategiesWT.map((s, i) => <li key={i} className="text-slate-200 text-xl font-bold leading-tight flex items-start justify-end gap-3"><span className="text-right">{s}</span> <span className="text-rose-400 mt-1">⚠️</span></li>)}
                          </ul>
                       </div>
                    </div>
                 </div>

                 <div className="bg-purple-600/10 p-12 rounded-[4rem] border border-purple-500/20 text-right shadow-inner">
                    <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.5em] mb-6 italic">EXECUTIVE SYNTHESIS / שורה תחתונה</h5>
                    <p className="text-3xl font-black text-white italic leading-[1.2] tracking-tight">"{item.analysis?.executiveSummary}"</p>
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
