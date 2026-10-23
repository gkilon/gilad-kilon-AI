import React from 'react';
import { motion } from 'framer-motion';
import { SmartSearchDark } from './SmartSearch';

interface LandingProps {
  onEnterTool: (view: string) => void;
}

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; dark?: boolean; className?: string }> = ({
  size = 'sm', dark = true, className = 'items-start'
}) => {
  const color = dark ? 'text-brand-dark' : 'text-white';
  const muted = dark ? 'text-brand-muted' : 'text-white/70';
  const sizes = {
    sm: { title: 'text-lg', sub: 'text-[7px]', tracking: 'tracking-[0.32em]' },
    md: { title: 'text-4xl md:text-6xl', sub: 'text-[10px] md:text-xs', tracking: 'tracking-[0.42em]' },
    lg: { title: 'text-5xl md:text-7xl', sub: 'text-xs md:text-sm', tracking: 'tracking-[0.42em]' }
  };
  const s = sizes[size];
  return <div className={`flex flex-col select-none ${className}`} dir="ltr">
    <div className={`flex items-baseline leading-none ${color} ${s.title}`}>
      <span className="font-light tracking-[0.08em] mr-1.5">GILAD</span>
      <span className="font-black tracking-[0.02em]">KILON</span>
      <span className="font-black text-brand-accent ml-0.5">.</span>
    </div>
    <div className={`font-bold uppercase ${s.tracking} ${muted} ${s.sub} mt-1.5`}>Management Consulting</div>
  </div>;
};

export const Icons = {
  WOOP: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 9 9" /><path d="M8 12h8M12 8v8" /></svg>,
  TOWS: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><rect x="3" y="3" width="18" height="18" /><path d="M12 3v18M3 12h18" /></svg>,
  Pulse: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M2 12h4l3-8 5 16 3-8h5" /></svg>,
  Tasks: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M9 11l3 3L22 4" /><path d="M20 12v7H4V4h11" /></svg>,
  Ideas: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><circle cx="12" cy="10" r="6" /><path d="M9 16v2h6v-2M10 21h4M12 2V1" /></svg>,
  DNA: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M7 3c0 6 10 12 10 18M17 3C17 9 7 15 7 21M8 7h8M6 12h12M8 17h8" /></svg>,
  Feedback: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" /></svg>
};

export const ToolEntry: React.FC<{ title: string; desc: string; icon: React.ReactNode; onClick: () => void }> = ({ title, desc, icon, onClick }) => (
  <motion.button onClick={onClick} whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}
    className="w-full text-right border border-brand-dark/10 bg-white p-6 hover:border-brand-accent transition-all group">
    <div className="w-9 h-9 text-brand-accent mb-5">{icon}</div>
    <h3 className="font-bold text-lg mb-2 group-hover:text-brand-accent transition-colors">{title}</h3>
    <p className="text-sm leading-relaxed text-brand-muted">{desc}</p>
  </motion.button>
);

export const ExpertiseCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; index: number; impactTag: string }> = ({ title, desc, icon, index, impactTag }) => (
  <div className="bg-white border border-brand-dark/10 p-7 md:p-8 h-full">
    <div className="flex items-start justify-between mb-8"><div className="w-10 h-10 text-brand-accent">{icon}</div><span className="text-xs text-brand-muted">{String(index + 1).padStart(2, '0')}</span></div>
    <h3 className="text-xl font-bold mb-3">{title}</h3><p className="text-brand-muted leading-relaxed text-sm">{desc}</p>
    <div className="mt-6 pt-4 border-t border-brand-dark/10 text-xs text-brand-accent font-bold">{impactTag}</div>
  </div>
);

const Arrow = () => <span aria-hidden="true" className="inline-block mr-2 transition-transform group-hover:-translate-x-1">←</span>;

