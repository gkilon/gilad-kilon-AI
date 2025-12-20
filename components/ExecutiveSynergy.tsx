
import React, { useState, useEffect } from 'react';
import { TowsAnalysis, UserSession } from '../types';
import { analyzeTowsStrategy } from '../geminiService';
import { syncToCloud, fetchFromCloud } from '../firebase';

const ExecutiveSynergy: React.FC<{ session: UserSession | null, onBack?: () => void }> = ({ session, onBack }) => {
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

      {/* Header with Tool Style */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b-4 border-brand-dark pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-end">
             <span className="text-[11px] font-black text-brand-accent uppercase tracking-[0.4em]">Strategic Foresight</span>
             <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-brand-dark tracking-tighter italic uppercase leading-none">פורום הנהלה</h2>
          <p className="text-brand-muted text-2xl font-bold italic">ניתוח TOWS: הצלבה אסטרטגית לקבלת החלטות עומק.</p>
        </div>
        <div className="flex bg-brand-beige p-2 border-2 border-brand-dark">
           <button onClick={() => setView('editor')} className={`px-8 py-3 font-black text-xs uppercase tracking-widest transition-all ${view === 'editor' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:text-brand-dark'}`}>ניתוח חדש</button>
           <button onClick={() => setView('history')} className={`px-8 py-3 font-black text-xs uppercase tracking-widest transition-all ${view === 'history' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:text-brand-dark'}`}>ארכיון החלטות</button>
        </div>
      </div>

      {view === 'editor' ? (
        <div className="space-y-12 animate-fadeIn">
          <div className="studio-card p-12 md:p-16 border-brand-dark bg-white shadow-[16px_16px_0px_rgba(26,26,26,0.05)] space-y-12">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-brand-accent uppercase tracking-[0.4em]">נושא הדיון האסטרטגי</label>
              <input 
                type="text"
                className="w-full bg-brand-beige/20 border-4 border-brand-dark p-8 text-3xl font-black text-brand-dark focus:border-brand-accent transition-all outline-none placeholder-brand-dark/10"
                placeholder="בחינת מודל רווחיות / מיצוב מחדש מול מתחרים..."
                value={activeAnalysis.title}
                onChange={e => setActiveAnalysis({...activeAnalysis, title: e.target.value})}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h4 className="text-[12px] font-black text-brand-muted uppercase tracking-[0.3em] border-b-2 border-brand-dark inline-block italic">INTERNAL / פנים</h4>
                <div className="grid gap-8">
                   <div className="studio-card p-8 bg-white border-brand-dark shadow-[8px_8px_0px_rgba(16,185,129,0.1)] space-y-6">
                      <h5 className="font-black text-emerald-600 text-sm tracking-widest uppercase">Strengths (S) חוזקות</h5>
                      <div className="flex gap-4">
                        <input className="flex-1 border-b-2 border-brand-dark bg-transparent py-2 text-brand-dark font-bold focus:border-emerald-500 outline-none" value={tempInputs.S} onChange={e => setTempInputs({...tempInputs, S: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('strengths', 'S')} placeholder="הוסף חוזקה..." />
                        <button onClick={() => addItem('strengths', 'S')} className="w-10 h-10 bg-brand-dark text-white font-black hover:bg-emerald-500 transition-all">+</button>
                      </div>
                      <div className="space-y-3">
                        {activeAnalysis.strengths?.map((s, i) => <div key={i} className="text-lg font-bold text-brand-dark bg-emerald-50 p-4 border-r-4 border-emerald-500 italic">"{s}"</div>)}
                      </div>
                   </div>
                   <div className="studio-card p-8 bg-white border-brand-dark shadow-[8px_8px_0px_rgba(245,158,11,0.1)] space-y-6">
                      <h5 className="font-black text-amber-600 text-sm tracking-widest uppercase">Weaknesses (W) חולשות</h5>
                      <div className="flex gap-4">
                        <input className="flex-1 border-b-2 border-brand-dark bg-transparent py-2 text-brand-dark font-bold focus:border-amber-500 outline-none" value={tempInputs.W} onChange={e => setTempInputs({...tempInputs, W: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('weaknesses', 'W')} placeholder="הוסף חולשה..." />
                        <button onClick={() => addItem('weaknesses', 'W')} className="w-10 h-10 bg-brand-dark text-white font-black hover:bg-amber-500 transition-all">+</button>
                      </div>
                      <div className="space-y-3">
                        {activeAnalysis.weaknesses?.map((w, i) => <div key={i} className="text-lg font-bold text-brand-dark bg-amber-50 p-4 border-r-4 border-amber-500 italic">"{w}"</div>)}
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-[12px] font-black text-brand-muted uppercase tracking-[0.3em] border-b-2 border-brand-dark inline-block italic">EXTERNAL / חוץ</h4>
                <div className="grid gap-8">
                   <div className="studio-card p-8 bg-white border-brand-dark shadow-[8px_8px_0px_rgba(37,99,235,0.1)] space-y-6">
                      <h5 className="font-black text-brand-accent text-sm tracking-widest uppercase">Opportunities (O) הזדמנויות</h5>
                      <div className="flex gap-4">
                        <input className="flex-1 border-b-2 border-brand-dark bg-transparent py-2 text-brand-dark font-bold focus:border-brand-accent outline-none" value={tempInputs.O} onChange={e => setTempInputs({...tempInputs, O: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('opportunities', 'O')} placeholder="הוסף הזדמנות..." />
                        <button onClick={() => addItem('opportunities', 'O')} className="w-10 h-10 bg-brand-dark text-white font-black hover:bg-brand-accent transition-all">+</button>
                      </div>
                      <div className="space-y-3">
                        {activeAnalysis.opportunities?.map((o, i) => <div key={i} className="text-lg font-bold text-brand-dark bg-blue-50 p-4 border-r-4 border-brand-accent italic">"{o}"</div>)}
                      </div>
                   </div>
                   <div className="studio-card p-8 bg-white border-brand-dark shadow-[8px_8px_0px_rgba(239,68,68,0.1)] space-y-6">
                      <h5 className="font-black text-red-600 text-sm tracking-widest uppercase">Threats (T) איומים</h5>
                      <div className="flex gap-4">
                        <input className="flex-1 border-b-2 border-brand-dark bg-transparent py-2 text-brand-dark font-bold focus:border-red-500 outline-none" value={tempInputs.T} onChange={e => setTempInputs({...tempInputs, T: e.target.value})} onKeyPress={e => e.key === 'Enter' && addItem('threats', 'T')} placeholder="הוסף איום..." />
                        <button onClick={() => addItem('threats', 'T')} className="w-10 h-10 bg-brand-dark text-white font-black hover:bg-red-500 transition-all">+</button>
                      </div>
                      <div className="space-y-3">
                        {activeAnalysis.threats?.map((t, i) => <div key={i} className="text-lg font-bold text-brand-dark bg-red-50 p-4 border-r-4 border-red-500 italic">"{t}"</div>)}
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !activeAnalysis.title || activeAnalysis.strengths!.length < 1}
              className="w-full py-10 bg-brand-dark text-white font-black text-3xl hover:bg-brand-accent transition-all shadow-[12px_12px_0px_rgba(37,99,235,0.2)] flex items-center justify-center gap-6 disabled:opacity-10 active:scale-95"
            >
              {isAnalyzing ? "מנתח הצלבות אסטרטגיות..." : "גזור מטריצת החלטות TOWS ←"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-12 animate-fadeIn">
          {history.length === 0 ? (
            <div className="text-center py-40 studio-card border-brand-dark/10 opacity-30 italic bg-white/50">אין עדיין ניתוחים בארכיון הנהלה</div>
          ) : (
            history.map(item => (
              <div key={item.id} className="studio-card p-12 md:p-16 border-brand-dark bg-white shadow-[12px_12px_0px_rgba(26,26,26,0.05)] space-y-12">
                 <div className="flex justify-between items-start border-b-2 border-brand-dark pb-8">
                    <div>
                      <h3 className="text-4xl md:text-6xl font-black text-brand-dark italic tracking-tight leading-none">{item.title}</h3>
                      <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.5em] mt-4">
                        {new Date(item.timestamp).toLocaleDateString('he-IL')} | TOWS STRATEGIC RESULT
                      </p>
                    </div>
                    <span className="text-brand-accent font-black text-xs uppercase tracking-widest border-2 border-brand-accent px-4 py-1 italic">ARCHIVED</span>
                 </div>

                 <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="p-10 border-r-8 border-emerald-500 bg-emerald-50 space-y-4">
                          <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">צמיחה (SO): חוזקות + הזדמנויות</h5>
                          <ul className="space-y-3">
                             {item.analysis?.strategiesSO.map((s, i) => <li key={i} className="text-xl font-bold text-brand-dark leading-tight">← {s}</li>)}
                          </ul>
                       </div>
                       <div className="p-10 border-r-8 border-brand-accent bg-blue-50 space-y-4">
                          <h5 className="text-[10px] font-black text-brand-accent uppercase tracking-widest">שיפור (WO): חולשות + הזדמנויות</h5>
                          <ul className="space-y-3">
                             {item.analysis?.strategiesWO.map((s, i) => <li key={i} className="text-xl font-bold text-brand-dark leading-tight">← {s}</li>)}
                          </ul>
                       </div>
                    </div>
                    <div className="space-y-8">
                       <div className="p-10 border-r-8 border-amber-500 bg-amber-50 space-y-4">
                          <h5 className="text-[10px] font-black text-amber-700 uppercase tracking-widest">הגנה (ST): חוזקות + איומים</h5>
                          <ul className="space-y-3">
                             {item.analysis?.strategiesST.map((s, i) => <li key={i} className="text-xl font-bold text-brand-dark leading-tight">← {s}</li>)}
                          </ul>
                       </div>
                       <div className="p-10 border-r-8 border-red-500 bg-red-50 space-y-4">
                          <h5 className="text-[10px] font-black text-red-700 uppercase tracking-widest">הישרדות (WT): חולשות + איומים</h5>
                          <ul className="space-y-3">
                             {item.analysis?.strategiesWT.map((s, i) => <li key={i} className="text-xl font-bold text-brand-dark leading-tight">← {s}</li>)}
                          </ul>
                       </div>
                    </div>
                 </div>

                 <div className="p-12 bg-brand-dark text-white space-y-6">
                    <h5 className="text-[11px] font-black text-brand-accent uppercase tracking-[0.5em] italic">EXECUTIVE SYNTHESIS / שורה תחתונה</h5>
                    <p className="text-3xl md:text-5xl font-black italic tracking-tighter leading-tight">"{item.analysis?.executiveSummary}"</p>
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
