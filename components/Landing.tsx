
import React, { useState, useEffect } from 'react';
import { getSystemConfig } from '../firebase';
import { ClientLogo } from '../types';

// Sophisticated Architectural Stroke Icons for Expertise
const ExpertiseIcons = {
  Leadership: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 21V3M12 3L7 8M12 3L17 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="var(--brand-accent)" strokeWidth="1.5" />
      <path d="M4 21H20" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
    </svg>
  ),
  Board: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="5" y="5" width="14" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 12H19M12 5V19" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
      <circle cx="12" cy="12" r="5" stroke="var(--brand-accent)" strokeWidth="1.2" strokeDasharray="2 2" />
      <rect x="11.5" y="11.5" width="1" height="1" fill="var(--brand-accent)" />
    </svg>
  ),
  Organization: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M2 20H22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 20V8L12 4L18 8V20" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 13H14" stroke="var(--brand-accent)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 17H14" stroke="var(--brand-accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.5" fill="var(--brand-accent)" />
    </svg>
  ),
  Partnership: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="8" cy="12" r="5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
      <path d="M12 12C12 10 13.5 8 15.5 8" stroke="var(--brand-accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.5" fill="var(--brand-accent)" />
    </svg>
  ),
  Tech: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M4 8V6C4 5.4 4.4 5 5 5H19C19.6 5 20 5.4 20 6V8M4 16V18C4 18.6 4.4 19 5 19H19C19.6 19 20 18.6 20 18V16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="var(--brand-accent)" strokeWidth="1.2" />
      <path d="M12 9V6M12 18V15M9 12H6M18 12H15" stroke="var(--brand-accent)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Coaching: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 12L15 9" stroke="var(--brand-accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="var(--brand-accent)" />
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
    lg: 'text-5xl md:text-[6.5rem]' 
  };
  
  const subSizes = {
    sm: 'text-[4px] md:text-[5px]', 
    md: 'text-[8px] md:text-[12px]', 
    lg: 'text-[12px] md:text-[19px]' 
  };

  const color = dark ? 'text-brand-dark' : 'text-white';
  
  return (
    <div className={`flex flex-col items-center justify-center select-none font-black uppercase tracking-tighter leading-[0.8] ${color} w-full`} dir="ltr">
      <div className={`${sizes[size]} drop-shadow-sm text-center`}>GILAD</div>
      <div className={`${sizes[size]} drop-shadow-sm text-center relative flex justify-center items-center`}>
        KILON
        <span className="text-brand-accent absolute top-0 left-[100%] ml-1">.</span>
      </div>
      <div className={`relative ${subSizes[size]} tracking-[0.15em] mt-3 font-bold opacity-70 whitespace-nowrap text-center`}>
        <span>Deeply Rooted Leadership</span>
      </div>
    </div>
  );
};

export const ExpertiseCard: React.FC<{ title: string, desc: string, icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="studio-card p-10 border-brand-dark flex flex-col items-start gap-10 hover:bg-white transition-all h-full group relative overflow-hidden bg-gradient-to-br from-white to-brand-accent/[0.03] shadow-[8px_8px_0px_rgba(26,26,26,0.03)]">
    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/[0.04] rounded-bl-full translate-x-12 -translate-y-12 transition-transform duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0"></div>
    <div className="w-14 h-14 text-brand-dark group-hover:text-brand-accent group-hover:scale-110 transition-all z-10 duration-500 border-r-2 border-brand-accent/20 pr-4 group-hover:border-brand-accent">
      {icon}
    </div>
    <div className="space-y-4 z-10 text-right w-full">
      <div className="flex items-center gap-3 justify-end mb-2">
        <h4 className="text-2xl font-black italic leading-none group-hover:text-brand-accent transition-colors">{title}</h4>
        <div className="w-2 h-2 rounded-full bg-brand-accent opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all"></div>
      </div>
      <p className="text-brand-muted font-medium leading-relaxed text-sm md:text-[17px] border-r border-brand-accent/10 pr-6 group-hover:border-brand-accent transition-all">
        {desc}
      </p>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-accent/10 group-hover:bg-brand-accent transition-all duration-700"></div>
  </div>
);

