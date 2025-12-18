
import React, { useState } from 'react';
import { analyzeCommStyle } from '../geminiService';
import { CommStyleResult } from '../types';

const categories = [
  {
    title: "אנרגיה ומיקוד",
    questions: [
      { id: 'q1', text: 'בשיחות עבודה, אני נוטה להתמקד בתוצאה הסופית ("השורה התחתונה") יותר מאשר בתהליך.' },
      { id: 'q4', text: 'אני נהנה להיות זה שמניע אחרים ומכניס התלהבות לפרויקטים חדשים.' }
    ]
  },
  {
    title: "יחסים ודינמיקה",
    questions: [
      { id: 'q2', text: 'חשוב לי מאוד שכל המשתתפים בשיחה ירגישו בנוח ושתהיה אווירה הרמונית.' },
      { id: 'q5', text: 'אני מעדיף תקשורת ישירה, קצרה ונטולת "סמול טוק" כדי להיות יעיל.' }
    ]
  },
  {
    title: "קבלת החלטות",
    questions: [
      { id: 'q3', text: 'אני זקוק לנתונים, עובדות וניתוח מעמיק לפני שאני מוכן להביע דעה או להחליט.' }
    ]
  }
];

const CommunicationDNA: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<CommStyleResult | null>(null);
  const [loading, setLoading] = useState(false);

  const totalQuestions = categories.reduce((acc, cat) => acc + cat.questions.length, 0);
  const answeredCount = Object.keys(answers).length;

  const handleAnalyze = async () => {
    setLoading(true);
    const res = await analyzeCommStyle(answers);
    setResult(res);
    setLoading(false);
  };

  if (result) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn">
        <div className="text-center relative">
          <div className="absolute inset-0 bg-cyan-brand/5 blur-3xl -z-10"></div>
          <span className="text-cyan-brand font-black uppercase tracking-[0.4em] text-[10px]">Strategic Profile Found</span>
          <h2 className="text-7xl font-black text-white mt-4 tracking-tighter uppercase">{result.style}</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6 lg:col-span-2">
            <h3 className="text-2xl font-black text-white italic">איך לתקשר איתי בצורה אפקטיבית?</h3>
            <p className="text-xl text-slate-300 leading-relaxed font-medium bg-white/5 p-8 rounded-3xl border border-white/5 shadow-inner">
              "{result.howToCommunicateWithMe}"
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-[2.5rem] bg-amber-500/5 border-amber-500/10 space-y-6">
            <h3 className="text-lg font-black text-amber-500 uppercase tracking-widest">חוזקות מפתח</h3>
            <ul className="space-y-4">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex gap-4 items-start text-slate-200 font-medium">
                  <span className="text-amber-500 mt-1">✦</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-4">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">מאפיינים נוספים</h3>
            <div className="flex flex-wrap gap-2">
              {result.characteristics.map((c, i) => (
                <span key={i} className="px-4 py-2 bg-slate-900 rounded-full text-xs font-bold text-slate-400 border border-white/5">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <button onClick={() => setResult(null)} className="w-full py-8 text-slate-600 font-black uppercase tracking-[0.5em] hover:text-cyan-brand transition-all">
          Retake Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-6xl font-black text-white tracking-tighter uppercase">Communication DNA</h2>
        <p className="text-slate-400 mt-4 text-xl font-medium">אבחון סגנון תקשורת מבוסס AI - גלה את התדר שלך ושל הצוות.</p>
      </div>

      <div className="mb-8">
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-brand transition-all duration-700" 
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
          <span>{answeredCount} of {totalQuestions} answered</span>
          <span>Communication Styles Audit</span>
        </div>
      </div>

      <div className="space-y-16">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-10">
            <div className="flex items-center gap-4">
              <span className="text-cyan-brand font-black text-sm">0{catIdx + 1}</span>
              <h3 className="text-lg font-black text-white uppercase tracking-widest">{cat.title}</h3>
              <div className="h-px bg-white/5 flex-1"></div>
            </div>
            
            {cat.questions.map(q => (
              <div key={q.id} className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8">
                <p className="text-2xl font-bold text-white text-center leading-tight">{q.text}</p>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[10px] font-black text-slate-600 uppercase w-20 text-right">כלל לא אני</span>
                  <div className="flex-1 flex justify-between gap-1 md:gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <button 
                        key={n} 
                        onClick={() => setAnswers(prev => ({...prev, [q.id]: n}))}
                        className={`flex-1 h-12 rounded-xl transition-all font-black text-xs md:text-sm border ${answers[q.id] === n ? 'bg-cyan-brand border-cyan-brand text-slate-950 scale-110 shadow-lg shadow-cyan-brand/20' : 'bg-slate-950 border-white/5 text-slate-600 hover:border-cyan-brand/30 hover:text-white'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-slate-600 uppercase w-20">בדיוק אני</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="pt-10">
        <button 
          disabled={answeredCount < totalQuestions || loading}
          onClick={handleAnalyze}
          className="w-full bg-white text-slate-950 py-8 rounded-[3rem] font-black text-3xl hover:bg-cyan-brand transition-all shadow-2xl disabled:opacity-20 flex items-center justify-center gap-6 group"
        >
          {loading ? (
            <span className="animate-pulse italic">Synthesizing DNA Profile...</span>
          ) : (
            <>
              נתח סגנון תקשורת
              <span className="group-hover:translate-x-[-10px] transition-transform">←</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CommunicationDNA;
