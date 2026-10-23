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
    { n: '01', title: 'פיתוח מנהלים', text: 'לעזור למנהלים להרחיב את טווח הפעולה שלהם, להתמודד עם צמתים מורכבים ולתרגם תובנות לשינוי בהתנהלות.' },
    { n: '02', title: 'צוותי הנהלה', text: 'לבנות צוות הנהלה שהוא יותר מאוסף של מנהלים טובים: צוות שמסוגל לדבר על הדברים החשובים, לקבל החלטות ולעבוד יחד.' },
    { n: '03', title: 'ממשקים ושותפויות', text: 'לפתוח מתחים, אי-הבנות ומאבקי אחריות בין יחידות — ולבנות דרך עבודה שמאפשרת לאנשים להצליח יחד.' },
    { n: '04', title: 'שינוי וייעוץ ארגוני', text: 'להבין מה במבנה, בתהליכים, בתפקידים ובציפיות מקשה על הארגון להתקדם, ולבנות שינוי שאפשר לחיות איתו.' }
  ];
  const programs = [
    { title: 'פיתוח אישי שמגיע עד להתנהגות', tag: 'OBT · IMMUNITY TO CHANGE', text: 'תהליך מובנה שעוזר לזהות לא רק מה רוצים לשנות, אלא גם מה עוצר אותנו בפועל — ולתרגל שינוי בהדרגה.', href: 'https://obt.kilon-consulting.com/' },
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
            לפעמים הבעיה היא לא האנשים.
            <span className="block font-black mt-2">היא גם הדרך שבה הם נדרשים לעבוד יחד.</span>
          </h1>
          <p className="text-lg md:text-2xl leading-relaxed text-brand-muted max-w-3xl mt-8">
            אני גלעד קילון. אני עוזר למנהלים, לצוותי הנהלה ולארגונים לפתוח את מה שלא עובד — ביחסים, בתקשורת ובתהליכי העבודה — כדי לבנות משהו שכן עובד.
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
          <p>כשיש חיכוך בין מנהלים או יחידות, קל להחליט שזו בעיה של אופי, תקשורת או חוסר שיתוף פעולה. לפעמים זה חלק מהסיפור. אבל לא פעם, גם המבנה, חלוקת האחריות, התהליכים והציפיות מייצרים את החיכוך.</p>
          <p>אני נכנס לתמונה כדי להבין מה באמת קורה — גם את מה שנאמר וגם את מה שכולם מרגישים אבל לא אומרים. משם אפשר לנהל שיחה ישירה, להגדיר מחדש את דרך העבודה ולייצר שינוי שמחזיק מעבר לסדנה או לפגישה.</p>
          <p className="text-brand-dark font-bold">אמת פשוטה, אבל אמפתית. עומק, שמוביל למעשה.</p>
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
        <div className="max-w-3xl"><p className="text-xs font-bold tracking-[0.18em] text-brand-accent mb-4">תהליכים וכלים שפיתחתי</p><h2 className="text-3xl md:text-5xl font-black leading-tight">לא עוד כלי בפני עצמו. דרך לעבוד על שינוי.</h2></div>
        <p className="text-brand-muted leading-relaxed max-w-md">הכלים נולדו מתוך העבודה הארגונית. הם עוזרים להפוך שיחה לתהליך, ותובנה לצעד שאפשר ליישם.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {programs.map((p, i) => <a key={p.title} href={p.href} target={p.href.startsWith('http') ? '_blank' : undefined} rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="group border border-brand-dark/10 bg-white p-7 md:p-9 hover:border-brand-accent transition-colors">
          <p className="text-[11px] font-bold tracking-[0.14em] text-brand-accent mb-5">{p.tag}</p><div className="flex gap-6 items-start"><span className="text-sm text-brand-muted mt-1">0{i + 1}</span><div><h3 className="text-2xl font-bold mb-3 group-hover:text-brand-accent transition-colors">{p.title}</h3><p className="text-brand-muted leading-relaxed">{p.text}</p><span className="inline-block mt-6 text-sm font-bold">לשיחה על התהליך <Arrow /></span></div></div>
        </a>)}
      </div>
    </section>

    <section className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 grid md:grid-cols-[1fr_0.8fr] gap-12 items-center">
        <div><p className="text-xs font-bold tracking-[0.18em] text-brand-touch mb-4">קצת עליי</p><h2 className="text-3xl md:text-5xl font-black leading-tight">אני לא מגיע עם תשובה מוכנה. אני מגיע כדי להבין איתכם מה באמת צריך לקרות.</h2><p className="text-white/70 text-lg leading-relaxed mt-6 max-w-2xl">יותר מעשרים שנה אני עובד עם ארגונים, מנהלים וצוותי הנהלה. אני מביא חשיבה מערכתית, סקרנות לאנשים ואומץ לפתוח שיחות שלא תמיד קל לנהל — בלי לשכוח שבסוף צריך לעבוד אחרת, לא רק להבין יותר.</p><button onClick={() => onEnterTool('about')} className="mt-8 border border-white/30 px-6 py-3 font-bold hover:bg-white hover:text-brand-dark transition-colors">הסיפור שלי <Arrow /></button></div>
        <div className="border-r-2 border-brand-touch pr-7 md:pr-10 space-y-5 text-lg leading-relaxed text-white/80"><p>שותף לדרך, לא ספק.</p><p>קשוב למה שקורה, לא תקוע בתוכנית.</p><p>מחבר בין אנשים, תהליכים ותוצאות.</p></div>
      </div>
    </section>

    <section className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-16 items-center">
        <div><p className="text-xs font-bold tracking-[0.18em] text-brand-touch mb-4">אפשר להתחיל משיחה</p><h2 className="text-3xl md:text-5xl font-black leading-tight">מה לא עובד אצלכם כרגע?</h2><p className="mt-5 text-lg text-white/65 leading-relaxed">לא צריך להגיע עם אבחון או עם פתרון. נתחיל ממה שקורה בשטח ונבדוק יחד מה יכול לעזור.</p><a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="inline-flex mt-8 px-7 py-4 bg-brand-touch text-white font-bold hover:bg-white hover:text-brand-dark transition-colors">לתיאום שיחה <Arrow /></a></div>
        <div><p className="text-xs font-bold tracking-[0.14em] text-white/45 mb-4">או לתאר את האתגר ולקבל כיוון ראשוני</p><SmartSearchDark /></div>
      </div>
    </section>
    <footer className="border-t border-brand-dark/10 px-6 py-8"><div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-brand-muted"><BrandLogo /><span>גלעד קילון · ייעוץ ארגוני ופיתוח מנהלים</span><a href="mailto:gilad@kilon.co.il" className="hover:text-brand-accent">gilad@kilon.co.il</a></div></footer>
  </div>;
};

export default Landing;
