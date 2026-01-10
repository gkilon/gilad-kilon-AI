
import { getLabRecommendation } from '../geminiService';
import React, { useState } from 'react';

// === לוגו מוטמע בפורמט Base64 ===
const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArMAAAFpCAYAAAKT...';

const ExpertiseIcons = {
  Leadership: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 21V3M12 3L7 8M12 3L17 8" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  Board: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="1" />
      <path d="M5 12H19M12 5V19" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
    </svg>
  ),
  Organization: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M2 20H22" stroke="currentColor" strokeWidth="1" />
      <path d="M6 20V8L12 4L18 8V20" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  Partnership: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="8" cy="12" r="5" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  Tech: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1" />
      <path d="M12 9V6M12 18V15" stroke="currentColor" strokeWidth="1" />
      <path d="M9 12H6M18 12H15" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  Coaching: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1" />
      <path d="M12 12L15 9" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
};

export const Icons = {
  WOOP: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" className="text-brand-accent" />
    </svg>
  ),
  TOWS: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <rect x="3" y="3" width="18" height="18" strokeOpacity="0.2" />
      <path d="M12 3v18M3 12h18" />
    </svg>
  ),
  Pulse: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" className="text-brand-accent" />
    </svg>
  ),
  Tasks: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M9 11l3 3L22 4" />
    </svg>
  ),
  Ideas: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2" />
    </svg>
  ),
  DNA: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M4 12c0 2 2 4 4 4s4-2 4-4" />
    </svg>
  ),
  Feedback: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path d="M12 16v.01" strokeWidth="2.5" />
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

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg', dark?: boolean, className?: string }> = ({ size = 'sm', dark = true, className }) => {
  const textColor = dark ? 'text-brand-dark' : 'text-white';
  const subTextColor = dark ? 'text-brand-muted' : 'text-white/80';

  // Define size configurations
  const config = {
    sm: {
      title: 'text-lg',
      sub: 'text-[7px]',
      dot: 'text-lg',
      gap: 'mr-1'
    },
    md: {
      title: 'text-2xl md:text-3xl',
      sub: 'text-[9px] md:text-[10px]',
      dot: 'text-2xl md:text-3xl',
      gap: 'mr-1.5'
    },
    lg: {
      title: 'text-4xl md:text-6xl',
      sub: 'text-xs md:text-sm',
      dot: 'text-4xl md:text-6xl',
      gap: 'mr-2'
    }
  };

  const current = config[size];
  const alignmentClass = className || 'items-start';

  return (
    <div className={`flex flex-col select-none group ${alignmentClass}`} dir="ltr">
      <div className={`flex items-baseline leading-none ${textColor} ${current.title} transition-colors`}>
        <span className={`font-light tracking-[0.1em] ${current.gap}`}>GILAD</span>
        <span className="font-black tracking-[0.05em]">KILON</span>
        <span className={`font-black text-brand-accent ${current.dot} leading-none ml-0.5`}>.</span>
      </div>
      <div className={`font-bold uppercase tracking-[0.35em] ${subTextColor} ${current.sub} mt-1.5 w-full transition-colors`}>
        Management Consulting
      </div>
    </div>
  );
};

export const ExpertiseCard: React.FC<{ title: string, desc: string, icon: React.ReactNode, index: number, impactTag: string }> = ({ title, desc, icon, index, impactTag }) => (
  <div className="arch-card p-8 md:p-10 flex flex-col justify-between h-full group relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-dark/0 via-brand-dark/0 to-brand-dark/0 group-hover:via-brand-touch/50 group-hover:to-brand-touch/0 transition-all duration-700"></div>

    <div className="flex justify-between items-start mb-8">
      <div className="text-brand-dark/80 w-8 h-8 group-hover:text-brand-touch transition-colors duration-300">
        {icon}
      </div>
      <span className="text-xs font-mono text-brand-touch/60 font-bold">{(index + 1).toString().padStart(2, '0')}</span>
    </div>

    <div className="space-y-4 text-right">
      <h4 className="text-xl font-bold text-brand-dark tracking-tight group-hover:text-brand-touch transition-colors duration-300">{title}</h4>
      <p className="text-sm text-brand-muted leading-relaxed font-light">{desc}</p>
    </div>

    <div className="mt-8 pt-6 border-t border-brand-dark/5 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity duration-300">
      <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">{impactTag}</span>
      <span className="text-brand-dark transform group-hover:translate-x-[-4px] transition-transform duration-300">→</span>
    </div>
  </div>
);

