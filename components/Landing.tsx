
import React, { useState } from 'react';
import { getToolRecommendation } from '../geminiService';

interface LandingProps {
  onEnterTool: (view: string, url?: string) => void;
}

const AnalyticalGraphic: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 40 40" className="opacity-80">
    <defs>
      <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
      </pattern>
    </defs>
    <rect width="40" height="40" fill="url(#grid)" />
    <path d="M 5 20 L 15 20 L 20 10 L 25 30 L 30 20 L 35 20" stroke="currentColor" strokeWidth="1.5" fill="none" className="animate-[pulse_2s_infinite]" />
    <circle cx="20" cy="10" r="1.5" fill="currentColor" />
    <circle cx="25" cy="30" r="1.5" fill="currentColor" />
  </svg>
);

const CreativeGraphic: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 40 40" className="opacity-80">
    <path d="M10 20 Q 20 5 30 20 T 10 20" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" className="animate-[spin_10s_linear_infinite]" />
    <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="animate-[ping_3s_linear_infinite]" />
    <path d="M15 15 L25 25 M15 25 L25 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="20" cy="20" r="2" fill="currentColor" className="animate-pulse" />
  </svg>
);

const DetailedBrain: React.FC<{ size?: number }> = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="group-hover:rotate-6 transition-transform duration-1000">
    <defs>
      <linearGradient id="creativeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2dd4bf" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
      <linearGradient id="logicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path 
      d="M50 10 C30 10, 15 25, 15 50 C15 75, 30 90, 50 90 L50 10" 
      fill="url(#logicGrad)" 
      fillOpacity="0.1" 
      stroke="#a855f7"  strokeWidth="1.5" 
    />
    <path 
      d="M50 10 C70 10, 85 25, 85 50 C85 75, 70 90, 50 90 L50 10" 
      fill="url(#creativeGrad)" 
      fillOpacity="0.1" 
      stroke="#2dd4bf" strokeWidth="1.5" 
    />
    <circle cx="50" cy="50" r="5" fill="#fbbf24" className="animate-pulse shadow-[0_0_20px_#fbbf24]" />
  </svg>
);

