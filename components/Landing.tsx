
import React, { useState, useEffect } from 'react';
import { getToolRecommendation } from '../geminiService';
import { getSystemConfig } from '../firebase';
import { ClientLogo } from '../types';

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg', dark?: boolean }> = ({ size = 'lg', dark = true }) => {
  const sizes = { 
    sm: 'text-2xl md:text-3xl', 
    md: 'text-4xl md:text-6xl', 
    lg: 'text-7xl md:text-[9rem]' 
  };
  
  const subSizes = {
    sm: 'text-[5px] md:text-[6px]',
    md: 'text-[8px] md:text-[10px]',
    lg: 'text-[12px] md:text-[16px]'
  };

  const dotSizes = {
    sm: 'w-1 h-1 md:w-1.5 md:h-1.5',
    md: 'w-2 h-2 md:w-3 md:h-3',
    lg: 'w-4 h-4 md:w-6 md:h-6'
  };

  const color = dark ? 'text-brand-dark' : 'text-white';
  
  return (
    <div className={`flex flex-col items-center select-none font-black uppercase tracking-[-0.04em] leading-[0.75] ${color}`} dir="ltr">
      <div className={`${sizes[size]} drop-shadow-sm`}>GILAD</div>
      <div className={`relative ${sizes[size]} drop-shadow-sm`}>
        KILON
        <span className={`absolute bottom-[18%] -right-[12%] rounded-full bg-brand-accent shadow-[0_0_15px_rgba(37,99,235,0.4)] ${dotSizes[size]}`}></span>
      </div>
      <div className={`${subSizes[size]} tracking-[0.5em] mt-2 md:mt-4 font-bold opacity-60 whitespace-nowrap`}>
        MANAGEMENT CONSULTING
      </div>
    </div>
  );
};

export const ExpertiseCard: React.FC<{ title: string, desc: string, icon: string }> = ({ title, desc, icon }) => (
  <div className="studio-card p-8 border-brand-dark flex flex-col items-start gap-6 hover:bg-white transition-all h-full group">
    <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">{icon}</div>
    <div className="space-y-4">
      <h4 className="text-2xl font-black italic leading-none">{title}</h4>
      <p className="text-brand-muted font-medium leading-relaxed text-sm md:text-base">{desc}</p>
    </div>
  </div>
);

export const ArticleCard: React.FC<{ title: string, subtitle?: string, category: string, date: string, onClick?: () => void, link?: string }> = ({ title, subtitle, category, date, onClick, link }) => (
  <div 
    onClick={onClick}
    className="group cursor-pointer border-b border-brand-dark/10 py-12 first:border-t hover:bg-white px-6 transition-all duration-500 block text-right"
  >
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
      <div className="space-y-4">
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-muted block">{category}</span>
        <h3 className="text-3xl md:text-5xl font-black group-hover:text-brand-accent transition-colors leading-none tracking-tighter">{title}</h3>
        {subtitle && <p className="text-xl text-brand-muted font-bold italic">{subtitle}</p>}
      </div>
      <div className="flex flex-col items-end gap-4">
        <span className="text-xs font-black text-brand-muted uppercase tracking-widest">{date}</span>
        <span className="text-brand-accent opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 font-black">קרא עוד ←</span>
      </div>
    </div>
  </div>
);

export const ToolEntry: React.FC<{ title: string, desc: string, onClick: () => void, icon: string }> = ({ title, desc, onClick, icon }) => (
  <div onClick={onClick} className="studio-card p-8 md:p-10 rounded-none cursor-pointer group flex flex-col justify-between border-brand-dark min-h-[340px] h-full shadow-[8px_8px_0px_rgba(26,26,26,0.05)]">
    <div className="text-5xl group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0 mb-6">{icon}</div>
    <div className="space-y-4 flex-1 text-right">
      <h4 className="text-2xl font-black italic leading-tight">{title}</h4>
      <p className="text-sm text-brand-muted font-medium leading-relaxed">{desc}</p>
    </div>
    <div className="pt-6 mt-6 border-t border-brand-dark/5 overflow-hidden h-6">
      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-dark group-hover:translate-y-[-20px] transition-transform block">Open Tool</span>
      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-accent translate-y-[20px] group-hover:translate-y-[-20px] transition-transform block">Let's Work ←</span>
    </div>
  </div>
);

interface LandingProps { onEnterTool: (view: string) => void; }