const Landing: React.FC<LandingProps> = ({ onEnterTool }) => {
  const services = [
    { n: '01', title: 'פיתוח מנהלים', text: 'ללוות מנהלים בצמתים מקצועיים, לפתח את דרך הניהול שלהם ולחבר בין מה שהם רוצים להשיג לבין מה שהם עושים ביום יום.' },
    { n: '02', title: 'צוותי הנהלה', text: 'לעזור לצוותי הנהלה לגבש כיוון, לנהל שיחות חשובות, לקבל החלטות ולפעול כצוות גם כשיש חילוקי דעות.' },
    { n: '03', title: 'ממשקים ושותפויות', text: 'לשפר את העבודה בין מנהלים ויחידות, להבהיר אחריות וציפיות ולבנות שותפויות שמקדמות את העבודה.' },
    { n: '04', title: 'שינוי וייעוץ ארגוני', text: 'ללוות ארגונים בתקופות של צמיחה ושינוי, ולחבר בין המבנה והתהליכים לבין מה שאנשים צריכים כדי להצליח.' }
  ];
  const programs = [
    { title: 'פיתוח אישי שמגיע עד להתנהגות', tag: 'OBT · IMMUNITY TO CHANGE', text: 'תהליך מובנה שמחבר בין המטרה שרוצים להשיג לבין מה שעוצר אותנו בפועל, ועוזר להתקדם בצעדים מעשיים.', href: 'https://obt-360.kilon-consulting.com/' },
    { title: 'משוב שמייצר התפתחות', tag: 'פיתוח ארגוני', text: 'חלופה לתהליך הערכת ביצועים שמחזירה לעובד את האחריות להתפתחותו, ומשאירה למנהל ולארגון תפקיד תומך וברור.', href: 'mailto:gilad@kilon.co.il?subject=משוב%20שמייצר%20התפתחות' },
    { title: 'קוד הצבעים', tag: 'סדנה וכלי אישי', text: 'להבין איך אנשים שונים מתקשרים, מה מניע אותם ואיך להתאים את השיחה בלי לוותר על עצמנו.', href: 'mailto:gilad@kilon.co.il?subject=קוד%20הצבעים' },
    { title: 'מערכת ויחסים', tag: 'שותפויות ועבודת ממשקים', text: 'לעבוד על שני הדברים יחד: היחסים בין האנשים והמערכת שבה הם צריכים להצליח לעבוד יחד.', href: 'mailto:gilad@kilon.co.il?subject=מערכת%20ויחסים' }
  ];

  return <div className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl">
    <section className="relative overflow-hidden border-b border-brand-dark/10">
      <div className="absolute left-[-8rem] top-[-6rem] w-[28rem] h-[28rem] rounded-full border border-brand-accent/15 pointer-events-none" />
      <div className="absolute left-[-4rem] top-[-2rem] w-[20rem] h-[20rem] rounded-full border border-brand-touch/15 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 relative">
        <div className="max-w-4xl">
          <p className="text-xs md:text-sm font-bold tracking-[0.18em] text-brand-accent mb-7">ייעוץ ארגוני · פיתוח מנהלים · צוותי הנהלה</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-[1.13] tracking-tight max-w-4xl">
            יועץ ארגוני.
            <span className="block font-black mt-2">אדם של אנשים, חושב פשוט, רואה לעומק ומחובר לתוצאות.</span>
          </h1>
          <p className="text-lg md:text-2xl leading-relaxed text-brand-muted max-w-3xl mt-8">
            אני גלעד קילון. כבר יותר מעשרים שנה אני עובד עם מנהלים וארגונים על התפתחות, עבודת צוות, שותפויות ושינויים. אני מנסה להבין מה באמת קורה, לדבר על זה בגובה העיניים ולעזור להפוך הבנה לעבודה אחרת ולתוצאות.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-7 py-4 bg-brand-dark text-white font-bold hover:bg-brand-accent transition-colors">נדבר על האתגר שלך <Arrow /></a>
            <button onClick={() => onEnterTool('about')} className="inline-flex items-center justify-center px-7 py-4 border border-brand-dark/20 font-bold hover:border-brand-dark transition-colors">קצת עליי <Arrow /></button>
          </div>
          <div className="mt-12 pt-5 border-t border-brand-dark/10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-brand-muted">
            <span>20+ שנות ניסיון בייעוץ ארגוני</span><span>עבודה עם הנהלות ומנהלים</span><span>עומק מקצועי, בלי לאבד את הפרקטיקה</span>
          </div>
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
      <div className="grid md:grid-cols-[0.75fr_1.25fr] gap-10 md:gap-20">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-brand-accent mb-4">איך אני עובד</p>
          <h2 className="text-3xl md:text-5xl font-black leading-tight">לא מסתפקים במה שרואים על פני השטח.</h2>
        </div>
        <div className="space-y-6 text-lg md:text-xl leading-relaxed text-brand-muted">
          <p>לפעמים מגיעים בגלל מתח בין מנהלים או יחידות. במקרים אחרים, מנהל נכנס לתפקיד חדש, צוות הנהלה צריך להתגבש סביב כיוון, ארגון צומח וצריך להתאים את דרך העבודה, או שינוי חשוב מתקשה להפוך למציאות. בכל אחד מהמקרים כדאי להבין גם את האנשים וגם את התנאים שבהם הם פועלים.</p>
          <p>אני מנסה להבין מה קורה בפועל, מה אנשים אומרים ומה נשאר בין השורות. משם אפשר להחליט מה צריך להשתנות, לנהל את השיחות הנדרשות ולבנות דרך פעולה שאפשר ליישם.</p>
          <p className="text-brand-dark font-bold">לדבר בכנות וברגישות, להבין לעומק ולעשות עם זה משהו.</p>
        </div>
      </div>
    </section>

    <section className="bg-white border-y border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold tracking-[0.18em] text-brand-accent mb-4">איפה אנחנו יכולים לעבוד יחד</p>
          <h2 className="text-3xl md:text-5xl font-black leading-tight">האתגרים משתנים. השאלה היא מה צריך להשתנות כדי להתקדם.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map(s => <article key={s.n} className="border border-brand-dark/10 p-6 md:p-7 bg-brand-beige/50">
            <div className="text-xs text-brand-accent font-bold mb-8">{s.n}</div><h3 className="text-xl font-bold mb-4">{s.title}</h3><p className="text-sm md:text-base leading-relaxed text-brand-muted">{s.text}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-3xl"><p className="text-xs font-bold tracking-[0.18em] text-brand-accent mb-4">תהליכים וכלים שפיתחתי</p><h2 className="text-3xl md:text-5xl font-black leading-tight">כלים שמתחברים לעבודה בשטח.</h2></div>
        <p className="text-brand-muted leading-relaxed max-w-md">פיתחתי את הכלים האלה מתוך העבודה עם מנהלים וארגונים. הם נועדו לעזור לאנשים לחשוב, לדבר ולעבוד אחרת, גם אחרי שהמפגש מסתיים.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {programs.map((p, i) => <a key={p.title} href={p.href} target={p.href.startsWith('http') ? '_blank' : undefined} rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="group border border-brand-dark/10 bg-white p-7 md:p-9 hover:border-brand-accent transition-colors">
          <p className="text-[11px] font-bold tracking-[0.14em] text-brand-accent mb-5">{p.tag}</p><div className="flex gap-6 items-start"><span className="text-sm text-brand-muted mt-1">0{i + 1}</span><div><h3 className="text-2xl font-bold mb-3 group-hover:text-brand-accent transition-colors">{p.title}</h3><p className="text-brand-muted leading-relaxed">{p.text}</p><span className="inline-block mt-6 text-sm font-bold">לשיחה על התהליך <Arrow /></span></div></div>
        </a>)}
      </div>
    </section>

    <section className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 grid md:grid-cols-[1fr_0.8fr] gap-12 items-center">
        <div><p className="text-xs font-bold tracking-[0.18em] text-brand-touch mb-4">קצת עליי</p><h2 className="text-3xl md:text-5xl font-black leading-tight">קודם מבינים מה קורה. אחר כך מחליטים מה עושים.</h2><p className="text-white/70 text-lg leading-relaxed mt-6 max-w-2xl">יותר מעשרים שנה אני עובד עם מנהלים, צוותי הנהלה וארגונים. אני מסתכל על האנשים ועל המערכת שבה הם עובדים, ושואל מה יעזור להם להתפתח, לעבוד יחד ולהגיע לתוצאות. חשוב לי להבין לעומק, לדבר פשוט ולחבר את השיחה למה שקורה בפועל.</p><button onClick={() => onEnterTool('about')} className="mt-8 border border-white/30 px-6 py-3 font-bold hover:bg-white hover:text-brand-dark transition-colors">הסיפור שלי <Arrow /></button></div>
        <div className="border-r-2 border-brand-touch pr-7 md:pr-10 space-y-5 text-lg leading-relaxed text-white/80"><p>שותף לדרך, לא ספק.</p><p>קשוב למה שקורה, ומוכן לשנות כיוון כשצריך.</p><p>מחבר בין אנשים, תהליכים ותוצאות.</p></div>
      </div>
    </section>

    <section className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-16 items-center">
        <div><p className="text-xs font-bold tracking-[0.18em] text-brand-touch mb-4">אפשר להתחיל משיחה</p><h2 className="text-3xl md:text-5xl font-black leading-tight">מה אתם רוצים לקדם?</h2><p className="mt-5 text-lg text-white/65 leading-relaxed">אפשר להתחיל משאלה, מיעד או ממשהו שצריך להשתנות. נחשוב יחד מה הצעד הנכון.</p><a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="inline-flex mt-8 px-7 py-4 bg-brand-touch text-white font-bold hover:bg-white hover:text-brand-dark transition-colors">לתיאום שיחה <Arrow /></a></div>
        <div><p className="text-xs font-bold tracking-[0.14em] text-white/45 mb-4">או לתאר את האתגר ולקבל כיוון ראשוני</p><SmartSearchDark /></div>
      </div>
    </section>
    <footer className="border-t border-brand-dark/10 px-6 py-8"><div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-brand-muted"><BrandLogo /><span>גלעד קילון · ייעוץ ארגוני ופיתוח מנהלים</span><a href="mailto:gilad@kilon.co.il" className="hover:text-brand-accent">gilad@kilon.co.il</a></div></footer>
  </div>;
};

export default Landing;
