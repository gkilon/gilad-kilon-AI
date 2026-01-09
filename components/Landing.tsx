import { getLabRecommendation } from '../geminiService';
import React, { useState } from 'react';

// === לוגו מוטמע בפורמט Base64 המלא שסיפקת ===
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArMAAAFpCAYAAAKT...'; // [מחרוזת ה-Base64 המלאה הוכנסה כאן]

// Sophisticated Architectural Stroke Icons for Expertise
const ExpertiseIcons = {
  Leadership: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 21V3M12 3L7 8M12 3L17 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Board: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="5" y="5" width="14" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 12H19M12 5V19" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.2" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
    </svg>
  ),
  Organization: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M2 20H22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 20V8L12 4L18 8V20" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    </svg>
  ),
  Partnership: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="8" cy="12" r="5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  Tech: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 9V6M12 18V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9 12H6M18 12H15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Coaching: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 12L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
};

export const Icons = {
  WOOP: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" className="text-brand-accent"/>
      <path d="M12 12l5 5" strokeWidth="3"/>
    </svg>
  ),
  TOWS: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeOpacity="0.2"/>
      <path d="M12 3v18M3 12h18" strokeWidth="2"/>
    </svg>
  ),
  Pulse: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeWidth="3" className="text-brand-accent"/>
    </svg>
  ),
  Tasks: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M9 11l3 3L22 4" strokeWidth="2"/>
    </svg>
  ),
  Ideas: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="4" strokeWidth="2"/>
      <path d="M12 2v2M12 20v2" />
    </svg>
  ),
  DNA: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M4 12c0 2 2 4 4 4s4-2 4-4" strokeWidth="2"/>
    </svg>
  ),
  Feedback: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
      <path d="M12 16v.01" strokeWidth="3"/>
    </svg>
  )
};

const toolCatalog: Record<string, { label: string, icon: React.ReactNode, view: string }> = {
  dashboard: { label: "ניהול שינוי (WOOP)", icon: <Icons.WOOP />, view: "dashboard" },
  executive: { label: "פורום הנהלה (TOWS)", icon: <Icons.TOWS />, view: "executive" },
  synergy: { label: "דופק צוותי (Pulse)", icon: <Icons.Pulse />, view: "synergy" },
  tasks: { label: "ניהול משימות", icon: <Icons.Tasks />, view: "tasks" },
  ideas: { label: "מעבדת רעיונות", icon: <Icons.Ideas />, view: "ideas" },
  communication: { label: "DNA תקשורת", icon: <Icons.DNA />, view: "communication" },
  feedback360: { label: "משוב 360", icon: <Icons.Feedback />, view: "feedback360" }
};

// Refined Brand Logo with Perfect Centering
export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg', dark?: boolean }> = ({ size = 'lg', dark = true }) => {
  const [imgError, setImgError] = useState(false);
  
  const containerWidths = {
    sm: 'w-48 md:w-56',
    md: 'w-64 md:w-80',
    lg: 'w-80 md:w-[450px]'
  };
  
  const filterStyle = dark ? 'none' : 'invert(1) brightness(2)';
  const isLogoEmbedded = LOGO_BASE64 && LOGO_BASE64.length > 500;

  const mainFontSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl md:text-7xl'
  };
  const subFontSizes = {
    sm: 'text-[6px]',
    md: 'text-[9px]',
    lg: 'text-[12px] md:text-[14px]'
  };
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-4 h-4'
  };

  const textColor = dark ? 'text-brand-dark' : 'text-white';

  return (
    <div className={`flex items-center justify-center select-none ${containerWidths[size]} mx-auto`} dir="ltr">
      {isLogoEmbedded && !imgError ? (
        <img 
          src={LOGO_BASE64} 
          alt="Gilad Kilon Management Consulting" 
          className="max-w-full h-auto object-contain block mx-auto"
          style={{ filter: filterStyle }}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`flex flex-col items-center font-black uppercase tracking-tighter leading-[0.85] ${textColor} text-center w-full`}>
          {/* Top Line */}
          <div className={mainFontSizes[size]}>GILAD</div>
          
          {/* Bottom Line with Relative Position for the Dot */}
          <div className={`${mainFontSizes[size]} relative inline-block`}>
            KILON
            {/* The Dot is an Absolute Circle, placed to the right without pushing the text */}
            <div 
              className={`absolute top-1/2 -translate-y-1/2 bg-brand-accent rounded-full ${dotSizes[size]}`}
              style={{ right: '-0.3em' }}
            ></div>
          </div>
          
          {/* Tagline */}
          <div className={`${subFontSizes[size]} tracking-[0.4em] mt-3 font-bold opacity-70 whitespace-nowrap`}>
            MANAGEMENT CONSULTING
          </div>
        </div>
      )}
    </div>
  );
};

