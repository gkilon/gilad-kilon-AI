
import React, { useState } from 'react';
import { getToolRecommendation } from '../geminiService';

interface LandingProps {
  onEnterTool: (view: string, url?: string) => void;
}

const IconTaskHub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);

const IconTeamSynergy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

export const BrandLogo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  const isLarge = size === 'lg';
  return (
    <div className="flex flex-col items-center select-none group transition-all duration-1000" dir="ltr">
      <div className={`${isLarge ? 'mb-4' : 'mb-1'} relative`}>
        <div className={`absolute inset-0 bg-cyan-brand/20 blur-xl rounded-full ${isLarge ? 'scale-150' : 'scale-75'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        <svg width={isLarge ? "40" : "20"} height={isLarge ? "40" : "20"} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 5L55 20V40L30 55L5 40V20L30 5Z" stroke="white" strokeWidth={isLarge ? "1.5" : "3"} strokeOpacity="0.8"/>
          <circle cx="30" cy="30" r="10" fill="#2dd4bf" />
        </svg>
      </div>
      <div className={`flex flex-col items-center ${isLarge ? 'leading-[0.7] tracking-[-0.09em]' : 'leading-[0.75] tracking-tighter'}`}>
        <h1 className={`${isLarge ? 'text-[5rem] md:text-[7rem]' : 'text-[12px]'} font-black text-white uppercase`}>GILAD</h1>
        <h1 className={`${isLarge ? 'text-[5rem] md:text-[7rem]' : 'text-[12px]'} font-black text-white uppercase relative`}>KILON<span className={`absolute ${isLarge ? 'bottom-[1.2rem] -right-4 w-4 h-4' : 'bottom-[1px] -right-1.5 w-1 h-1'} bg-cyan-brand rounded-full shadow-[0_0_20px_#2dd4bf]`}></span></h1>
      </div>
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onEnterTool }) => {
  const [consultationText, setConsultationText] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const tools = [
    { id: 'dashboard', icon: <span className="text-lg">⚡</span>, title: 'ניהול השינוי', subtitle: 'STRATEGIC FLOW', desc: 'דיוק מטרות WOOP ותוכנית פעולה.', labelColor: 'text-cyan-400' },
    { id: 'tasks', icon: <IconTaskHub />, title: 'משימות שוטפות', subtitle: 'OPERATIONAL HUB', desc: 'ניהול ביצוע יומיומי ותיעדוף.', labelColor: 'text-emerald-400' },
    { id: 'executive', icon: <span className="text-lg">🧠</span>, title: 'פיתוח הנהלה', subtitle: 'EXECUTIVE SYNERGY', desc: 'סנכרון ו-Stress Test להחלטות.', labelColor: 'text-purple-400' },
    { id: 'synergy', icon: <IconTeamSynergy />, title: 'איכות עבודת צוות', subtitle: 'TEAM QUALITY', desc: 'מדידת אמון וזרימת מידע.', labelColor: 'text-amber-400' },
    { id: 'communication', icon: <span className="text-lg">📡</span>, title: 'DNA תקשורת', subtitle: 'STYLE AUDIT', desc: 'אבחון סגנונות והתאמת תדרים.', labelColor: 'text-rose-400', url: 'https://hilarious-kashata-9aafa2.netlify.app/' },
    { id: 'feedback360', icon: <span className="text-lg">🔄</span>, title: 'משוב 360', subtitle: 'TRUTH ENGINE', desc: 'סינתזת קולות לתמונת מצב.', labelColor: 'text-fuchsia-400', url: 'https://ubiquitous-nougat-41808d.netlify.app/' },
    { id: 'ideas', icon: <span className="text-lg">💡</span>, title: 'מעבדת רעיונות', subtitle: 'IDEA FORGE', desc: 'הקלטה, עיבוד AI וקישור חכם לפרויקטים אסטרטגיים.', labelColor: 'text-blue-400', isWide: true }
  ];

  const handleConsult = async () => {
    if (!consultationText.trim()) return;
    setIsLoading(true);
    try {
      const result = await getToolRecommendation(consultationText);
      setRecommendations(result.recommendations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getToolById = (id: string) => tools.find(t => t.id === id);

  return (
    <div className="animate-fadeIn space-y-16 pb-16 max-w-5xl mx-auto flex flex-col items-center">
      {/* Brand Header */}
      <section className="text-center pt-2 relative flex flex-col items-center w-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-cyan-brand/5 rounded-full blur-[100px] -z-10"></div>
        <BrandLogo size="lg" />
        <div className="mt-8 mb-2 text-lg md:text-2xl font-light tracking-tight flex items-center gap-4">
          <span className="line-through text-slate-500 opacity-40">מדברים</span>
          <span className="font-black text-white">עושים AI</span>
          <span className="text-cyan-brand font-medium">בפיתוח ארגוני</span>
        </div>
      </section>

      {/* Reception Desk - Consultation Area - Updated Prominent Orange Design */}
      <section className="w-full">
        <div className="glass-card p-10 rounded-[3rem] border-amber-500/40 bg-slate-900/80 relative overflow-hidden group shadow-[0_0_60px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20">
          {/* Decorative glowing amber accent */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="flex flex-col gap-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-amber-500 text-slate-950 rounded-full text-[13px] font-black uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(245,158,11,0.5)] transform -rotate-1">
                  <span className="animate-pulse text-lg">✦</span>
                  דלפק התייעצות ראשונית
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mt-2">
                  מה מעסיק אותך <span className="text-amber-500">בימים אלה?</span>
                </h2>
                <p className="text-slate-300 text-lg font-medium opacity-90 max-w-xl">שתף אותי באתגר הניהולי, בדילמה או בשינוי שאתה רוצה להוביל. ה-AI ימפה עבורך את הכלי המדויק ביותר.</p>
              </div>
            </div>

            <div className="relative">
              <textarea 
                className="w-full bg-slate-950/80 border-2 border-white/5 rounded-[2.5rem] px-10 py-10 text-2xl text-white outline-none focus:border-amber-500/60 focus:bg-slate-950 transition-all min-h-[180px] resize-none shadow-2xl placeholder-slate-700 font-medium"
                placeholder="אני מרגיש שהצוות שלי לא מסונכרן... / אני רוצה להוביל שינוי במודל העבודה..."
                value={consultationText}
                onChange={(e) => setConsultationText(e.target.value)}
              />
              <button 
                onClick={handleConsult}
                disabled={isLoading || !consultationText.trim()}
                className="absolute bottom-8 left-8 bg-amber-500 text-slate-950 px-12 py-5 rounded-2xl font-black text-lg hover:bg-white hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all flex items-center gap-4 disabled:opacity-30 shadow-2xl active:scale-95 group/btn"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>אבחן והמלץ לי</span> 
                    <span className="text-2xl group-hover:translate-x-[-8px] transition-transform">←</span>
                  </>
                )}
              </button>
            </div>

            {recommendations.length > 0 && (
              <div className="mt-6 space-y-8 animate-fadeIn">
                <div className="flex items-center gap-6">
                  <div className="h-px bg-amber-500/30 flex-1"></div>
                  <span className="text-[12px] font-black text-amber-500 uppercase tracking-[0.4em] bg-slate-900 px-4 py-1 rounded-full border border-amber-500/20">AI Recommended Path</span>
                  <div className="h-px bg-amber-500/30 flex-1"></div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {recommendations.map((rec, idx) => {
                    const tool = getToolById(rec.moduleId);
                    if (!tool) return null;
                    return (
                      <div 
                        key={idx} 
                        onClick={() => onEnterTool(tool.id, tool.url)}
                        className="p-10 rounded-[3rem] bg-amber-500/5 border-2 border-amber-500/20 hover:border-amber-500 hover:bg-amber-500/15 transition-all cursor-pointer group/rec flex flex-col gap-5 shadow-2xl"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-black text-white text-2xl group-hover/rec:text-amber-500">{tool.title}</h4>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-950 border border-amber-500/30 text-amber-500 group-hover/rec:bg-amber-500 group-hover/rec:text-slate-950 transition-all shadow-lg`}>
                            {tool.icon}
                          </div>
                        </div>
                        <p className="text-base text-slate-200 leading-relaxed font-bold italic pr-4 border-r-4 border-amber-500/40 bg-white/5 py-3 rounded-l-2xl">"{rec.explanation}"</p>
                        <div className="flex items-center gap-3 text-[11px] font-black uppercase text-amber-500 mt-2">
                           <span className="tracking-widest">כניסה למודולה המומלצת</span>
                           <span className="group-hover/rec:translate-x-[-8px] transition-transform text-lg">←</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Simplified Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {tools.map((tool) => (
          <div 
            key={tool.id} 
            onClick={() => onEnterTool(tool.id, tool.url)} 
            className={`glass-card p-5 md:p-6 rounded-[1.5rem] cursor-pointer transition-all duration-500 group relative overflow-hidden flex flex-col justify-between min-h-[160px] md:min-h-[180px] shadow-lg hover:-translate-y-1 ${tool.isWide ? 'md:col-span-2' : ''}`}
          >
            <div className={`absolute top-0 left-6 right-6 h-0.5 bg-current opacity-10 group-hover:opacity-100 transition-all rounded-b-full ${tool.labelColor}`}></div>
            
            <div className="flex justify-between items-start">
              <div className={`w-9 h-9 bg-slate-800/80 rounded-lg flex items-center justify-center border border-white/5 group-hover:bg-white group-hover:text-slate-900 transition-all text-cyan-brand`}>
                {tool.icon}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${tool.labelColor} opacity-70 group-hover:opacity-100 drop-shadow-[0_0_8px_currentColor]`}>
                {tool.subtitle}
              </span>
            </div>

            <div className="mt-4 text-right">
              <h3 className="text-lg md:text-xl font-black text-white group-hover:text-cyan-brand transition-colors">
                {tool.title}
                {tool.url && <span className="mr-1 text-[10px] opacity-40">↗</span>}
              </h3>
              <p className="text-slate-500 text-[11px] leading-snug group-hover:text-slate-300 transition-all line-clamp-2 mt-1">{tool.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-600 group-hover:text-cyan-brand">
              <span>{tool.url ? 'External App' : 'Internal Hub'}</span>
              <span className="text-xs">←</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