export const ToolEntry: React.FC<{ title: string, desc: string, onClick: () => void, icon: React.ReactNode }> = ({ title, desc, onClick, icon }) => (
  <div onClick={onClick} className="studio-card p-10 md:p-12 rounded-none cursor-pointer group flex flex-col justify-between border-brand-dark min-h-[380px] h-full shadow-[10px_10px_0px_rgba(26,26,26,0.06)] hover:bg-white hover:shadow-[12px_12px_0px_var(--brand-accent)] transition-all">
    <div className="w-20 h-20 group-hover:scale-110 transition-transform duration-500 text-brand-dark group-hover:text-brand-accent mb-8">
      {icon}
    </div>
    <div className="space-y-5 flex-1 text-right">
      <h4 className="text-3xl font-black italic leading-tight group-hover:text-brand-accent transition-colors">{title}</h4>
      <p className="text-base text-brand-muted font-medium leading-relaxed">{desc}</p>
    </div>
    <div className="pt-8 mt-8 border-t border-brand-dark/10 overflow-hidden h-8">
      <span className="text-[12px] font-black uppercase tracking-[0.4em] text-brand-dark group-hover:translate-y-[-30px] transition-transform block">Open Tool</span>
      <span className="text-[12px] font-black uppercase tracking-[0.4em] text-brand-accent translate-y-[30px] group-hover:translate-y-[-30px] transition-transform block">Enter Workspace ←</span>
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
    <div className="min-h-screen flex flex-col items-center pt-24 md:pt-40 pb-40 px-6 relative overflow-hidden">
      
      {/* Background Layering - Subtle Watermark Style */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
         <div 
           className="w-full h-full opacity-[0.1] bg-no-repeat bg-center transform scale-75"
           style={{ 
             backgroundImage: 'url("hero.jpg")',
             backgroundSize: 'contain'
           }}
         ></div>
         
         <div className="absolute top-[-100px] right-[-200px] w-[800px] h-[800px] bg-brand-accent/[0.04] rounded-full blur-[150px]"></div>
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-6xl text-center space-y-24 md:space-y-32 mb-64 relative z-10">
        <div className="space-y-20">
          <div className="animate-fadeIn">
            <BrandLogo size="lg" />
          </div>
          
          <div className="space-y-16 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-7xl font-black text-kern leading-none tracking-tighter uppercase italic">
              Simple <span className="text-brand-accent font-semibold italic">Deep</span> Real
            </h1>
            <div className="h-2 w-32 bg-brand-accent mx-auto shadow-[0_0_15px_var(--brand-accent)] opacity-60"></div>
            <p className="text-2xl md:text-5xl text-brand-dark max-w-3xl mx-auto font-medium leading-tight italic px-4">
              "אני עוזר למנהלים למצוא את העיקר בתוך הרעש. בלי מילים גבוהות, עם עומק מקצועי וכלים שבאמת עובדים."
            </p>
            
            <div className="flex justify-center pt-12">
              <button 
                onClick={() => onEnterTool('lab')}
                className="group bg-brand-dark text-white px-16 py-10 font-black text-2xl uppercase tracking-widest shadow-[15px_15px_0px_var(--brand-accent)] active:scale-95 transition-all flex items-center justify-center gap-6 border-4 border-brand-dark hover:bg-brand-accent hover:border-brand-accent"
              >
                <span>כניסה למעבדה (The Lab)</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 group-hover:rotate-12 transition-transform">
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
      <section className="w-full max-w-6xl mb-64 relative z-10">
        <div className="flex items-center justify-between mb-24 px-6">
          <div className="flex flex-col items-start text-right">
            <h2 className="text-[14px] font-black uppercase tracking-[0.6em] text-brand-dark mb-2">תחומי התמחות</h2>
            <div className="h-1 w-20 bg-brand-accent opacity-50"></div>
          </div>
          <span className="text-[12px] font-bold text-brand-accent uppercase tracking-[0.4em] italic opacity-70">STRATEGIC FOCUS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
