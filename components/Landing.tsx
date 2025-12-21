
import React, { useState, useEffect } from 'react';
import { getSystemConfig } from '../firebase';
import { ClientLogo } from '../types';

// Abstract, Architectural Sophisticated Graphics for Expertise
const ExpertiseIcons = {
  Leadership: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 21L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 16L12 21L17 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3C10 3 8 5 8 8C8 11 12 15 12 15C12 15 16 11 16 8C16 5 14 3 12 3Z" stroke="var(--brand-accent)" strokeWidth="1.5" />
      <circle cx="12" cy="8" r="1.5" fill="var(--brand-accent)" />
    </svg>
  ),
  Board: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="4" y="4" width="16" height="16" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 12H20M12 4V20" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
      <rect x="9" y="9" width="6" height="6" fill="var(--brand-accent)" fillOpacity="0.1" stroke="var(--brand-accent)" strokeWidth="1.5" />
      <path d="M9 12L15 12M12 9L12 15" stroke="var(--brand-accent)" strokeWidth="1" />
    </svg>
  ),
  Organization: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M2 20H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 20V8L12 4L18 8V20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 12H14M10 16H14" stroke="var(--brand-accent)" strokeWidth="2" strokeLinecap="round" />
      <rect x="11.5" y="7" width="1" height="1" fill="var(--brand-accent)" />
    </svg>
  ),
  Partnership: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12Z" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      <path d="M8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16" stroke="var(--brand-accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Tech: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M4 7V5C4 4.45 4.45 4 5 4H19C19.55 4 20 4.45 20 5V7M4 17V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V17" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <rect x="8" y="8" width="8" height="8" rx="1" stroke="var(--brand-accent)" strokeWidth="1.5" />
      <path d="M12 8V6M12 18V16M8 12H6M18 12H16" stroke="var(--brand-accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1" fill="var(--brand-accent)" />
    </svg>
  ),
  Coaching: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 6V12L16 16" stroke="var(--brand-accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.5" fill="var(--brand-accent)" />
    </svg>
  )
};

// Icons for the Lab Tools
export const Icons = {
  WOOP: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" className="text-brand-accent"/>
      <path d="M12 12l5 5" strokeWidth="3"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),
  TOWS: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeOpacity="0.2"/>
      <path d="M3 12h18" strokeOpacity="0.2"/>
      <path d="M12 3v18" strokeOpacity="0.2"/>
      <path d="M7 7l10 10" stroke="currentColor" strokeWidth="2.5" className="text-brand-accent"/>
      <path d="M17 7l-10 10" stroke="currentColor" strokeWidth="2.5"/>
    </svg>
  ),
  Pulse: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 12h3l3-9 4 18 3-9h5" stroke="currentColor" strokeWidth="2.5" className="text-brand-accent"/>
      <circle cx="13" cy="12" r="2" fill="var(--brand-accent)" stroke="none" className="animate-pulse"/>
    </svg>
  ),
  Tasks: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="5" width="18" height="14" rx="2" strokeOpacity="0.2"/>
      <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="3" className="text-brand-accent"/>
      <path d="M3 5h18" strokeOpacity="0.2"/>
    </svg>
  ),
  Ideas: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeOpacity="0.3"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="3" className="text-brand-accent"/>
    </svg>
  ),
  DNA: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M8 3c0 4.418 3.582 8 8 8s8-3.582 8-8" strokeOpacity="0.2"/>
      <path d="M0 21c0-4.418 3.582-8 8-8s8 3.582 8 8" strokeOpacity="0.2"/>
      <circle cx="8" cy="13" r="3" stroke="currentColor" strokeWidth="2.5" className="text-brand-accent"/>
      <circle cx="16" cy="11" r="3" stroke="currentColor" strokeWidth="2.5"/>
    </svg>
  ),
  Feedback: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="9" strokeOpacity="0.2"/>
      <path d="M12 3a9 9 0 0 1 0 18" stroke="currentColor" strokeWidth="3" className="text-brand-accent"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
};

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg', dark?: boolean }> = ({ size = 'lg', dark = true }) => {
  const sizes = { 
    sm: 'text-xl md:text-2xl', 
    md: 'text-3xl md:text-5xl', 
    lg: 'text-5xl md:text-[6rem]' 
  };
  
  const subSizes = {
    sm: 'text-[4px] md:text-[5px]', 
    md: 'text-[8px] md:text-[12px]', 
    lg: 'text-[11px] md:text-[18px]' 
  };

  const spacing = {
    sm: 'mt-0 md:mt-0.5',
    md: 'mt-1.5 md:mt-2.5',
    lg: 'mt-2 md:mt-4'
  };

  const color = dark ? 'text-brand-dark' : 'text-white';
  
  return (
    <div className={`flex flex-col items-center justify-center select-none font-black uppercase tracking-tighter leading-[0.85] ${color} w-full`} dir="ltr">
      <div className={`${sizes[size]} drop-shadow-sm text-center`}>GILAD</div>
      <div className={`${sizes[size]} drop-shadow-sm text-center relative flex justify-center items-center`}>
        KILON
        <span className="text-brand-accent absolute top-0 left-[100%]">.</span>
      </div>
      <div className={`relative ${subSizes[size]} tracking-[0.1em] ${spacing[size]} font-bold opacity-60 whitespace-nowrap text-center`}>
        <span>Deeply Rooted Leadership</span>
      </div>
    </div>
  );
};