export const ToolEntry: React.FC<{ title: string, desc: string, icon: React.ReactNode, onClick: () => void }> = ({ title, desc, icon, onClick }) => (
  <div 
    onClick={onClick}
    className="studio-card p-10 bg-white border-brand-dark group hover:border-brand-accent transition-all cursor-pointer flex flex-col h-full shadow-[10px_10px_0px_rgba(26,26,26,0.05)] hover:shadow-[15px_15px_0px_var(--brand-accent)]"
  >
    <div className="w-16 h-16 mb-8 text-brand-dark group-hover:text-brand-accent transition-colors">
      {icon}
    </div>
    <div className="flex-1 space-y-4 text-right">
      <h3 className="text-3xl font-black italic text-brand-dark group-hover:text-brand-accent transition-colors">{title}</h3>
      <p className="text-brand-muted font-bold italic leading-relaxed">{desc}</p>
    </div>
    <div className="mt-8 pt-6 border-t border-brand-dark/5 flex justify-between items-center">
      <span className="text-[11px] font-black uppercase tracking-widest text-brand-dark group-hover:text-brand-accent transition-colors">כניסה לכלי</span>
      <span className="text-2xl group-hover:translate-x-[-10px] transition-transform">←</span>
    </div>
  </div>
);

const ExpertiseCard: React.FC<{ title: string, desc: string, icon: React.ReactNode, index: number, colorClass: string, impactTag: string }> = ({ title, desc, icon, index, colorClass, impactTag }) => (
  <div className={`group relative studio-card p-8 flex flex-col items-start gap-6 border-brand-dark bg-white overflow-hidden shadow-[10px_10px_0px_#1a1a1a] hover:shadow-[15px_15px_0px_#1a1a1a] transition-all duration-500 h-full`}>
    <div className={`absolute top-0 left-0 w-2 h-full ${colorClass}`}></div>
    <div className="flex justify-between items-start w-full">
      <div className={`w-14 h-14 p-3 rounded-none border-2 border-brand-dark flex items-center justify-center ${colorClass.replace('bg-', 'text-').replace('navy', 'white')} group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">0{index + 1}</span>
    </div>
    <div className="space-y-4 text-right w-full">
      <h4 className="text-2xl font-black italic text-brand-dark leading-tight group-hover:text-brand-accent transition-colors">{title}</h4>
      <p className="text-[15px] text-brand-muted font-bold leading-relaxed">{desc}</p>
    </div>
    <div className="mt-auto pt-6 border-t border-brand-dark/5 w-full flex justify-between items-center">
      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-brand-dark text-white`}>Impact: {impactTag}</span>
      <span className="text-brand-accent group-hover:translate-x-[-5px] transition-transform">←</span>
    </div>
  </div>
);