const Landing: React.FC<LandingProps> = ({ onEnterTool }) => {
  const [consultationText, setConsultationText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [clients, setClients] = useState<ClientLogo[]>([]);

  useEffect(() => {
    getSystemConfig().then(config => setClients(config.clients || []));
  }, []);

  const handleConsult = async () => {
    if (!consultationText.trim()) return;
    setIsAiLoading(true);
    try {
      const result = await getToolRecommendation(consultationText);
      if (result.recommendations?.[0]) onEnterTool(result.recommendations[0].moduleId);
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 md:pt-32 pb-32 px-6">
      
      {/* 1. Hero Section */}
      <section className="w-full max-w-6xl text-center space-y-16 mb-48">
        <div className="relative inline-block px-10">
          <BrandLogo size="lg" />
          <div className="absolute top-0 bottom-0 left-0 w-px bg-brand-dark/10"></div>
          <div className="absolute top-0 bottom-0 right-0 w-px bg-brand-dark/10"></div>
        </div>
        
        <div className="space-y-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-8xl font-black text-kern leading-[0.95] tracking-tighter">
            פשטות. <span className="text-brand-muted/30 italic font-light">עומק.</span> אנושיות.
          </h1>
          <div className="h-2 w-24 bg-brand-dark mx-auto"></div>
          <p className="text-xl md:text-3xl text-brand-muted max-w-3xl mx-auto font-medium leading-relaxed italic">
            "אני עוזר למנהלים למצוא את העיקר בתוך הרעש. בלי מילים גבוהות, עם עומק מקצועי וכלים שבאמת עובדים."
          </p>
        </div>
      </section>

      {/* 2. Professional Expertises */}
      <section className="w-full max-w-6xl mb-48">
        <div className="flex items-center justify-between mb-16 px-6">
          <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-brand-dark">תחומי התמחות</h2>
          <div className="h-px flex-1 mx-10 bg-brand-dark/10"></div>
          <span className="text-[11px] font-bold text-brand-muted uppercase tracking-widest">GK FOCUS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'פיתוח מנהיגות ומנהלים', desc: 'חיזוק יכולות המנהל ביום-יום הארגוני. עבודה משותפת על תוצאות עסקיות ואנושיות.', icon: '🏔️' },
            { title: 'ליווי הנהלות וארגונים', desc: 'גיבוש צוות ההנהלה ליחידה מסונכרנת אחת. קביעת כללי משחק שעובדים בשטח.', icon: '🤝' },
            { title: 'ייעוץ ארגוני מערכתי', desc: 'ליווי שינויים עמוקים והתאמת הארגון למציאות משתנה ולנסיבות השטח.', icon: '🏗️' },
            { title: 'בניית שותפויות וממשקים', desc: 'בניית ממשקי עבודה חזקים על בסיס מודל חמשת התנאים ואמון הדדי.', icon: '💎' },
            { title: 'ניהול בעידן הטכנולוגי', desc: 'הטמעת כלי עבודה מתקדמים כחלק אינטגרלי מהניהול - לפנות זמן לאנשים.', icon: '🤖' },
            { title: 'ייעוץ אישי (Coaching)', desc: 'ליווי אישי ודיסקרטי בצמתים קריטיים וחיזוק התפקוד הניהולי.', icon: '🎯' }
          ].map((exp, idx) => (
            <ExpertiseCard key={idx} {...exp} />
          ))}
        </div>
      </section>

      {/* 3. Clients Section */}
      <section className="w-full max-w-6xl mb-48">
        <div className="flex items-center justify-between mb-20 px-6">
          <h2 className="text-[13px] font-black uppercase tracking-[0.6em] text-brand-dark">לקוחות ושותפים</h2>
          <div className="h-px flex-1 mx-10 bg-brand-dark/20"></div>
        </div>
        
        <div className="studio-card p-16 md:p-24 border-brand-dark bg-white shadow-inner">
          <div className="flex flex-wrap items-center justify-center gap-16 md:gap-32">
            {clients.length > 0 ? (
              clients.map(client => (
                <div key={client.id} className="grayscale hover:grayscale-0 transition-all duration-700 opacity-40 hover:opacity-100 flex items-center justify-center h-20 w-40 md:w-56">
                  <img 
                    src={client.url} 
                    alt={client.name} 
                    title={client.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))
            ) : (
              [1, 2, 3, 4, 5].map(i => (
                <div key={i} className="grayscale opacity-20 flex items-center justify-center h-16 w-32 border border-brand-dark/10 font-black text-[10px] tracking-widest italic">
                  CLIENT_LOGOS_PENDING_{i}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. The Lab Preview Teaser */}
      <section className="w-full max-w-6xl mb-48 p-12 md:p-24 border-4 border-brand-dark bg-white shadow-[20px_20px_0px_#1a1a1a]">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="w-full md:w-1/3 space-y-10 text-right">
            <span className="text-[13px] font-black text-brand-accent uppercase tracking-[0.7em]">THE LAB</span>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">המעבדה<br/>לניהול.</h2>
            <p className="text-xl text-brand-muted font-bold leading-relaxed italic">
              ארגז כלים דיגיטלי מבוסס AI שבניתי כדי לעזור לך לקחת החלטות טובות יותר ולנהל שינוי בצורה שקופה.
            </p>
            <button onClick={() => onEnterTool('lab')} className="w-full md:w-auto px-12 py-6 bg-brand-dark text-white font-black uppercase text-sm tracking-[0.3em] hover:bg-brand-accent transition-all shadow-2xl">
              כניסה למעבדה ←
            </button>
          </div>
          <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div onClick={() => onEnterTool('dashboard')} className="p-10 border-4 border-brand-dark bg-brand-beige hover:bg-brand-dark hover:text-white transition-all cursor-pointer h-full group text-right shadow-[10px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="text-5xl mb-6">🏠</div>
                <h4 className="text-3xl font-black mb-4 italic">ניהול שינוי (WOOP)</h4>
                <p className="text-lg opacity-60 font-medium">הופכים רצון לתוכנית עבודה מיוצבת (Home) ומלאת תשוקה (Passion).</p>
             </div>
             <div onClick={() => onEnterTool('executive')} className="p-10 border-4 border-brand-dark bg-brand-beige hover:bg-brand-dark hover:text-white transition-all cursor-pointer h-full group text-right shadow-[10px_10px_0px_rgba(0,0,0,0.05)]">
                <div className="text-5xl mb-6">💎</div>
                <h4 className="text-3xl font-black mb-4 italic">פורום הנהלה (TOWS)</h4>
                <p className="text-lg opacity-60 font-medium">הצלבות אסטרטגיות לקבלת החלטות עומק ומיקוד ארגוני.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 5. AI Consultant Input */}
      <section className="w-full max-w-5xl">
        <div className="bg-brand-dark rounded-none p-16 md:p-24 text-white relative border-8 border-brand-accent shadow-[30px_30px_0px_rgba(37,99,235,0.2)]">
          <div className="relative z-10 space-y-16 text-right">
            <div className="space-y-6">
              <span className="text-[13px] font-black text-brand-accent uppercase tracking-[0.6em]">DIRECT ACCESS</span>
              <h3 className="text-5xl md:text-8xl font-black italic tracking-tighter">בוא נחשוב יחד.</h3>
              <p className="text-white/40 text-2xl font-bold max-w-2xl mr-auto leading-relaxed">תאר את האתגר הניהולי שלך כאן, ואמליץ לך על הכלי המתאים ביותר מהמעבדה.</p>
            </div>
            <textarea 
              className="w-full bg-white/5 border-4 border-white/20 rounded-none p-10 md:p-14 text-2xl md:text-4xl outline-none focus:border-brand-accent focus:bg-white/10 transition-all min-h-[250px] resize-none font-bold text-right"
              placeholder="מה מעסיק אותך עכשיו?"
              value={consultationText}
              onChange={e => setConsultationText(e.target.value)}
            />
            <div className="flex justify-start">
              <button 
                onClick={handleConsult}
                disabled={isAiLoading || !consultationText.trim()}
                className="bg-brand-accent text-white px-20 py-8 rounded-none font-black text-3xl hover:bg-white hover:text-brand-dark transition-all disabled:opacity-20 shadow-2xl active:scale-95"
              >
                {isAiLoading ? "מנתח..." : "שלח להתייעצות ←"}
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* 6. Footer */}
      <footer className="w-full max-w-6xl mt-64 pt-20 border-t-2 border-brand-dark/20 flex flex-col md:flex-row justify-between items-center gap-16 pb-20">
        <div className="text-brand-muted text-[12px] font-black uppercase tracking-[0.5em]">
          © 2025 GILAD KILON. BASED IN ISRAEL.
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-10 md:gap-20">
          <a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xl font-black text-brand-accent border-b-4 border-transparent hover:border-brand-accent transition-all tracking-tighter group">
            <span className="w-8 h-8 flex items-center justify-center bg-brand-accent text-white rounded-full text-sm group-hover:scale-110 transition-transform">💬</span>
            WhatsApp
          </a>
          <a href="tel:+972526417512" className="text-xl font-black text-brand-dark border-b-4 border-transparent hover:border-brand-accent transition-all tracking-tighter">052-6417512</a>
          <a href="mailto:gilad@kilon.co.il" className="text-xl font-black text-brand-dark border-b-4 border-transparent hover:border-brand-accent transition-all tracking-tighter">gilad@kilon.co.il</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
