
import { SmartSearch, SmartSearchDark } from './SmartSearch';
import React from 'react';
import { motion } from 'framer-motion';
import { TextReveal } from './motion/TextReveal';
import { FadeIn } from './motion/FadeIn';
import { StaggerContainer, StaggerItem } from './motion/StaggerContainer';
import { ColorOrbs } from './motion/ColorOrbs';
import { CursorTrail } from './motion/CursorTrail';
import { motionTokens } from '../motion/config';
import { CARD_ACCENTS } from '../motion/colors';


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

export const ExpertiseCard: React.FC<{ title: string, desc: string, icon: React.ReactNode, index: number, impactTag: string }> = ({ title, desc, icon, index, impactTag }) => {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  return (
  <motion.div
    className={`arch-card p-8 md:p-10 flex flex-col justify-between h-full group relative overflow-hidden ${accent.glow}`}
    whileHover={{
      y: -12,
      scale: 1.03,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      transition: { duration: 0.4, ease: motionTokens.easing.sharp },
    }}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, ease: motionTokens.easing.sharp }}
  >
    <motion.div
      className={`absolute top-0 right-0 w-1.5 h-0 ${accent.bar} group-hover:h-full`}
      transition={{ duration: 0.5, ease: motionTokens.easing.sharp }}
    />
    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-current ${accent.text} transition-all duration-700 opacity-80`} />
    
    {/* Premium gradient overlay on hover */}
    <motion.div 
      className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      initial={false}
    />
    
    {/* Radial glow effect */}
    <motion.div 
      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
      style={{ 
        background: `radial-gradient(circle at 50% 0%, ${accent.text.replace('text-', '')}20 0%, transparent 60%)` 
      }}
      initial={false}
    />

    <div className="flex justify-between items-start mb-8 relative z-10">
      <motion.div
        className={`w-12 h-12 ${accent.text} opacity-90 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm`}
        whileHover={{ rotate: [0, -15, 15, 0], scale: 1.15 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <span className={`text-sm font-mono font-bold ${accent.text} opacity-70 group-hover:opacity-100 transition-opacity duration-300 bg-white/50 px-2 py-1 rounded`}>{(index + 1).toString().padStart(2, '0')}</span>
    </div>

    <div className="space-y-4 text-right relative z-10">
      <h4 className={`text-2xl font-bold text-brand-dark tracking-tight transition-colors duration-300 ${accent.titleHover}`}>{title}</h4>
      <p className="text-sm text-brand-muted leading-relaxed font-light group-hover:text-brand-dark/80 transition-colors duration-300">{desc}</p>
    </div>

    <div className="mt-8 pt-6 border-t border-brand-dark/10 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
      <span className={`text-[11px] uppercase tracking-widest font-bold px-3 py-1.5 border ${accent.tag} group-hover:scale-105 transition-transform duration-300 rounded-sm shadow-sm`}>{impactTag}</span>
      <motion.span
        className={`${accent.text} opacity-0 group-hover:opacity-100 text-xl`}
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        →
      </motion.span>
    </div>
  </motion.div>
  );
};

export const ToolEntry: React.FC<{
  title: string,
  desc: string,
  icon: React.ReactNode,
  onClick: () => void
}> = ({ title, desc, icon, onClick }) => (
  <motion.button
    onClick={onClick}
    className="flex flex-col items-start w-full text-right border-2 border-brand-dark/10 p-8 hover:border-brand-accent hover:shadow-2xl transition-all group bg-white h-full relative overflow-hidden"
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.3, ease: motionTokens.easing.sharp }}
  >
    <div className="absolute top-0 right-0 w-0 h-1.5 bg-gradient-to-l from-brand-accent to-brand-touch group-hover:w-full transition-all duration-500"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 via-transparent to-brand-touch/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(96, 125, 139, 0.15) 0%, transparent 70%)' }}></div>
    
    <div className="flex items-center justify-between w-full mb-6 relative z-10">
      <motion.div 
        className="w-12 h-12 text-brand-muted group-hover:text-brand-accent transition-colors p-2 border border-brand-dark/10 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm group-hover:shadow-md"
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
        transition={{ duration: 0.4 }}
      >
        {icon}
      </motion.div>
      <motion.span 
        className="text-brand-dark/50 group-hover:text-brand-accent transition-all text-xl"
        whileHover={{ x: -6 }}
      >
        ←
      </motion.span>
    </div>
    <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-accent transition-colors relative z-10">{title}</h3>
    <p className="text-sm text-brand-muted font-light leading-relaxed group-hover:text-brand-dark/80 transition-colors relative z-10">{desc}</p>
  </motion.button>
);

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

      {/* Cursor Trail Effect */}
      <CursorTrail />

      {/* Continuous Growth Animation */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Growing organic shapes - continuous expansion */}
        <motion.div
          className="absolute bottom-[10%] left-[15%] border-4 border-brand-accent/30 rounded-full"
          style={{ width: 300, height: 300 }}
          animate={{
            scale: [1, 2.5, 1],
            opacity: [0.2, 0.6, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <motion.div
          className="absolute bottom-[15%] left-[20%] border-3 border-brand-touch/30 rounded-full"
          style={{ width: 200, height: 200 }}
          animate={{
            scale: [0.8, 2.2, 0.8],
            opacity: [0.15, 0.5, 0.15],
            rotate: [0, -120, -240]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <motion.div
          className="absolute bottom-[20%] left-[25%] border-2 border-brand-gold/30 rounded-full"
          style={{ width: 150, height: 150 }}
          animate={{
            scale: [0.6, 2, 0.6],
            opacity: [0.1, 0.45, 0.1],
            rotate: [0, 90, 180]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* New circles that appear and grow */}
        <motion.div
          className="absolute bottom-[25%] right-[15%] border-2 border-brand-accent/25 rounded-full"
          style={{ width: 100, height: 100 }}
          animate={{
            scale: [0, 1.8, 0],
            opacity: [0, 0.4, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute bottom-[30%] right-[25%] border-2 border-brand-touch/25 rounded-full"
          style={{ width: 80, height: 80 }}
          animate={{
            scale: [0, 1.6, 0],
            opacity: [0, 0.35, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        
        {/* Right-top animated square */}
        <motion.div
          className="absolute top-[10%] right-[10%] border-2 border-brand-accent/30"
          style={{ width: 80, height: 80 }}
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 45, 90, 135, 180],
            opacity: [0.2, 0.5, 0.3, 0.5, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Connecting lines that grow outward */}
        <motion.div
          className="absolute top-[30%] left-[30%] h-[1px] bg-brand-dark/10"
          animate={{
            width: [0, 400, 0],
            opacity: [0, 0.3, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[40%] right-[30%] h-[1px] bg-brand-dark/10"
          animate={{
            width: [0, 300, 0],
            opacity: [0, 0.25, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-[50%] left-[25%] h-[1px] bg-brand-dark/10"
          animate={{
            width: [0, 350, 0],
            opacity: [0, 0.28, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        
        {/* Small dots that move upward continuously */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-brand-accent/40 rounded-full"
            style={{
              left: `${15 + i * 7}%`,
              bottom: '5%',
            }}
            animate={{
              y: [0, -100 - (i * 20), 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5
            }}
          />
        ))}
        
        {/* Gentle gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-brand-beige via-transparent to-brand-beige"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Background Grid — breathing pulse */}
      <motion.div
        className="fixed inset-0 bg-grid-pattern pointer-events-none z-[1]"
        animate={{ opacity: [0.25, 0.42, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating color orbs — hero ambient */}
      <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
        <ColorOrbs variant="light" />
      </div>

      {/* Sidebar Decoration (Desktop) */}
      <div className="hidden xl:flex fixed left-12 top-0 bottom-0 flex-col justify-center items-center z-50 pointer-events-none opacity-60">
        <div className="h-full w-px bg-brand-touch/30"></div>
        <span className="[writing-mode:vertical-rl] py-8 font-mono text-[9px] uppercase tracking-[0.3em] rotate-180 text-brand-touch">Strategic Architecture v2.0</span>
        <div className="h-full w-px bg-brand-touch/30"></div>
      </div>

      <main className="flex-1 relative z-10">

        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
          {/* Dramatic gradient background overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-brand-touch/5 via-transparent to-brand-accent/5 opacity-60"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ backgroundSize: '200% 200%' }}
          />
          
          {/* Decorative floating lines - enhanced */}
          <motion.div
            className="absolute top-1/4 left-[5%] w-24 h-0.5 bg-gradient-to-r from-transparent via-brand-touch to-transparent hidden lg:block"
            animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.2, 0.8, 0.2], x: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/3 right-[8%] w-32 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent hidden lg:block"
            animate={{ scaleX: [1, 0.3, 1], opacity: [0.3, 0.9, 0.3], x: [0, -30, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute top-[20%] right-[12%] w-4 h-4 border-2 border-brand-accent hidden md:block rounded-sm"
            animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.3, 1], borderColor: ['#607d8b', '#f26522', '#c5a065', '#607d8b'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Additional floating elements */}
          <motion.div
            className="absolute top-[35%] left-[15%] w-2 h-2 bg-brand-touch/40 rounded-full hidden lg:block"
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[25%] right-[20%] w-3 h-3 bg-brand-gold/30 rounded-full hidden lg:block"
            animate={{ y: [0, 25, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          <div className="absolute top-10 right-10 hidden sm:block">
            <motion.div
              className="text-right"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.span
                className="text-[10px] font-mono text-brand-touch uppercase tracking-widest block"
                animate={{ letterSpacing: ['0.3em', '0.35em', '0.3em'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Consulting API
              </motion.span>
              <span className="text-[10px] font-mono text-brand-muted uppercase tracking-widest block">Est. 2018</span>
            </motion.div>
          </div>

          <div className="space-y-8 max-w-5xl mx-auto flex flex-col items-center relative z-10">

            {/* Central Brand Identity */}
            <FadeIn delay={0.1}>
              <motion.div 
                className="mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <BrandLogo size="md" dark={true} className="items-center" />
              </motion.div>
            </FadeIn>

            <h1 className="text-6xl md:text-8xl lg:text-[90px] font-black leading-[0.9] tracking-tighter text-brand-dark select-none text-center" dir="ltr">
              <TextReveal text="SIMPLE." as="span" className="block" delay={0.2} />
              <TextReveal text="DEEP." as="span" className="block text-brand-muted" delay={0.5} />
              <TextReveal text="REAL." as="span" className="block" delay={0.8} />
            </h1>

            <motion.div
              className="h-0.5 bg-gradient-to-r from-transparent via-brand-touch to-transparent mx-auto"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 120, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1, ease: motionTokens.easing.sharp }}
            />

            <FadeIn delay={1.2} className="w-full" direction="none">
              <div dir="rtl">
                <p className="text-xl md:text-2xl font-light text-brand-dark/80 max-w-2xl mx-auto leading-relaxed">
                  שותף לדרך שרץ איתך למרחקים ארוכים. <br className="hidden md:block" />
                  <span className="font-bold text-brand-dark">מייצר בהירות, שקט ושליטה בתוך הרעש הארגוני.</span>
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={1.4} className="w-full" direction="none">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center pt-8">
                <motion.button
                  onClick={() => onEnterTool('lab')}
                  className="px-10 py-4 bg-brand-dark text-white min-w-[220px] text-sm font-bold uppercase tracking-[0.2em] hover:bg-brand-accent transition-all shadow-xl hover:shadow-2xl hover:shadow-brand-accent/20"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Open Workspace
                </motion.button>
                <motion.a
                  href="#expertise"
                  className="px-10 py-4 border-2 border-brand-dark/30 text-brand-dark min-w-[220px] text-sm font-bold uppercase tracking-[0.2em] hover:border-brand-dark hover:bg-white/80 transition-all backdrop-blur-md text-center"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Discover Methodology
                </motion.a>
              </div>
            </FadeIn>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 12, 0] }}
              transition={{
                opacity: { delay: 2, duration: 0.6 },
                y: { delay: 2, duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-brand-muted">Scroll</span>
              <div className="w-px h-10 bg-gradient-to-b from-brand-touch to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* Expertise Grid */}
        <section id="expertise" className="py-32 px-6 border-t border-brand-dark/5 bg-white/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-end mb-20 text-right w-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: motionTokens.easing.sharp }}
            >
              <div className="max-w-xl">
                <motion.span 
                  className="text-[9px] font-bold text-brand-accent uppercase tracking-[0.25em] block mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Our Expertise
                </motion.span>
                <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tight leading-tight">
                  בניית תשתיות עומק<br />
                  <span className="text-brand-muted">לצמיחה עסקית.</span>
                </h2>
              </div>
              <motion.div 
                className="hidden md:block w-32 h-px bg-brand-dark/10 mb-4"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-dark/10 border border-brand-dark/10 shadow-sm overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              {expertiseData.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: motionTokens.easing.sharp }}
                >
                  <ExpertiseCard index={idx} title={item.title} desc={item.desc} icon={item.icon} impactTag={item.impact} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===== SMART SEARCH — Primary Feature ===== */}
        <section className="relative bg-brand-dark overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] pointer-events-none" style={{backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)'}}></div>

          {/* Accent glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-brand-touch to-transparent opacity-60"></div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
            <FadeIn direction="none">
              <span className="inline-block text-[10px] font-bold text-brand-touch uppercase tracking-[0.35em] mb-6">AI Solution Architect</span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter mb-6">
                מה האתגר<br />
                <span className="text-brand-muted font-light">שלך עכשיו?</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2} direction="none">
              <p className="text-white/50 font-light text-lg mb-12 max-w-xl mx-auto">תאר במילים שלך — ואגזור לך את הפתרון המדויק</p>
            </FadeIn>

            {/* Inline SmartSearch with dark theme */}
            <FadeIn delay={0.3} direction="none">
              <div className="max-w-2xl mx-auto">
                <SmartSearchDark />
              </div>
            </FadeIn>
          </div>
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