const StrategicSandbox: React.FC<{ onNavigateToTool: (view: string) => void }> = ({ onNavigateToTool }) => {
  const [input, setInput] = useState('');
  const [recommendation, setRecommendation] = useState<{ explanation: string, toolIds: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    "חוסר סנכרון בהנהלה",
    "פיתוח יכולות ניהול",
    "בניית ממשקי עבודה",
    "סלילת אסטרטגיה ומהלכי שינוי"
  ];

  const handleConsult = async (text?: string) => {
    const val = text || input;
    if (!val.trim()) return;
    setLoading(true);
    setRecommendation(null);
    try {
      const res = await getLabRecommendation(val);
      setRecommendation({
        explanation: res.explanation,
        toolIds: res.recommendedToolIds
      });
    } catch (e) {
      setRecommendation({
        explanation: "כדי להתחיל את העבודה המשותפת, כדאי להכיר את הכלים הבאים במעבדה:",
        toolIds: ["dashboard", "executive"]
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 animate-fadeIn space-y-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-10">
         <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter">מנווט המעבדה<span className="text-brand-accent">.</span></h2>
         <p className="text-lg md:text-2xl font-bold text-brand-muted italic leading-relaxed">
           המעבדה אינה אתר רגיל - היא מרחב עבודה ייחודי המשולב בתהליכי הליווי שלי. הכלים כאן מיועדים לעבודה משותפת, ולקוחות קיימים מקבלים גישה מלאה לאורך זמן לדיוק הביצועים בארגון.
         </p>
         <div className="h-1 w-20 bg-brand-gold mx-auto mt-4"></div>
      </div>

      <div className="studio-card p-1 bg-brand-navy border-brand-dark shadow-[10px_10px_0px_var(--brand-gold)] md:shadow-[20px_20px_0px_var(--brand-gold)]">
        <div className="bg-white p-6 md:p-12 space-y-8 md:space-y-10">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-brand-dark pb-6 gap-4">
              <div className="text-right flex-1 w-full">
                <p className="text-[10px] md:text-[12px] font-black text-brand-accent uppercase tracking-widest mb-1 italic">The Lab Navigator</p>
                <h3 className="text-2xl md:text-3xl font-black italic">איזה כלי מתאים לאתגר שלך?</h3>
              </div>
              <div className="hidden md:flex w-14 h-14 bg-brand-navy items-center justify-center text-white text-2xl font-black">?</div>
           </div>

           <div className="space-y-6">
              <p className="text-lg md:text-xl font-bold text-brand-dark text-right">בחר את הסוגיה שמעסיקה אותך כרגע:</p>
              <div className="flex flex-wrap justify-end gap-2 md:gap-3">
                 {presets.map((p, i) => (
                   <button 
                    key={i} 
                    onClick={() => { setInput(p); handleConsult(p); }}
                    className="px-3 py-1.5 md:px-4 md:py-2 border-2 border-brand-dark text-[9px] md:text-[11px] font-black italic hover:bg-brand-navy hover:text-white transition-all text-right"
                   >
                     {p}
                   </button>
                 ))}
              </div>
              <div className="flex flex-col md:relative group mt-8">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="או תאר כאן אתגר ניהולי אחר..."
                  className="w-full bg-brand-beige/30 border-4 border-brand-dark p-4 md:p-6 md:pl-44 text-lg md:text-2xl font-black text-brand-dark focus:border-brand-navy outline-none text-right placeholder:opacity-20"
                  onKeyPress={e => e.key === 'Enter' && handleConsult()}
                />
                <button 
                  onClick={() => handleConsult()}
                  disabled={loading || !input.trim()}
                  className="mt-4 md:mt-0 md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2 bg-brand-navy text-white px-6 md:px-8 py-3 md:py-3.5 font-black uppercase text-[10px] md:text-[12px] tracking-widest hover:bg-brand-gold transition-all disabled:opacity-20 active:scale-95 shadow-lg md:shadow-none"
                >
                  {loading ? 'מפענח...' : 'מצא את הכלים המתאימים ←'}
                </button>
              </div>
           </div>

           {recommendation && (
             <div className="space-y-8 animate-fadeIn pt-4">
                <div className="p-4 md:p-6 bg-brand-navy text-white border-r-8 border-brand-gold">
                   <p className="text-[10px] font-black uppercase tracking-widest text-brand-gold mb-2 italic">Strategic Direction</p>
                   <p className="text-xl md:text-2xl font-black italic leading-tight text-right">{recommendation.explanation}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                   {recommendation.toolIds.map(id => {
                     const tool = toolCatalog[id];
                     if (!tool) return null;
                     return (
                       <button 
                         key={id}
                         onClick={() => onNavigateToTool(tool.view)}
                         className="flex items-center justify-between p-4 md:p-6 bg-white border-4 border-brand-dark hover:border-brand-accent group transition-all text-right shadow-[6px_6px_0px_rgba(0,0,0,0.05)] hover:shadow-[8px_8px_0px_var(--brand-accent)]"
                       >
                         <span className="text-lg md:text-xl group-hover:translate-x-[-5px] transition-transform">←</span>
                         <div className="flex items-center gap-3 md:gap-4">
                            <span className="font-black text-base md:text-lg italic">{tool.label}</span>
                            <div className="w-8 h-8 md:w-10 md:h-10 text-brand-dark group-hover:text-brand-accent transition-colors">
                               {tool.icon}
                            </div>
                         </div>
                       </button>
                     );
                   })}
                </div>
                
                <p className="text-brand-muted text-[10px] md:text-[11px] font-bold italic text-center opacity-60">
                  הכלים נועדו לשימוש כחלק מתהליך הליווי ולא לשימוש עצמאי מלא.
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

interface LandingProps { onEnterTool: (view: string) => void; }

const Landing: React.FC<LandingProps> = ({ onEnterTool }) => {
  const expertiseData = [
    { title: 'פיתוח מנהיגות ומנהלים', desc: 'חיזוק יכולות המנהל ביום-יום הארגוני. עבודה משותפת על תוצאות עסקיות ואנושיות.', icon: <ExpertiseIcons.Leadership />, color: 'bg-brand-navy', impact: 'Growth' },
    { title: 'ליווי הנהלות וארגונים', desc: 'גיבוש צוות ההנהלה ליחידה מסונכרנת אחת. קביעת כללי משחק שעובדים בשטח.', icon: <ExpertiseIcons.Board />, color: 'bg-brand-accent', impact: 'Alignment' },
    { title: 'ייעוץ ארגוני מערכתי', desc: 'ליווי שינויים עמוקים והתאמת הארגון למציאות משתנה ולנסיבות השטח.', icon: <ExpertiseIcons.Organization />, color: 'bg-brand-gold', impact: 'Strategy' },
    { title: 'הקמת שותפויות וממשקים', desc: 'בניית ממשקי עבודה חזקים על בסיס מודל חמשת התנאים ואמון הדדי.', icon: <ExpertiseIcons.Partnership />, color: 'bg-brand-sage', impact: 'Trust' },
    { title: 'ניהול בעידן הטכנולוגי', desc: 'הטמעת כלי עבודה מתקדמים כחלק אינטגרלי מהניהול - לפנות זמן לאנשים.', icon: <ExpertiseIcons.Tech />, color: 'bg-brand-dark', impact: 'Efficiency' },
    { title: 'ייעוץ אישי (Coaching)', desc: 'ליווי אישי ודיסקרטי בצמתים קריטיים וחיזוק התפקוד הניהולי.', icon: <ExpertiseIcons.Coaching />, color: 'bg-brand-accent', impact: 'Leadership' }
  ];

  const MarqueeItem = () => (
    <div className="flex items-center gap-12 shrink-0">
      <span className="flex items-center gap-4">
        <span className="text-white font-black text-xl md:text-2xl tracking-tight">לפצח את ה-One Big Thing</span>
        <span className="w-1.5 h-1.5 bg-[#f26522] rounded-full"></span>
        <span className="text-[#f26522] font-black text-lg md:text-xl italic">הדור הבא של מימוש פוטנציאל והשפעה</span>
      </span>
      <span className="text-brand-accent/20 text-4xl font-black">/</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center pb-0 relative overflow-hidden bg-brand-beige">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <section className="w-full bg-brand-navy py-2 md:py-3 relative z-50 shadow-2xl border-b border-white/10 overflow-hidden backdrop-blur-md">
        <div className="flex items-center relative h-10 md:h-12">
          <div className="absolute left-6 z-[60] h-full flex items-center">
             <a href="http://obt.kilon-consulting.com/" target="_blank" rel="noopener noreferrer" className="bg-[#f26522] text-white px-4 py-2 md:px-6 md:py-2.5 font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg hover:bg-white hover:text-[#f26522] transition-all border border-white/20 whitespace-nowrap">פרטים נוספים ←</a>
          </div>
          <div className="flex-1 flex overflow-hidden group">
            <div className="flex animate-marquee hover:pause whitespace-nowrap pr-12"><MarqueeItem /><MarqueeItem /><MarqueeItem /></div>
            <div className="flex animate-marquee hover:pause whitespace-nowrap" aria-hidden="true"><MarqueeItem /><MarqueeItem /><MarqueeItem /></div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 relative z-10 pt-10 md:pt-20 space-y-12">
        <div className="text-center space-y-6 animate-fadeIn">
          <BrandLogo size="lg" />
          <div className="space-y-4 mt-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-kern leading-none tracking-tighter uppercase italic text-brand-navy">
              Simple <span className="text-brand-gold">Deep</span> Real
            </h1>
            <div className="h-1 w-20 bg-brand-gold mx-auto"></div>
            <p className="text-xl md:text-2xl text-brand-dark max-w-2xl mx-auto font-medium leading-tight italic px-4">
              "אני עוזר למנהלים למצוא את העיקר בתוך הרעש הארגוני."
            </p>
          </div>
        </div>

        <StrategicSandbox onNavigateToTool={onEnterTool} />

        <div className="space-y-12 pt-16">
          <div className="flex items-center gap-6 justify-between border-b-4 border-brand-navy pb-6">
             <div className="text-right">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent mb-1">Capabilities Matrix</h2>
                <h3 className="text-3xl md:text-4xl font-black italic text-brand-navy">תחומי התמחות.</h3>
             </div>
             <div className="hidden md:flex flex-col items-end">
                <div className="flex gap-1 mb-2">
                   {[1,2,3,4].map(i => <div key={i} className="w-3 h-0.5 bg-brand-gold"></div>)}
                </div>
                <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest opacity-60">Architectural Consulting Group</span>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {expertiseData.map((item, idx) => (
              <ExpertiseCard key={idx} index={idx} title={item.title} desc={item.desc} icon={item.icon} colorClass={item.color} impactTag={item.impact} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-10 text-center pt-10 pb-24">
           <div className="space-y-2">
              <h4 className="text-3xl md:text-4xl font-black italic tracking-tighter">מוכנים לביצוע?</h4>
              <p className="text-lg text-brand-muted font-bold italic max-w-xl mx-auto">כניסה ל"מעבדה" (The Lab) ליישום המומחיות בניהול היומיומי.</p>
           </div>
           <button onClick={() => onEnterTool('lab')} className="group bg-brand-navy text-white px-10 py-6 md:px-16 md:py-8 font-black text-xl md:text-2xl uppercase tracking-widest shadow-[10px_10px_0px_var(--brand-gold)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-6 border-4 border-brand-navy hover:bg-brand-gold hover:border-brand-gold">
              <span>כניסה למעבדה</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 group-hover:rotate-12 transition-transform">
                <path d="M10 2v7.5" /><path d="M14 2v7.5" /><path d="M14 9.5a5 5 0 1 1-4 0" /><path d="M5.5 16h13" />
              </svg>
            </button>
        </div>
      </section>

      <section className="w-full bg-white/40 pt-16 pb-10 border-t border-brand-dark/5 relative overflow-hidden">
         <div className="absolute top-6 left-6 text-[7px] font-mono text-brand-muted opacity-30 select-none uppercase tracking-widest leading-none">STRATEGIC_COORD: 43.12 / 32.55</div>
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="h-px flex-1 bg-brand-dark/5"></div>
               <div className="px-10 py-1 border-x-2 border-brand-gold">
                  <div className="flex gap-4">
                     {[1,2,3,4,5].map(i => <div key={i} className={`w-0.5 h-6 ${i%2 === 0 ? 'bg-brand-navy' : 'bg-brand-gold'}`}></div>)}
                  </div>
               </div>
               <div className="h-px flex-1 bg-brand-dark/5"></div>
            </div>
            <div className="mt-12 text-center space-y-2">
               <p className="text-[9px] font-black uppercase tracking-[0.6em] text-brand-muted opacity-50">Gilad Kilon • Management Excellence</p>
               <p className="text-[8px] font-bold text-brand-muted opacity-30 italic">© 2025 Architecture of Strategy.</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Landing;