export const ToolEntry: React.FC<{
  title: string,
  desc: string,
  icon: React.ReactNode,
  onClick: () => void
}> = ({ title, desc, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-start w-full text-right border border-brand-dark/10 p-8 hover:border-brand-accent hover:shadow-lg transition-all group bg-white h-full relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-0 h-1 bg-brand-accent group-hover:w-full transition-all duration-500"></div>
    <div className="flex items-center justify-between w-full mb-6">
      <div className="w-10 h-10 text-brand-muted group-hover:text-brand-accent transition-colors p-1.5 border border-brand-dark/5 rounded-sm">
        {icon}
      </div>
      <span className="text-brand-dark/50 group-hover:text-brand-accent transform group-hover:-translate-x-1 transition-all">←</span>
    </div>
    <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-accent transition-colors">{title}</h3>
    <p className="text-sm text-brand-muted font-light leading-relaxed">{desc}</p>
  </button>
);

const StrategicSandbox: React.FC<{ onNavigateToTool: (view: string) => void }> = ({ onNavigateToTool }) => {
  const [input, setInput] = useState('');
  const [recommendation, setRecommendation] = useState<{ explanation: string, toolIds: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  // Updated presets to match new aesthetic
  const presets = ["ניהול קונפליקטים בהנהלה", "בניית תוכנית עבודה", "פיתוח מנהלים בכירים"];

  const handleConsult = async (text?: string) => {
    const val = text || input;
    if (!val.trim()) return;
    setLoading(true);
    setRecommendation(null);
    try {
      const res = await getLabRecommendation(val);
      setRecommendation({ explanation: res.explanation, toolIds: res.recommendedToolIds });
    } catch (e) {
      setRecommendation({ explanation: "בואו נתחיל מהכלים הבאים:", toolIds: ["executive", "dashboard"] });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-32 px-6 animate-slideUp">
      <div className="bg-white border border-brand-dark/10 shadow-2xl p-12 md:p-16 space-y-10 relative overflow-hidden">
        {/* Decorative Grid Background for Lab */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] pointer-events-none"></div>

        <div className="relative z-10 text-right space-y-2">
          <span className="text-[10px] font-bold text-brand-touch uppercase tracking-[0.3em] block mb-2">The Lab Navigator</span>
          <h3 className="text-3xl md:text-4xl font-light text-brand-dark tracking-tight">
            מה האתגר הניהולי שלך?
          </h3>
        </div>

        <div className="relative z-10">
          <div className="flex bg-brand-beige/50 border border-brand-dark/10 p-2 items-center transition-colors focus-within:border-brand-dark/30 focus-within:bg-white">
            <button
              onClick={() => handleConsult()}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-brand-touch text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="כתוב כאן..."
              className="flex-1 bg-transparent border-none outline-none px-4 text-right text-brand-dark font-medium placeholder:text-brand-muted/40"
              onKeyPress={e => e.key === 'Enter' && handleConsult()}
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2 mt-4">
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => { setInput(p); handleConsult(p); }}
                className="text-[10px] text-brand-muted hover:text-brand-dark border border-transparent hover:border-brand-dark/10 px-3 py-1 transition-all rounded-full bg-brand-beige/30"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {recommendation && (
          <div className="relative z-10 pt-8 border-t border-brand-dark/5 animate-fadeIn space-y-6">
            <p className="text-lg text-brand-dark/80 font-light leading-relaxed text-right border-r-2 border-brand-accent pr-4">{recommendation.explanation}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendation.toolIds.map(id => {
                const tool = toolCatalog[id];
                if (!tool) return null;
                return (
                  <button key={id} onClick={() => onNavigateToTool(tool.view)} className="group flex items-center justify-between p-4 border border-brand-dark/10 hover:border-brand-accent/50 bg-white hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 text-brand-muted group-hover:text-brand-accent transition-colors">
                      {tool.icon}
                    </div>
                    <span className="text-sm font-bold text-brand-dark group-hover:text-brand-accent transition-colors">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface LandingProps { onEnterTool: (view: string) => void; }

const Landing: React.FC<LandingProps> = ({ onEnterTool }) => {
  const expertiseData = [
    { title: 'פיתוח מנהלים בכירים', desc: 'בניית יכולות ניהול ליבה וחוסן אישי בצמתים קריטיים.', icon: <ExpertiseIcons.Leadership />, impact: 'צמיחה' },
    { title: 'סנכרון הנהלה ודירקטוריון', desc: 'יצירת שפה משותפת ומנגנוני קבלת החלטות אפקטיביים.', icon: <ExpertiseIcons.Board />, impact: 'סנכרון' },
    { title: 'עיצוב והבראת ארגונים', desc: 'התאמת המבנה הארגוני לאתגרי המחר ולגמישות עסקית.', icon: <ExpertiseIcons.Organization />, impact: 'אסטרטגיה' },
    { title: 'שותפויות אסטרטגיות', desc: 'בניית ממשקי עמון עמוקים בתוך ומחוץ לארגון.', icon: <ExpertiseIcons.Partnership />, impact: 'אמון' },
    { title: 'מינוף טכנולוגי', desc: 'חיבור חכם בין אנשים לכלים דיגיטליים לשיפור ביצועים.', icon: <ExpertiseIcons.Tech />, impact: 'יעילות' },
    { title: 'ליווי אישי למנכ"לים', desc: 'מרחב דיסקרטי להתייעצות וחשיבה בצמתים מורכבים.', icon: <ExpertiseIcons.Coaching />, impact: 'השפעה' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-beige text-brand-dark font-sans" dir="rtl">

      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none z-0"></div>

      {/* Sidebar Decoration (Desktop) */}
      <div className="hidden xl:flex fixed left-12 top-0 bottom-0 flex-col justify-center items-center z-50 pointer-events-none opacity-60">
        <div className="h-full w-px bg-brand-touch/30"></div>
        <span className="[writing-mode:vertical-rl] py-8 font-mono text-[9px] uppercase tracking-[0.3em] rotate-180 text-brand-touch">Strategic Architecture v2.0</span>
        <div className="h-full w-px bg-brand-touch/30"></div>
      </div>

      <main className="flex-1 relative z-10">

        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6 relative">
          <div className="absolute top-10 right-10 hidden sm:block">
            <span className="text-[10px] font-mono text-brand-muted uppercase tracking-widest block text-right">Consulting API</span>
            <span className="text-[10px] font-mono text-brand-muted uppercase tracking-widest block text-right">Est. 2018</span>
          </div>

          <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn flex flex-col items-center">

            {/* Central Brand Identity */}
            <div className="mb-4">
              <BrandLogo size="md" dark={true} className="items-center" />
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black leading-[0.9] tracking-tighter text-brand-dark select-none" dir="ltr">
              SIMPLE. <br className="md:hidden" />
              <span className="text-brand-muted">DEEP.</span> <br className="md:hidden" />
              REAL.
            </h1>

            <div className="h-px w-24 bg-brand-touch mx-auto"></div>

            <div dir="rtl">
              <p className="text-xl md:text-2xl font-light text-brand-dark/80 max-w-2xl mx-auto leading-relaxed">
                שותף לדרך שרץ איתך למרחקים ארוכים. <br className="hidden md:block" />
                <span className="font-bold text-brand-dark">מייצר בהירות, שקט ושליטה בתוך הרעש הארגוני.</span>
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center pt-8">
              <button
                onClick={() => onEnterTool('lab')}
                className="px-8 py-4 bg-brand-dark text-white min-w-[200px] text-sm font-bold uppercase tracking-[0.2em] hover:bg-brand-accent transition-colors shadow-xl"
              >
                Open Workspace
              </button>
              <a
                href="#expertise"
                className="px-8 py-4 border border-brand-dark/20 text-brand-dark min-w-[200px] text-sm font-bold uppercase tracking-[0.2em] hover:border-brand-dark transition-colors bg-white/50 backdrop-blur-sm"
              >
                Discover Methodology
              </a>
            </div>
          </div>
        </section>

        {/* Expertise Grid */}
        <section id="expertise" className="py-32 px-6 border-t border-brand-dark/5 bg-white/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 text-right">
              <div className="max-w-xl">
                <span className="text-[9px] font-bold text-brand-accent uppercase tracking-[0.25em] block mb-4">Our Expertise</span>
                <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tight leading-tight">
                  בניית תשתיות עומק<br />
                  <span className="text-brand-muted">לצמיחה עסקית.</span>
                </h2>
              </div>
              <div className="hidden md:block w-32 h-px bg-brand-dark/10 mb-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-dark/10 border border-brand-dark/10 shadow-sm overflow-hidden">
              {expertiseData.map((item, idx) => (
                <ExpertiseCard key={idx} index={idx} title={item.title} desc={item.desc} icon={item.icon} impactTag={item.impact} />
              ))}
            </div>
          </div>
        </section>

        {/* The Lab Interaction */}
        <section className="bg-brand-beige border-t border-brand-dark/5">
          <StrategicSandbox onNavigateToTool={onEnterTool} />
        </section>

        {/* Footer */}
        <footer className="bg-brand-dark text-white pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 border-b border-white/10 pb-16">
            <div className="text-center md:text-right">
              <BrandLogo size="md" dark={false} className="items-center md:items-end" />

            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <a href="mailto:gilad@kilon.org" className="text-2xl font-light hover:text-brand-gold transition-colors">gilad@kilon.org</a>
              <a href="tel:+972526417512" className="text-xl font-mono text-brand-muted hover:text-white transition-colors">052-6417512</a>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-white/30 gap-4">
            <p>&copy; 2025 ALL RIGHTS RESERVED.</p>
            <p>TLV / NYC / LND</p>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default Landing;
