
import React, { useState, useEffect } from 'react';
import { getToolRecommendation } from '../geminiService';
import { getSystemConfig } from '../firebase';
import { ClientLogo, ViewType } from '../types';

// Icons for the Lab Tools
export const Icons = {
  WOOP: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3"/>
      <path d="M12 12l5 5" strokeWidth="3"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),
  TOWS: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeOpacity="0.2"/>
      <path d="M3 12h18" strokeOpacity="0.2"/>
      <path d="M12 3v18" strokeOpacity="0.2"/>
      <path d="M7 7l10 10" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M17 7l-10 10" stroke="currentColor" strokeWidth="2.5"/>
    </svg>
  ),
  Pulse: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 12h3l3-9 4 18 3-9h5" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="13" cy="12" r="2" fill="var(--brand-accent)" stroke="none" className="animate-pulse"/>
    </svg>
  ),
  Tasks: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="5" width="18" height="14" rx="2" strokeOpacity="0.2"/>
      <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="3"/>
      <path d="M3 5h18" strokeOpacity="0.2"/>
    </svg>
  ),
  Ideas: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeOpacity="0.3"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="3"/>
    </svg>
  ),
  DNA: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M8 3c0 4.418 3.582 8 8 8s8-3.582 8-8" strokeOpacity="0.2"/>
      <path d="M0 21c0-4.418 3.582-8 8-8s8 3.582 8 8" strokeOpacity="0.2"/>
      <circle cx="8" cy="13" r="3" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="16" cy="11" r="3" stroke="currentColor" strokeWidth="2.5"/>
    </svg>
  ),
  Feedback: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="9" strokeOpacity="0.2"/>
      <path d="M12 3a9 9 0 0 1 0 18" stroke="currentColor" strokeWidth="3"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
};

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg', dark?: boolean }> = ({ size = 'lg', dark = true }) => {
  const sizes = { 
    sm: 'text-xl md:text-3xl', 
    md: 'text-3xl md:text-5xl', 
    lg: 'text-5xl md:text-[9rem]' 
  };
  
  const subSizes = {
    sm: 'text-[9px] md:text-[14px]',
    md: 'text-[12px] md:text-[20px]',
    lg: 'text-[13px] md:text-[34px]'
  };

  const color = dark ? 'text-brand-dark' : 'text-white';
  
  return (
    <div className={`flex flex-col items-center justify-center select-none font-black uppercase tracking-[-0.04em] leading-[0.8] ${color} w-full`} dir="ltr">
      <div className={`${sizes[size]} drop-shadow-sm text-center`}>GILAD</div>
      <div className={`${sizes[size]} drop-shadow-sm text-center relative flex justify-center items-center`}>
        KILON
        <span className="text-brand-accent absolute top-0 left-[100%]">.</span>
      </div>
      <div className={`relative ${subSizes[size]} tracking-[0.2em] md:tracking-[0.4em] mt-3 md:mt-8 font-bold opacity-70 whitespace-nowrap text-center`}>
        <span>Deeply Rooted Leadership</span>
      </div>
    </div>
  );
};

export const ExpertiseCard: React.FC<{ title: string, desc: string, icon: string }> = ({ title, desc, icon }) => (
  <div className="studio-card p-8 border-brand-dark flex flex-col items-start gap-6 hover:bg-white hover:shadow-[10px_10px_0px_rgba(90,125,154,0.1)] transition-all h-full group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
    <div className="text-4xl grayscale group-hover:grayscale-0 transition-all z-10">{icon}</div>
    <div className="space-y-4 z-10 text-right w-full">
      <h4 className="text-2xl font-black italic leading-none group-hover:text-brand-accent transition-colors">{title}</h4>
      <p className="text-brand-muted font-medium leading-relaxed text-sm md:text-base">{desc}</p>
    </div>
  </div>
);

