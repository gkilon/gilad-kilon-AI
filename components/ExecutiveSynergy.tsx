
import React, { useState } from 'react';
import { StrategyTest } from '../types';
import { analyzeExecutiveStrategy } from '../geminiService';

const ExecutiveSynergy: React.FC<{ history: StrategyTest[], onSave: (s: StrategyTest) => void }> = ({ history, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunTest = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeExecutiveStrategy(title, description);
      const newTest: StrategyTest = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        timestamp: Date.now(),
        analysis
      };
      onSave(newTest);
      setTitle('');
      setDescription('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-fadeIn pb-20">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">
          Executive Development Tool
        </div>
        <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
          Strategic <span className="text-purple-400 underline decoration-purple-500/30 underline-offset-8">Development</span> Lab
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          מעבדת פיתוח הנהלה: ניתוח מהלכים אסטרטגיים, איתור פערי סנכרון ואתגור החלטות הנהלה לפני יציאה לדרך.
        </p>
      </div>

      <div className="glass-card rounded-[4rem] p-12 border-purple-500/10 bg-gradient-to-br from-slate-900/50 via-slate-900/20 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="grid gap-12 relative z-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] block pr-4">המהלך או ההחלטה האסטרטגית</label>
            <input 
              type="text"
              className="w-full bg-slate-950/50 border border-white/5 rounded-3xl p-8 text-2xl font-bold text-white focus:border-purple-500/50 transition-all outline-none"
              placeholder="למשל: שינוי המודל העסקי או ארגון מחדש"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] block pr-4">רציונל, אתגרים וחששות</label>
            <textarea 
              className="w-full bg-slate-950/50 border border-white/5 rounded-3xl p-8 text-xl text-slate-300 min-h-[220px] focus:border-purple-500/50 transition-all outline-none resize-none leading-relaxed"
              placeholder="פרט את המהלך - מה הערך? מהם החסמים הפוטנציאליים?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <button 
            disabled={!title || !description || isAnalyzing}
            onClick={handleRunTest}
            className="w-full bg-white text-slate-950 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-purple-500 hover:text-white transition-all shadow-2xl disabled:opacity-20 flex items-center justify-center gap-6 group"
          >
            {isAnalyzing ? (
              <>
                <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
                <span className="animate-pulse">מנתח את הדינמיקה האסטרטגית...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                הפעל מבחן מאמץ אסטרטגי
                <span className="group-hover:translate-x-[-10px] transition-transform">←</span>
              </>
            )}
          </button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Strategic Archive</h3>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          
          {history.map(test => (
            <div key={test.id} className="glass-card rounded-[4rem] p-12 border-white/5 space-y-12 hover:border-purple-500/20 transition-all group">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-4xl font-black text-white mb-3 group-hover:text-purple-400 transition-colors">{test.title}</h4>
                  <div className="flex items-center gap-4 text-slate-500 text-sm font-bold">
                    <span>{new Date(test.timestamp).toLocaleDateString('he-IL')}</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                    <span className="uppercase tracking-widest text-[10px]">Development Report</span>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="bg-red-500/5 border border-red-500/10 p-10 rounded-[3rem]">
                    <h5 className="text-red-400 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-3">
                       <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                       סיכונים אסטרטגיים
                    </h5>
                    <ul className="space-y-4">
                      {test.analysis?.risks.map((r, i) => <li key={i} className="text-slate-300 font-medium text-lg leading-snug">× {r}</li>)}
                    </ul>
                  </div>
                  <div className="bg-amber-500/5 border border-amber-500/10 p-10 rounded-[3rem]">
                    <h5 className="text-amber-400 font-black text-xs uppercase tracking-widest mb-6">פערי סנכרון ומיקוד</h5>
                    <ul className="space-y-4">
                      {test.analysis?.alignmentGaps.map((g, i) => <li key={i} className="text-slate-300 font-medium text-lg leading-snug">○ {g}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-inner">
                    <h5 className="text-purple-400 font-black text-xs uppercase tracking-widest mb-8 italic">שאלות קריטיות לשולחן ההנהלה:</h5>
                    <div className="space-y-6">
                      {test.analysis?.criticalQuestions.map((q, i) => (
                        <div key={i} className="flex gap-6 items-start">
                          <span className="text-2xl font-black text-purple-500/40">0{i+1}</span>
                          <p className="text-slate-200 font-bold text-xl leading-tight">{q}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-10 rounded-[3rem] shadow-2xl shadow-purple-500/20">
                    <h5 className="font-black text-[10px] uppercase tracking-widest mb-4 opacity-70">סיכום והמלצה אסטרטגית</h5>
                    <p className="text-2xl font-black leading-tight">{test.analysis?.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExecutiveSynergy;