const ModuleIcon: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const commonProps = { stroke: color, strokeWidth: "2.5", fill: "none" };
  switch (type) {
    case 'executive': return <svg width="32" height="32" viewBox="0 0 40 40"><rect x="8" y="8" width="12" height="12" {...commonProps} /><rect x="20" y="20" width="12" height="12" {...commonProps} strokeOpacity="0.4" /></svg>;
    case 'dashboard': return <svg width="32" height="32" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" {...commonProps} strokeDasharray="4 2" /></svg>;
    case 'tasks': return <svg width="32" height="32" viewBox="0 0 40 40"><path d="M10 12h20M10 20h20" stroke={color} strokeWidth="3" /></svg>;
    case 'synergy': return <svg width="32" height="32" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" {...commonProps} /><path d="M20 10v20" stroke={color} strokeWidth="2" /></svg>;
    case 'ideas': return <svg width="32" height="32" viewBox="0 0 40 40"><path d="M20 5l10 25H10z" {...commonProps} /></svg>;
    case 'communication': return <svg width="32" height="32" viewBox="0 0 40 40"><path d="M10 10c10 20 20 0 20 20" {...commonProps} /></svg>;
    case 'feedback360': return <svg width="32" height="32" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" {...commonProps} /><circle cx="20" cy="20" r="6" fill={color} fillOpacity="0.2" /></svg>;
    default: return null;
  }
};

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'lg' }) => {
  const scale = size === 'lg' ? 0.8 : size === 'md' ? 0.6 : 0.45;
  return (
    <div className="flex flex-col items-center select-none origin-center" dir="ltr" style={{ transform: `scale(${scale})` }}>
      <div className="flex flex-col items-center leading-[0.65] tracking-[-0.09em]">
        <h1 className="text-[5.5rem] font-black text-white uppercase">GILAD</h1>
        <h1 className="text-[5.5rem] font-black text-white uppercase relative">KILON<span className="absolute bottom-[1.4rem] -right-4 w-4 h-4 bg-cyan-brand rounded-full"></span></h1>
      </div>
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onEnterTool }) => {
  const [consultationText, setConsultationText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'logic' | 'creative'>('creative');

  const analyticalTools = [
    { id: 'executive', title: 'פורום הנהלה', desc: 'אסטרטגיה ו-TOWS', color: '#a855f7' },
    { id: 'dashboard', title: 'ניהול שינוי', desc: 'הובלת מהלכי WOOP', color: '#a855f7' },
    { id: 'tasks', title: 'משימות', desc: 'ביצוע שוטף ויעדים', color: '#a855f7' },
  ];

  const creativeTools = [
    { id: 'synergy', title: 'דופק צוותי', desc: 'ניטור אקלים וסנכרון', color: '#2dd4bf' },
    { id: 'ideas', title: 'מעבדת רעיונות', desc: 'פיצוח אתגרים ב-AI', color: '#2dd4bf' },
    { id: 'communication', title: 'DNA תקשורת', desc: 'סגנונות תקשורת', color: '#2dd4bf' },
  ];

  const handleConsult = async () => {
    if (!consultationText.trim()) return;
    setIsAiLoading(true);
    try {
      const result = await getToolRecommendation(consultationText);
      if (result.recommendations?.[0]) onEnterTool(result.recommendations[0].moduleId);
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative pb-20 overflow-x-hidden">
      
      {/* Central Header Area */}
      <header className="w-full flex flex-col items-center mt-6 md:mt-12 z-30 px-4">
        <div className="glass-card p-5 md:p-7 rounded-full border-white/10 shadow-2xl mb-6 cursor-pointer group transition-all" onClick={() => onEnterTool('about')}>
          <DetailedBrain size={window.innerWidth < 768 ? 80 : 120} />
        </div>
        
        <div className="text-center">
          <BrandLogo size={window.innerWidth < 768 ? 'sm' : 'md'} />
          <div className="mt-8 md:mt-12 space-y-3">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-amber-300 italic tracking-tight drop-shadow-lg">
              כלי בינה מלאכולתית לניהול בעולם תזזיתי
            </h2>
            <p className="text-[14px] md:text-[18px] lg:text-[24px] font-bold text-amber-300/80 uppercase tracking-widest opacity-90">
              AI TOOLS FOR MANAGEMENT IN A FRANTIC WORLD
            </p>
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden w-[90%] bg-slate-900/50 p-1.5 rounded-2xl mt-12 border border-white/5 z-40">
        <button 
          onClick={() => setActiveTab('creative')}
          className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'creative' ? 'bg-cyan-brand text-slate-900 shadow-lg' : 'text-slate-500'}`}
        >
          מוח ימני
        </button>
        <button 
          onClick={() => setActiveTab('logic')}
          className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'logic' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500'}`}
        >
          מוח שמאלי
        </button>
      </div>

      {/* Modules Section - Responsive Grid */}
      <section className="w-full max-w-7xl px-6 mt-12 md:mt-24 z-20">
        
        {/* Desktop View: Side by Side (Creative on Right, Logic on Left in RTL) */}
        <div className="hidden md:grid grid-cols-2 gap-20">
          
          {/* RIGHT SIDE: Creative (Right Brain) */}
          <div className="space-y-8 order-1">
            <div className="flex items-center justify-start gap-6 mb-10 border-r-4 border-cyan-brand pr-8">
              <div className="text-cyan-brand">
                <CreativeGraphic />
              </div>
              <div className="flex flex-col items-start">
                <h2 className="text-5xl font-black text-cyan-brand italic uppercase tracking-tighter">מוח ימני</h2>
                <span className="text-xs text-slate-500 font-bold tracking-[0.4em]">CREATIVE INSIGHT & EMOTION</span>
              </div>
            </div>
            <div className="grid gap-6">
              {creativeTools.map(tool => (
                <div key={tool.id} onClick={() => onEnterTool(tool.id)} className="glass-card p-8 rounded-[2.5rem] border-cyan-brand/10 hover:border-cyan-brand hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-8 group">
                  <div className="p-4 bg-cyan-brand/10 rounded-2xl group-hover:bg-cyan-brand/20 transition-colors">
                    <ModuleIcon type={tool.id} color={tool.color} />
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight">{tool.title}</h4>
                    <p className="text-sm text-slate-400 font-bold">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LEFT SIDE: Logic (Left Brain) */}
          <div className="space-y-8 order-2">
            <div className="flex items-center justify-end gap-6 mb-10 border-l-4 border-purple-500 pl-8">
              <div className="flex flex-col items-end">
                <h2 className="text-5xl font-black text-purple-500 italic uppercase tracking-tighter">מוח שמאלי</h2>
                <span className="text-xs text-slate-500 font-bold tracking-[0.4em]">ANALYTICAL LOGIC & STRUCTURE</span>
              </div>
              <div className="text-purple-500">
                <AnalyticalGraphic />
              </div>
            </div>
            <div className="grid gap-6">
              {analyticalTools.map(tool => (
                <div key={tool.id} onClick={() => onEnterTool(tool.id)} className="glass-card p-8 rounded-[2.5rem] border-purple-500/10 hover:border-purple-500 hover:scale-[1.02] transition-all cursor-pointer flex flex-row-reverse items-center gap-8 group">
                  <div className="p-4 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                    <ModuleIcon type={tool.id} color={tool.color} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight">{tool.title}</h4>
                    <p className="text-sm text-slate-400 font-bold">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View: Tabbed Cards */}
        <div className="md:hidden animate-fadeIn">
          <div className="grid gap-4">
            {(activeTab === 'creative' ? creativeTools : analyticalTools).map(tool => (
              <div key={tool.id} onClick={() => onEnterTool(tool.id)} className={`glass-card p-6 rounded-[2rem] border-white/5 active:scale-95 transition-all flex items-center gap-5 ${activeTab === 'logic' ? 'border-purple-500/20' : 'border-cyan-brand/20'}`}>
                <div className={`p-3 rounded-xl ${activeTab === 'logic' ? 'bg-purple-500/10' : 'bg-cyan-brand/10'}`}>
                  <ModuleIcon type={tool.id} color={tool.color} />
                </div>
                <div className="text-right">
                  <h4 className="text-xl font-black text-white">{tool.title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Synthesis - Centered Bridge */}
        <div className="mt-16 md:mt-24 flex justify-center">
          <div onClick={() => onEnterTool('feedback360')} className="glass-card w-full max-w-2xl p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border-white/20 hover:border-white transition-all cursor-pointer group shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-900 to-black">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-white to-cyan-brand opacity-50"></div>
             <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-white text-slate-950 px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase mb-2">The Synthesis</div>
                <ModuleIcon type="feedback360" color="#ffffff" />
                <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">משוב 360: תמונת אמת</h4>
                <p className="text-xs md:text-sm text-slate-400 font-bold max-w-md">הנקודה שבה הלוגיקה והיצירתיות נפגשות ליצירת תובנה ניהולית שלמה.</p>
             </div>
          </div>
        </div>
      </section>

      {/* AI Consultation Area */}
      <section className="w-full max-w-4xl px-6 mt-16 md:mt-32 z-30">
        <div className="glass-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] bg-slate-950/80 border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl shrink-0">🤖</div>
            <div className="flex-1 text-center md:text-right space-y-4">
              <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tight">דלפק ההתייעצות</h3>
              <div className="flex flex-col gap-4">
                <textarea 
                  className="w-full bg-slate-950 border-b-2 border-white/10 p-4 text-base md:text-xl text-slate-200 outline-none focus:border-cyan-brand transition-all text-right placeholder-slate-800 min-h-[80px] md:min-h-[120px] rounded-t-2xl resize-none font-medium"
                  placeholder="מה מעסיק אותך בצוות או בהנהלה?..."
                  value={consultationText}
                  onChange={e => setConsultationText(e.target.value)}
                />
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                   <button onClick={() => onEnterTool('login')} className="text-[10px] md:text-[12px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-all">SYSTEM ADMIN</button>
                   <button 
                    onClick={handleConsult}
                    disabled={isAiLoading || !consultationText.trim()}
                    className="w-full md:w-auto bg-white text-slate-950 px-10 py-4 rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest hover:bg-cyan-brand transition-all shadow-2xl active:scale-95 disabled:opacity-20"
                   >
                    {isAiLoading ? "מנתח..." : "קבל המלצה חכמה ←"}
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Neural Graphics */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <circle cx="200" cy="300" r="150" fill="url(#logicGrad)" fillOpacity="0.2" />
          <circle cx="800" cy="700" r="200" fill="url(#creativeGrad)" fillOpacity="0.2" />
          <path d="M 200 300 Q 500 500 800 700" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="5 5" />
        </svg>
      </div>

    </div>
  );
};

export default Landing;
