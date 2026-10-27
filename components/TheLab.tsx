import React from 'react';

interface TheLabProps {
  onEnterTool: (view: string) => void;
  onBack?: () => void;
  isLoggedIn: boolean;
}

const PreviewPlaceholder: React.FC<{ label: string }> = ({ label }) => (
  <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-sm border border-white/15 bg-[#182c34] p-5 sm:min-h-[260px] sm:p-7">
    <div aria-hidden="true" className="absolute -left-10 -top-12 h-48 w-48 rounded-full border border-[#d5b46a]/35" />
    <div aria-hidden="true" className="absolute -left-1 top-8 h-32 w-32 rounded-full border border-white/10" />
    <div className="relative flex items-center justify-between gap-3">
      <span className="text-xs font-semibold tracking-wide text-white/60">תצוגת תוצר</span>
      <span className="h-2 w-2 rounded-full bg-[#d5b46a]" />
    </div>
    <div className="relative max-w-xs py-8">
      <div className="mb-3 h-2 w-20 rounded bg-white/20" />
      <div className="mb-2 h-3 w-full rounded bg-white/10" />
      <div className="mb-2 h-3 w-4/5 rounded bg-white/10" />
      <div className="h-3 w-3/5 rounded bg-white/10" />
    </div>
    <div className="relative border-t border-white/10 pt-4 text-sm text-white/65">{label}</div>
  </div>
);

const TheLab: React.FC<TheLabProps> = ({ onEnterTool, onBack, isLoggedIn }) => {
  return (
    <main className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl">
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
          <div className="absolute -left-28 -top-40 h-[32rem] w-[32rem] rounded-full border border-white/10" />
          <div className="absolute -left-12 -top-24 h-[22rem] w-[22rem] rounded-full border border-brand-gold/30" />
          <div className="absolute bottom-[-10rem] right-[40%] h-[26rem] w-[26rem] rounded-full bg-brand-accent/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-20">
          {onBack && (
            <button onClick={onBack} className="mb-12 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
              <span aria-hidden="true">→</span> חזרה לאתר
            </button>
          )}
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-bold tracking-wide text-brand-gold">המעבדה · ייעוץ, מתודולוגיה וטכנולוגיה</p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-7xl">
              לא עוד AI שמייצר תשובות.
              <span className="mt-2 block text-brand-gold">כלים שעוזרים לעבוד אחרת.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">
              אני מפתח ומשלב כלי AI מתוך העבודה שלי עם מנהלים וארגונים. המטרה היא לא להוסיף טכנולוגיה לשם הטכנולוגיה, אלא למצוא דרכים טובות יותר להתמודד עם שאלות ניהוליות, לזהות כיווני התפתחות ולהפוך תובנות לעבודה מעשית.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#selected-tools" className="inline-flex items-center justify-center bg-brand-touch px-6 py-4 font-bold text-white transition-colors hover:bg-brand-gold hover:text-brand-dark">
                לראות דוגמאות <span aria-hidden="true" className="mr-2">↓</span>
              </a>
              <a href="#guided-work" className="inline-flex items-center justify-center border border-white/25 px-6 py-4 font-bold text-white transition-colors hover:bg-white hover:text-brand-dark">
                כלים בתוך תהליך מקצועי
              </a>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-sm text-white/55">
            <span>הבנה ארגונית לפני בחירת הטכנולוגיה</span>
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-brand-gold sm:block" />
            <span>מתודולוגיה לפני אוטומציה</span>
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-brand-gold sm:block" />
            <span>כלים שמשרתים את העבודה</span>
          </div>
        </div>
      </section>

      <section id="selected-tools" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-10 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-16">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-brand-accent">דוגמאות נבחרות</p>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">מהרעיון לכלי שאפשר לעבוד איתו.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-brand-muted">
            במקום רשימה ארוכה של אפליקציות, נציג כאן כמה דוגמאות שממחישות את החיבור בין שאלה מקצועית, דרך עבודה וכלי טכנולוגי. בהמשך נוסיף לכל דוגמה תוצר אמיתי מתוך הכלי.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="overflow-hidden border border-brand-dark/10 bg-white">
            <PreviewPlaceholder label="מקום לצילום מסך אמיתי של תוצר מתוך הכלי" />
            <div className="p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="bg-brand-beige px-3 py-1 text-xs font-bold text-brand-dark">התנסות עצמאית</span>
                <span className="text-xs text-brand-muted">תקשורת ועבודה עם אנשים</span>
              </div>
              <h3 className="text-2xl font-bold">סגנונות תקשורת</h3>
              <p className="mt-3 leading-relaxed text-brand-muted">
                כלי עזר להבנת הבדלים בסגנונות תקשורת ולחשיבה על האופן שבו אפשר להתאים את הדרך שבה פונים לאנשים שונים. הוא נועד לפתוח אפשרויות לשיחה ולעבודה משותפת — לא לאבחן אנשים.
              </p>
              <a href="https://communication.kilon-consulting.com/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center font-bold text-brand-accent transition-colors hover:text-brand-dark">
                לפתיחת הכלי <span aria-hidden="true" className="mr-2">↗</span>
              </a>
            </div>
          </article>

          <article className="overflow-hidden border border-brand-dark/10 bg-white">
            <PreviewPlaceholder label="מקום לצילום מסך אמיתי של תוצר מתוך הכלי" />
            <div className="p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="bg-brand-beige px-3 py-1 text-xs font-bold text-brand-dark">חלק מתהליך מקצועי</span>
                <span className="text-xs text-brand-muted">התפתחות אישית וניהולית</span>
              </div>
              <h3 className="text-2xl font-bold">זיהוי מטרות התפתחותיות — OBT</h3>
              <p className="mt-3 leading-relaxed text-brand-muted">
                שימוש בתשובות ובנקודות מבט שונות כדי לזהות כיוונים אפשריים להתפתחות. הכלי תומך בתהליך מקצועי; הוא אינו מחליף את החשיבה, השיחה והעבודה שמעניקות לתובנות משמעות.
              </p>
              <a href="https://obt-360.kilon-consulting.com/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center font-bold text-brand-accent transition-colors hover:text-brand-dark">
                להיכרות עם הכלי <span aria-hidden="true" className="mr-2">↗</span>
              </a>
            </div>
          </article>

          <article className="overflow-hidden border border-brand-dark/10 bg-white">
            <PreviewPlaceholder label="מקום לצילום מסך אמיתי של תוצר מתוך הכלי" />
            <div className="p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="bg-brand-beige px-3 py-1 text-xs font-bold text-brand-dark">כלי לעבודה עם שותפויות</span>
                <span className="text-xs text-brand-muted">ממשקים ושיתוף פעולה</span>
              </div>
              <h3 className="text-2xl font-bold">ניהול שותפויות</h3>
              <p className="mt-3 leading-relaxed text-brand-muted">
                כלי מבוסס AI לתמיכה בבחינת שותפויות ובחשיבה על איכות העבודה המשותפת. הוא מסייע להתבונן במה שקורה בממשק בין אנשים או קבוצות, ולזהות נושאים שכדאי לברר ולפתח — כחלק משיחה ועבודה מקצועית.
              </p>
              <a href="https://bucolic-stardust-e4fa35.netlify.app/" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center font-bold text-brand-accent transition-colors hover:text-brand-dark">
                לפתיחת הכלי <span aria-hidden="true" className="mr-2">↗</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section id="guided-work" className="border-y border-brand-dark/10 bg-brand-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[0.85fr_1.15fr] md:items-center md:py-20">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-brand-accent">מעבר לכלי עצמו</p>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">יש כלים שהערך שלהם נוצר בתוך התהליך.</h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-brand-muted">
              חלק מהכלים שפיתחתי נועדו להשתלב בעבודה עם מנהלים, צוותי הנהלה וארגונים. במקרה כזה, לא נכון להציג אותם כאפליקציה שמספיקה להפעיל לבד: המתודולוגיה, השיחה וההתאמה למצב הן חלק מהעבודה.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="https://obt.kilon-consulting.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center bg-brand-dark px-6 py-4 font-bold text-white transition-colors hover:bg-brand-touch">
                להכיר את תהליך OBT <span aria-hidden="true" className="mr-2">↗</span>
              </a>
              <a href="mailto:gilad@kilon.co.il?subject=התנסות%20בכלי%20מהמעבדה" className="inline-flex items-center justify-center border border-brand-dark/20 px-6 py-4 font-bold text-brand-dark transition-colors hover:border-brand-accent hover:text-brand-accent">
                לתיאום התנסות
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-6 border-t border-brand-dark/15 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-bold">רוצים לבדוק איך זה יכול לעבוד אצלכם?</p>
            <p className="mt-2 max-w-2xl leading-relaxed text-brand-muted">אפשר לדבר על האתגר הארגוני, ורק אחר כך להחליט אם ואיזה כלי יכול לעזור.</p>
          </div>
          <a href="mailto:gilad@kilon.co.il?subject=שיחה%20על%20המעבדה" className="inline-flex shrink-0 items-center justify-center bg-brand-touch px-7 py-4 font-bold text-white transition-colors hover:bg-brand-gold hover:text-brand-dark">
            בואו נדבר <span aria-hidden="true" className="mr-2">←</span>
          </a>
        </div>
        <div className="mt-8 border-t border-brand-dark/10 pt-5 text-sm text-brand-muted">
          {isLoggedIn ? (
            <button onClick={() => onEnterTool('dashboard')} className="font-semibold underline underline-offset-4 hover:text-brand-dark">
              כניסה למרחב העבודה
            </button>
          ) : (
            <button onClick={() => onEnterTool('login')} className="font-semibold underline underline-offset-4 hover:text-brand-dark">
              למשתמשים קיימים: כניסה למרחב העבודה
            </button>
          )}
        </div>
      </section>
    </main>
  );
};

export default TheLab;