export const ArticleCard: React.FC<{ title: string, subtitle?: string, category: string, date: string, onClick?: () => void, link?: string }> = ({ title, subtitle, category, date, onClick, link }) => (
  <div 
    onClick={onClick}
    className="group cursor-pointer border-b border-brand-dark/10 py-12 first:border-t hover:bg-brand-accent/[0.02] px-6 transition-all duration-500 block text-right"
  >
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
      <div className="space-y-4">
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-accent/60 block">{category}</span>
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

export const ToolEntry: React.FC<{ title: string, desc: string, onClick: () => void, icon: React.ReactNode }> = ({ title, desc, onClick, icon }) => (
  <div onClick={onClick} className="studio-card p-8 md:p-10 rounded-none cursor-pointer group flex flex-col justify-between border-brand-dark min-h-[340px] h-full shadow-[8px_8px_0px_rgba(26,26,26,0.05)] hover:bg-white transition-all">
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
    <div className="min-h-screen flex flex-col items-center pt-16 md:pt-32 pb-32 px-6 relative overflow-hidden">
      
      {/* Background Subtle Color Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none z-0">
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[400px] left-[-200px] w-[500px] h-[500px] bg-brand-accent/[0.03] rounded-full blur-[100px]"></div>
      </div>

      {/* 1. Hero Section */}
      <section className="w-full max-w-6xl text-center space-y-12 md:space-y-16 mb-48 relative z-10">
        <div className="relative inline-block px-4 md:px-10 max-w-full">
          <BrandLogo size="lg" />
          <div className="absolute top-0 bottom-0 left-0 w-px bg-brand-dark/10"></div>
          <div className="absolute top-0 bottom-0 right-0 w-px bg-brand-dark/10"></div>
        </div>
        
        <div className="space-y-10 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-6xl font-black text-kern leading-[0.95] tracking-tighter uppercase italic">
            Simple Deep <span className="text-brand-accent not-italic font-semibold">Real</span>
          </h1>
          <div className="h-2 w-24 bg-brand-accent mx-auto"></div>
          <p className="text-xl md:text-3xl text-brand-muted max-w-3xl mx-auto font-medium leading-relaxed italic px-4">
            "אני עוזר למנהלים למצוא את העיקר בתוך הרעש. בלי מילים גבוהות, עם עומק מקצועי וכלים שבאמת עובדים."
          </p>
          
          {/* Mobile Quick Access Button - Enhanced with Lab Icon */}
          <div className="block md:hidden pt-4">
            <button 
              onClick={() => onEnterTool('lab')}
              className="group bg-brand-accent text-white px-10 py-6 font-black text-lg uppercase tracking-widest shadow-[10px_10px_0px_#1a1a1a] active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto border-2 border-brand-dark"
            >
              <span>כניסה למעבדה</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 animate-pulse">
                <path d="M10 2v7.5" />
                <path d="M14 2v7.5" />
                <path d="M8.5 2h7" />
                <path d="M14 9.5a5 5 0 1 1-4 0" />
                <path d="M5.5 16h13" />
              </svg>
            </button>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted animate-pulse">Your Professional Workspace</p>
          </div>
        </div>
      </section>

      {/* 2. Professional Expertises */}
      <section className="w-full max-w-6xl mb-48 relative z-10">
        <div className="flex items-center justify-between mb-16 px-6">
          <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-brand-dark">תחומי התמחות</h2>
          <div className="h-px flex-1 mx-10 bg-brand-accent/20"></div>
          <span className="text-[11px] font-bold text-brand-accent uppercase tracking-widest">GK FOCUS</span>
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
      <section className="w-full max-w-6xl mb-48 relative z-10">
        <div className="flex items-center justify-between mb-20 px-6">
          <h2 className="text-[13px] font-black uppercase tracking-widest text-brand-dark">לקוחות ושותפים</h2>
          <div className="h-px flex-1 mx-10 bg-brand-accent/20"></div>
        </div>
        
        <div className="studio-card p-16 md:p-24 border-brand-dark bg-white shadow-inner text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-accent/[0.01] pointer-events-none"></div>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-32 relative z-10">
            {clients.length > 0 ? (
              clients.map(client => (
                <div key={client.id} className="grayscale hover:grayscale-0 transition-all duration-700 opacity-40 hover:opacity-100 flex items-center justify-center h-20 w-40 md:w-56 hover:scale-110">
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
                  CLIENT_LOGOS_PENDING
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. The Lab Preview Teaser */}
      <section className="w-full max-w-6xl mb-48 relative z-10">
        <div className="p-10 md:p-24 border-4 border-brand-dark bg-white shadow-[15px_15px_0px_rgba(90,125,154,0.1)] relative z-[10]">
          <div className="absolute top-4 left-4 md:top-6 md:left-12 bg-brand-accent text-white px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.3em] shadow-md">
            Active Workspace
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center pt-8 md:pt-0">
            <div className="w-full md:w-1/3 space-y-10 text-right">
              <span className="text-[13px] font-black text-brand-accent uppercase tracking-[0.7em]">STRATEGIC TOOLS</span>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none text-brand-dark">המעבדה<br/><span className="text-brand-accent">לניהול.</span></h2>
              
              <div className="bg-brand-beige p-6 border-r-8 border-brand-accent shadow-sm">
                <p className="text-brand-dark font-black text-xl mb-2">מרחב עבודה פרקטי.</p>
                <p className="text-brand-muted text-sm font-bold leading-relaxed">
                  כאן אפשר לנתח מצבים, למדוד דופק צוותי ולנהל שינויים בעזרת כלי AI פשוטים שמבוססים על ניסיון מהשטח.
                </p>
              </div>

              <button onClick={() => onEnterTool('lab')} className="w-full md:w-auto px-12 py-6 bg-brand-dark text-white font-black uppercase text-sm tracking-[0.3em] hover:bg-brand-accent transition-all shadow-2xl group">
                כניסה למרחב העבודה <span className="inline-block group-hover:translate-x-[-4px] transition-transform">←</span>
              </button>
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div onClick={() => onEnterTool('dashboard')} className="p-8 border-4 border-brand-dark bg-brand-beige hover:bg-white hover:border-brand-accent transition-all cursor-pointer h-full group text-right shadow-[8px_8px_0px_rgba(90,125,154,0.05)]">
                  <div className="w-12 h-12 mb-4 group-hover:text-brand-accent transition-colors"><Icons.WOOP /></div>
                  <h4 className="text-2xl font-black mb-2 italic leading-tight group-hover:text-brand-accent">ניהול שינוי</h4>
                  <p className="text-sm opacity-60 font-medium">הופכים רצון לתוכנית עבודה אמיתית.</p>
               </div>
               <div onClick={() => onEnterTool('executive')} className="p-8 border-4 border-brand-dark bg-brand-beige hover:bg-white hover:border-brand-accent transition-all cursor-pointer h-full group text-right shadow-[8px_8px_0px_rgba(90,125,154,0.05)]">
                  <div className="w-12 h-12 mb-4 group-hover:text-brand-accent transition-colors"><Icons.TOWS /></div>
                  <h4 className="text-2xl font-black mb-2 italic leading-tight group-hover:text-brand-accent">פורום הנהלה</h4>
                  <p className="text-sm opacity-60 font-medium">החלטות נכונות לפי השטח והיכולות.</p>
               </div>
               <div onClick={() => onEnterTool('feedback360')} className="p-8 border-4 border-brand-dark bg-brand-beige hover:bg-white hover:border-brand-accent transition-all cursor-pointer h-full group text-right shadow-[8px_8px_0px_rgba(90,125,154,0.05)]">
                  <div className="w-12 h-12 mb-4 group-hover:text-brand-accent transition-colors"><Icons.Feedback /></div>
                  <h4 className="text-2xl font-black mb-2 italic leading-tight group-hover:text-brand-accent">משוב 360</h4>
                  <p className="text-sm opacity-60 font-medium">מה הסביבה באמת חושבת עליך?</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI Consultant Input */}
      <section className="w-full max-w-5xl relative z-10">
        <div className="bg-brand-dark rounded-none p-12 md:p-24 text-white relative border-8 border-brand-accent shadow-[20px_20px_0px_rgba(90,125,154,0.2)] z-[5] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-brand-accent/5 pointer-events-none"></div>
          <div className="relative z-10 space-y-16 text-right">
            <div className="space-y-6">
              <span className="text-[13px] font-black text-brand-accent uppercase tracking-[0.6em]">DIRECT ACCESS</span>
              <h3 className="text-5xl md:text-8xl font-black italic tracking-tighter">בוא נחשוב <span className="text-brand-accent">יחד.</span></h3>
              <p className="text-white/40 text-xl md:text-2xl font-bold max-w-2xl mr-auto leading-relaxed">תאר את האתגר הניהולי שלך כאן, וה-AI שלי יכווין אותך לכלי המתאים ביותר במעבדה.</p>
            </div>
            <textarea 
              className="w-full bg-white/5 border-4 border-white/20 rounded-none p-8 md:p-14 text-2xl md:text-4xl outline-none focus:border-brand-accent focus:bg-white/10 transition-all min-h-[200px] md:min-h-[250px] resize-none font-bold text-right"
              placeholder="מה מעסיק אותך עכשיו?"
              value={consultationText}
              onChange={e => setConsultationText(e.target.value)}
            />
            <div className="flex justify-start">
              <button 
                onClick={handleConsult} 
                disabled={isAiLoading || !consultationText.trim()}
                className="bg-brand-accent text-white px-12 md:px-20 py-6 md:py-8 rounded-none font-black text-2xl md:text-3xl hover:bg-white hover:text-brand-dark transition-all disabled:opacity-20 shadow-2xl active:scale-95 border-4 border-transparent hover:border-brand-accent"
              >
                {isAiLoading ? "מנתח..." : "שלח להתייעצות ←"}
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* 6. Footer */}
      <footer className="w-full max-w-6xl mt-64 pt-20 border-t-2 border-brand-accent/20 flex flex-col md:flex-row justify-between items-center gap-16 pb-20 relative z-10">
        <div className="text-brand-muted text-[12px] font-black uppercase tracking-[0.5em]">
          © 2025 GILAD KILON. BASED IN ISRAEL.
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-10 md:gap-20">
          <a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xl font-black text-brand-accent border-b-4 border-transparent hover:border-brand-accent transition-all tracking-tighter group">
            <span className="w-8 h-8 flex items-center justify-center bg-brand-accent text-white rounded-full text-sm group-hover:scale-110 transition-transform">💬</span>
            WhatsApp
          </a>
          <a href="tel:+972526417512" className="text-xl font-black text-brand-dark border-b-4 border-transparent hover:border-brand-accent transition-all tracking-tighter hover:text-brand-accent">052-6417512</a>
          <a href="mailto:gilad@kilon.co.il" className="text-xl font-black text-brand-dark border-b-4 border-transparent hover:border-brand-accent transition-all tracking-tighter hover:text-brand-accent">gilad@kilon.co.il</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
