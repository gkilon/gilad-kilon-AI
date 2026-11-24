import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'מזקקים יעד אחד',
    text: 'מתוך שיחת המשוב כל משתתף בוחר יעד התנהגותי משמעותי אחד — ממוקד, אישי ומחובר לעבודה שלו.',
    tag: 'מיקוד'
  },
  {
    number: '02',
    title: 'מבינים מה מעכב שינוי',
    text: 'בודקים אילו דפוסים, הרגלים והנחות מקשים על המעבר מכוונה לפעולה, ומה יכול לאפשר התנסות אחרת.',
    tag: 'גילוי'
  },
  {
    number: '03',
    title: 'מתנסים בשטח',
    text: 'בין המפגשים מתרגלים צעדים קטנים במצבי עבודה אמיתיים, חוזרים עם הניסיון ולומדים איך להמשיך.',
    tag: 'יישום'
  }
];

const OBTProgram: React.FC = () => {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-slate-800">
      <section className="relative overflow-hidden bg-[#101B32] text-white">
        <div className="absolute -top-40 -left-24 h-[30rem] w-[30rem] rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-1 w-40 bg-[#F28A45]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-10 md:pb-28 md:pt-14">
          <div className="mb-16 flex items-center justify-start border-b border-white/15 pb-5">
            <div className="flex items-center gap-4" aria-label="OBT — Innovation in Human Capital">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-[#F28A45] bg-white text-[#F28A45]">
                <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18M3 9h18" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-3 text-2xl leading-none text-white md:text-3xl">
                  <span className="font-black tracking-tight">OBT</span>
                  <span className="text-xl font-light text-white/35">|</span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.13em] text-white/65 md:text-xs">Innovation in Human Capital</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="mb-5 text-sm font-bold tracking-wide text-[#F5A66E]">תוכנית פיתוח התנהגותי | מבוססת OBT</p>
              <h1 className="max-w-4xl text-4xl font-black leading-[1.13] tracking-tight sm:text-5xl md:text-7xl">
                Feedback Boost
                <span className="mt-4 block max-w-4xl text-xl font-medium leading-snug text-white/85 md:text-3xl">לא שיטת משוב חדשה, אלא תהליך המשך ממוקד שמתחבר למשוב הקיים ומסייע להפוך את היעדים שעולים בו להתנסות ולשינוי בעבודה.</span>
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">
                שיחת המשוב מזהה לא פעם בדיוק את הדבר שחשוב לשנות. אבל כשמדובר בהתנהגות ולא בידע מקצועי, הדרך מהתובנה לשינוי יומיומי אינה מובנת מאליה.
              </p>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
                Feedback Boost היא תוכנית קבוצתית ממוקדת בת שלושה מפגשים, המבוססת על גישת OBT — One Big Thing. כל משתתף מתמקד ביעד התנהגותי אחד, מתנסה ביישום שלו בעבודה ומפתח דרך להפוך כוונה לפעולה.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/contact?topic=OBT%20Feedback%20Boost" className="inline-flex items-center rounded-lg bg-[#F28A45] px-7 py-4 font-bold text-[#101B32] shadow-lg shadow-orange-950/20 transition hover:-translate-y-0.5 hover:bg-white">
                  בואו נדבר על Feedback Boost <span className="mr-3">←</span>
                </Link>
                <a href="#how-it-works" className="inline-flex items-center rounded-lg border border-white/25 px-7 py-4 font-medium text-white transition hover:border-white hover:bg-white/5">
                  איך זה עובד?
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-sm">
                <p className="text-xs font-bold tracking-[0.18em] text-[#F5A66E]">THE OBT APPROACH</p>
                <div className="mt-8 space-y-7">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F28A45]/15 text-lg font-black text-[#F5A66E]">1</span>
                    <div><div className="font-bold">יעד התפתחותי אחד</div><div className="mt-1 text-sm text-white/55">מיקוד במה שחשוב לשנות</div></div>
                  </div>
                  <div className="mr-5 h-7 border-r border-dashed border-white/25" />
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F28A45]/15 text-lg font-black text-[#F5A66E]">2</span>
                    <div><div className="font-bold">התנסות ולמידה</div><div className="mt-1 text-sm text-white/55">עבודה עם מה שמקדם ומה שמעכב</div></div>
                  </div>
                  <div className="mr-5 h-7 border-r border-dashed border-white/25" />
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F28A45]/15 text-lg font-black text-[#F5A66E]">3</span>
                    <div><div className="font-bold">שינוי בתוך העבודה</div><div className="mt-1 text-sm text-white/55">צעדים קטנים במצבים אמיתיים</div></div>
                  </div>
                </div>
                <div className="mt-9 border-t border-white/10 pt-5 text-sm text-white/55">3 מפגשים קבוצתיים · יעד אישי לכל משתתף</div>
              </div>
            </div>
          </div>
          <div className="mt-14 grid max-w-2xl grid-cols-3 border-t border-white/15 pt-6">
            <div><div className="text-3xl font-black text-[#F5A66E]">3</div><div className="mt-1 text-xs text-white/60 md:text-sm">מפגשים קבוצתיים</div></div>
            <div><div className="text-3xl font-black text-[#F5A66E]">1</div><div className="mt-1 text-xs text-white/60 md:text-sm">יעד לכל משתתף</div></div>
            <div><div className="text-3xl font-black text-[#F5A66E]">OBT</div><div className="mt-1 text-xs text-white/60 md:text-sm">גישה ממוקדת שינוי</div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.18em] text-[#D96F2B]">הפער שבין משוב לשינוי</p>
            <h2 className="text-3xl font-black leading-tight text-[#101B32] md:text-4xl">להבין מה צריך להשתנות — זה רק הצעד הראשון.</h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-slate-600">
            <p>בשיחת המשוב אפשר לזהות יעד התפתחותי חשוב: להקשיב יותר, להאציל סמכויות, ליזום, להציב גבולות או לנהל שיחות מורכבות אחרת.</p>
            <p>אבל גם כשיש רצון טוב, דפוסים מוכרים חוזרים תחת עומס השגרה. שינוי התנהגותי דורש יותר מהחלטה — הוא דורש להבין מה עומד בדרכה, להתנסות וללמוד לאורך הדרך.</p>
            <p className="font-bold text-[#101B32]">Feedback Boost מוסיפה לתהליך ההערכה מרחב מובנה שבו אפשר להפוך יעד התפתחותי לתנועה ממשית בעבודה.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#F5F6F8] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-xs font-bold tracking-[0.18em] text-[#D96F2B]">התהליך</p>
            <h2 className="text-3xl font-black leading-tight text-[#101B32] md:text-5xl">שלושה מפגשים. שינוי שמתרגלים בשטח.</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">הקבוצה מספקת מסגרת ללמידה, חשיבה ומשוב. בין המפגשים כל משתתף מתנסה בסביבת העבודה האמיתית שלו.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="group rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8">
                <div className="mb-10 flex items-center justify-between">
                  <span className="text-5xl font-black tracking-tight text-[#E9A06F]">{step.number}</span>
                  <span className="rounded-full bg-orange-50 px-4 py-1.5 text-xs font-bold text-[#B85B22]">{step.tag}</span>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-[#101B32]">{step.title}</h3>
                <p className="leading-relaxed text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-xs font-bold tracking-[0.18em] text-[#D96F2B]">מה מייחד את OBT</p>
          <h2 className="text-3xl font-black leading-tight text-[#101B32] md:text-5xl">לא עוד המלצה כללית לפיתוח. עבודה ממוקדת על הדבר האחד.</h2>
        </div>
        <div className="grid gap-x-12 gap-y-9 sm:grid-cols-2">
          <div className="border-t-2 border-[#E58A4B] pt-5"><h3 className="mb-2 text-xl font-bold text-[#101B32]">יעד אישי ומשמעותי</h3><p className="leading-relaxed text-slate-600">כל משתתף עובד על ה-One Big Thing שלו — יעד התפתחותי אחד שמחובר לאתגרים האמיתיים שלו.</p></div>
          <div className="border-t-2 border-[#E58A4B] pt-5"><h3 className="mb-2 text-xl font-bold text-[#101B32]">הבנת מה שמעכב</h3><p className="leading-relaxed text-slate-600">לא מסתפקים בשאלה מה צריך לעשות אחרת; בודקים גם אילו דפוסים והנחות מקשים על השינוי.</p></div>
          <div className="border-t-2 border-[#E58A4B] pt-5"><h3 className="mb-2 text-xl font-bold text-[#101B32]">למידה בתוך קבוצת עמיתים</h3><p className="leading-relaxed text-slate-600">הקבוצה מאפשרת לקבל נקודות מבט נוספות, ללמוד מניסיון של אחרים ולחזק את המחויבות להתנסות.</p></div>
          <div className="border-t-2 border-[#E58A4B] pt-5"><h3 className="mb-2 text-xl font-bold text-[#101B32]">יישום במציאות העבודה</h3><p className="leading-relaxed text-slate-600">ההתנסות מתרחשת בשיחות, בהחלטות ובמצבים היומיומיים שבהם נדרש השינוי — לא רק בחדר ההדרכה.</p></div>
        </div>
      </section>

      <section className="bg-[#101B32] py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-xs font-bold tracking-[0.18em] text-[#F5A66E]">הערך הארגוני</p>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">העובד מתפתח. המנהל תומך. הארגון סוגר מעגל.</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-white/15 bg-white/[0.04] p-7"><p className="mb-4 text-sm font-bold text-[#F5A66E]">לעובדים</p><h3 className="mb-3 text-2xl font-bold">הזדמנות לצמוח</h3><p className="leading-relaxed text-white/70">תחושת השקעה והתפתחות, לצד כלים מעשיים לעבודה על אתגר אישי — בלי תחושה של תיוג או תיקון.</p></div>
            <div className="rounded-xl border border-white/15 bg-white/[0.04] p-7"><p className="mb-4 text-sm font-bold text-[#F5A66E]">למנהלים</p><h3 className="mb-3 text-2xl font-bold">מעטפת מקצועית</h3><p className="leading-relaxed text-white/70">מסגרת שמסייעת לעובד להוביל את ההתפתחות שלו, ומאפשרת למנהל לתמוך בה בלי לשאת לבדו את הליווי המקצועי.</p></div>
            <div className="rounded-xl border border-white/15 bg-white/[0.04] p-7"><p className="mb-4 text-sm font-bold text-[#F5A66E]">למשאבי אנוש</p><h3 className="mb-3 text-2xl font-bold">סגירת מעגל</h3><p className="leading-relaxed text-white/70">חיבור מעשי בין שיחות ההערכה ויעדי הפיתוח לבין תהליך שממשיך אל תוך שגרת העבודה.</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div><p className="mb-4 text-xs font-bold tracking-[0.18em] text-[#D96F2B]">למי זה מתאים</p><h2 className="text-3xl font-black leading-tight text-[#101B32] md:text-4xl">לארגונים שרוצים שהמשוב יהיה התחלה של תהליך — ולא סופו.</h2></div>
          <ul className="space-y-5 text-lg leading-relaxed text-slate-600">
            <li className="flex gap-3"><span className="font-black text-[#D96F2B]">✓</span><span>ארגונים המבקשים לתת מענה מעשי ליעדי פיתוח התנהגותיים שעולים בתהליכי הערכה.</span></li>
            <li className="flex gap-3"><span className="font-black text-[#D96F2B]">✓</span><span>עובדים ומנהלים שמוכנים להתמקד בשינוי אחד משמעותי ולתרגל אותו בעבודה.</span></li>
            <li className="flex gap-3"><span className="font-black text-[#D96F2B]">✓</span><span>קבוצות עמיתים שיכולות להיתרם מלמידה משותפת ומנקודות מבט מגוונות.</span></li>
          </ul>
        </div>
      </section>

      <section className="bg-[#101B32] py-16 text-white md:py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="mb-4 text-xs font-bold tracking-[0.18em] text-[#F5A66E]">OBT · FEEDBACK BOOST</p>
          <h2 className="text-3xl font-black leading-tight md:text-5xl">בואו להפוך את שיחת המשוב לנקודת התחלה.</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/70">נשמח לחשוב יחד איך Feedback Boost יכול להשתלב בתהליך המשוב והפיתוח בארגון שלכם.</p>
          <div className="mt-9">
            <Link to="/contact?topic=OBT%20Feedback%20Boost" className="inline-flex items-center rounded-lg bg-[#F28A45] px-7 py-4 font-bold text-[#101B32] shadow-lg transition hover:-translate-y-0.5 hover:bg-white">
              לתיאום שיחה <span className="mr-3">←</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default OBTProgram;