export const ExpertiseCard: React.FC<{ title: string, desc: string, icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="studio-card p-8 border-brand-dark flex flex-col items-start gap-8 hover:bg-white transition-all h-full group relative overflow-hidden bg-gradient-to-br from-white to-brand-accent/[0.03] shadow-[8px_8px_0px_rgba(26,26,26,0.03)]">
    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-bl-full translate-x-16 -translate-y-16 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
    <div className="w-14 h-14 text-brand-dark group-hover:text-brand-accent group-hover:scale-110 transition-all z-10 duration-500 border-r-2 border-brand-accent/20 pr-4 group-hover:border-brand-accent">
      {icon}
    </div>
    <div className="space-y-4 z-10 text-right w-full">
      <div className="flex items-center gap-2 justify-end">
        <h4 className="text-2xl font-black italic leading-none group-hover:text-brand-accent transition-colors">{title}</h4>
        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/40 group-hover:bg-brand-accent transition-colors"></div>
      </div>
      <p className="text-brand-muted font-medium leading-relaxed text-sm md:text-base border-r-2 border-brand-accent/10 pr-4 group-hover:border-brand-accent transition-all">
        {desc}
      </p>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-700"></div>
  </div>
);

export const ToolEntry: React.FC<{ title: string, desc: string, onClick: () => void, icon: React.ReactNode }> = ({ title, desc, onClick, icon }) => (
  <div onClick={onClick} className="studio-card p-8 md:p-10 rounded-none cursor-pointer group flex flex-col justify-between border-brand-dark min-h-[340px] h-full shadow-[8px_8px_0px_rgba(26,26,26,0.05)] hover:bg-white hover:shadow-[10px_10px_0px_var(--brand-accent)] transition-all">
    <div className="w-16 h-16 group-hover:scale-110 transition-transform duration-500 text-brand-dark group-hover:text-brand-accent mb-6">
      {icon}
    </div>
    <div className="space-y-4 flex-1 text-right">
      <h4 className="text-2xl font-black italic leading-tight group-hover:text-brand-accent transition-colors">{title}</h4>
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
  const [clients, setClients] = useState<ClientLogo[]>([]);

  useEffect(() => {
    getSystemConfig().then(config => setClients(config.clients || []));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 md:pt-32 pb-32 px-6 relative overflow-hidden">
      
      {/* Background Subtle Color Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none z-0">
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[400px] left-[-200px] w-[500px] h-[500px] bg-brand-accent/[0.05] rounded-full blur-[100px]"></div>
      </div>

      {/* 1. Hero Section */}
      <section className="w-full max-w-6xl text-center space-y-12 md:space-y-24 mb-48 relative z-10 py-12">
        <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
          <img 
            src="/hero-bg.jpg" 
            alt="" 
            className="w-full h-full object-cover grayscale opacity-[0.12] scale-110"
            onError={(e) => { 
              if (e.currentTarget.src.includes('/hero-bg.jpg')) {
                  e.currentTarget.src = 'hero-bg.jpg';
              } else {
                  e.currentTarget.style.display = 'none'; 
              }
            }}
          />
        </div>

        <div className="space-y-16">
          <BrandLogo size="lg" />
          
          <div className="space-y-10 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-6xl font-black text-kern leading-[0.95] tracking-tighter uppercase italic">
              Simple <span className="text-brand-accent font-semibold italic">Deep</span> Real
            </h1>
            <div className="h-2 w-24 bg-brand-accent mx-auto"></div>
            <p className="text-xl md:text-4xl text-brand-dark max-w-3xl mx-auto font-medium leading-relaxed italic px-4">
              "אני עוזר למנהלים למצוא את העיקר בתוך הרעש. בלי מילים גבוהות, עם עומק מקצועי וכלים שבאמת עובדים."
            </p>
            
            <div className="flex justify-center pt-8">
              <button 
                onClick={() => onEnterTool('lab')}
                className="group bg-brand-dark text-white px-12 py-8 font-black text-xl uppercase tracking-widest shadow-[12px_12px_0px_var(--brand-accent)] active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-brand-dark hover:bg-brand-accent hover:border-brand-accent"
              >
                <span>כניסה למעבדה (The Lab)</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 animate-pulse">
                  <path d="M10 2v7.5" />
                  <path d="M14 2v7.5" />
                  <path d="M8.5 2h7" />
                  <path d="M14 9.5a5 5 0 1 1-4 0" />
                  <path d="M5.5 16h13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="w-full max-w-6xl mb-48 relative z-10">
        <div className="flex items-center justify-between mb-16 px-6">
          <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-brand-dark">תחומי התמחות</h2>
          <div className="h-px flex-1 mx-10 bg-brand-accent/20"></div>
          <span className="text-[11px] font-bold text-brand-accent uppercase tracking-widest">GK FOCUS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'פיתוח מנהיגות ומנהלים', desc: 'חיזוק יכולות המנהל ביום-יום הארגוני. עבודה משותפת על תוצאות עסקיות ואנושיות.', icon: <ExpertiseIcons.Leadership /> },
            { title: 'ליווי הנהלות וארגונים', desc: 'גיבוש צוות ההנהלה ליחידה מסונכרנת אחת. קביעת כללי משחק שעובדים בשטח.', icon: <ExpertiseIcons.Board /> },
            { title: 'ייעוץ ארגוני מערכתי', desc: 'ליווי שינויים עמוקים והתאמת הארגון למציאות משתנה ולנסיבות השטח.', icon: <ExpertiseIcons.Organization /> },
            { title: 'בניית שותפויות וממשקים', desc: 'בניית ממשקי עבודה חזקים על בסיס מודל חמשת התנאים ואמון הדדי.', icon: <ExpertiseIcons.Partnership /> },
            { title: 'ניהול בעידן הטכנולוגי', desc: 'הטמעת כלי עבודה מתקדמים כחלק אינטגרלי מהניהול - לפנות זמן לאנשים.', icon: <ExpertiseIcons.Tech /> },
            { title: 'ייעוץ אישי (Coaching)', desc: 'ליווי אישי ודיסקרטי בצמתים קריטיים וחיזוק התפקוד הניהולי.', icon: <ExpertiseIcons.Coaching /> }
          ].map((exp, idx) => (
            <ExpertiseCard key={idx} {...exp} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
