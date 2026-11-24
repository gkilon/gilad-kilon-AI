import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'מגדירים את הדבר האחד',
    text: 'כל משתתף בוחר יעד התפתחותי משמעותי ומתרגם אותו להתנהגות קונקרטית שאפשר לזהות ולתרגל בעבודה.',
    tag: 'מיקוד'
  },
  {
    number: '02',
    title: 'מתנסים בתוך העבודה',
    text: 'בין המפגשים המשתתפים יוצאים לשטח, מנסים צעדים קטנים במצבים אמיתיים ובודקים מה עוזר ומה עדיין מקשה.',
    tag: 'התנסות'
  },
  {
    number: '03',
    title: 'לומדים ומדייקים את הדרך',
    text: 'חוזרים עם הניסיון מהשטח, מקבלים משוב ורעיונות מעמיתים, ומגבשים דרך פעולה שאפשר להמשיך ליישם.',
    tag: 'הטמעה'
  }
];

const OBTProgram: React.FC = () => {
  return (
    <main dir="rtl" className="min-h-screen bg-brand-beige text-brand-dark">
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute -top-36 -left-24 w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute -top-20 -left-8 w-64 h-64 rounded-full border border-white/10" />
        <div className="absolute bottom-0 right-0 w-2 h-40 bg-brand-touch" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs md:text-sm font-bold tracking-[0.18em] text-brand-gold mb-6">ONE BIG THING · תכנית פיתוח קבוצתית</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.12] tracking-tight">
              היעד כבר הוגדר.
              <span className="block text-brand-gold">עכשיו צריך להפוך אותו לשינוי שקורה.</span>
            </h1>
            <p className="mt-7 text-lg md:text-2xl leading-relaxed text-white/75 max-w-3xl">
              רוב יעדי הפיתוח ההתנהגותיים שעולים בשיחות המשוב מתמוססים תחת עומס השגרה — לא מחוסר רצון, אלא מחוסר בשיטה ובמרחב תרגול.
            </p>
            <p className="mt-5 text-base md:text-xl leading-relaxed text-white/85 max-w-3xl">
              OBT הוא ספרינט פיתוח קבוצתי בן שלושה מפגשים, שמסייע לעובדים לתרגם יעד התנהגותי אחד משמעותי להרגל עבודה יומיומי.
            </p>
            <div className="flex flex-wrap gap-3 mt-9">
              <Link to="/contact?topic=תכנית%20OBT%20קבוצתית" className="inline-flex items-center justify-center px-7 py-4 bg-brand-touch text-white font-bold hover:bg-white hover:text-brand-dark transition-colors">
                בואו נדבר על OBT <span className="mr-3" aria-hidden="true">←</span>
              </Link>
              <a href="https://wa.me/972526417512?text=%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%9C%20%D7%AA%D7%9B%D7%A0%D7%99%D7%AA%20OBT" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-7 py-4 border border-white/30 text-white font-bold hover:bg-white/10 transition-colors">
                WhatsApp
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-5 max-w-2xl mt-14 pt-7 border-t border-white/15">
              <div><p className="text-3xl md:text-4xl font-black text-brand-gold">3</p><p className="text-xs md:text-sm text-white/65 mt-1">מפגשים ממוקדים</p></div>
              <div><p className="text-3xl md:text-4xl font-black text-brand-gold">1</p><p className="text-xs md:text-sm text-white/65 mt-1">יעד אישי לכל משתתף</p></div>
              <div><p className="text-3xl md:text-4xl font-black text-brand-gold">צוות</p><p className="text-xs md:text-sm text-white/65 mt-1">למידה מעמיתים</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 items-start">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-brand-accent mb-4">הפער שבין משוב לשינוי</p>
            <h2 className="text-3xl md:text-4xl font-black leading-tight">כולנו יודעים מה כדאי לשנות. זה עדיין לא אומר שנצליח לעשות את זה.</h2>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-brand-muted">
            <p>בשיחת המשוב קל יחסית לזהות יעד התפתחותי: להקשיב יותר, להאציל סמכויות, ליזום, להציב גבולות או לנהל שיחות מורכבות אחרת.</p>
            <p>אבל כשהעבודה חוזרת לקצב הרגיל, הדפוסים המוכרים חוזרים איתה. כדי ששינוי יקרה, צריך יותר מהחלטה טובה: צריך מיקוד, התנסות, למידה ומשוב לאורך הדרך.</p>
            <p className="font-bold text-brand-dark">OBT יוצר את המרחב הזה — קצר, ממוקד ומחובר לעבודה עצמה.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#E9E3D8] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-bold tracking-[0.16em] text-brand-accent mb-4">איך זה עובד</p>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">שלושה מפגשים. תהליך אחד שממשיך בין המפגשים.</h2>
            <p className="text-lg text-brand-muted mt-5 leading-relaxed">הקבוצה נפגשת כדי להתמקד, ללמוד ולעבד. את השינוי עצמו מתרגלים בסביבת העבודה האמיתית.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((step, index) => (
              <article key={step.number} className="bg-brand-paper border border-brand-dark/10 p-7 md:p-8 flex flex-col min-h-[290px]">
                <div className="flex items-center justify-between mb-10">
                  <span className="text-4xl font-black text-brand-touch/80">{step.number}</span>
                  <span className="text-xs font-bold text-brand-accent border border-brand-accent/25 px-3 py-1">{step.tag}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-brand-muted leading-relaxed">{step.text}</p>
                {index < 2 && <div className="hidden md:block mt-auto pt-8 text-brand-touch text-xl" aria-hidden="true">←</div>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-bold tracking-[0.16em] text-brand-accent mb-4">מה הופך את התהליך לאפקטיבי</p>
          <h2 className="text-3xl md:text-5xl font-black leading-tight">לא עוד תוכן שלומדים ושוכחים. עבודה על הדבר שבאמת צריך להשתנות.</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-9">
          <div className="border-t-2 border-brand-touch pt-5">
            <h3 className="text-xl font-bold mb-2">יעד אחד, אישי ומשמעותי</h3>
            <p className="text-brand-muted leading-relaxed">כל משתתף עובד על ה-One Big Thing שלו. אין תכנית אחידה שמנסה להתאים לכולם.</p>
          </div>
          <div className="border-t-2 border-brand-touch pt-5">
            <h3 className="text-xl font-bold mb-2">התנסות במציאות הארגונית</h3>
            <p className="text-brand-muted leading-relaxed">התרגול מתרחש בשיחות, בהחלטות ובמצבים היומיומיים שבהם נדרש השינוי.</p>
          </div>
          <div className="border-t-2 border-brand-touch pt-5">
            <h3 className="text-xl font-bold mb-2">קבוצה קטנה כמרחב למידה</h3>
            <p className="text-brand-muted leading-relaxed">המשתתפים מביאים ניסיון מהשטח, מקבלים נקודות מבט נוספות ומציעים זה לזה רעיונות.</p>
          </div>
          <div className="border-t-2 border-brand-touch pt-5">
            <h3 className="text-xl font-bold mb-2">אחריות שנשארת אצל העובד</h3>
            <p className="text-brand-muted leading-relaxed">העובד מוביל את ההתפתחות שלו, והמנהל יכול לתמוך בה מתוך העבודה השוטפת.</p>
          </div>
        </div>
      </section>

      <section className="bg-brand-dark text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-bold tracking-[0.16em] text-brand-gold mb-4">ערך לכל השותפים</p>
            <h2 className="text-3xl md:text-5xl font-black leading-tight">העובד מתפתח. המנהל תומך. הארגון סוגר מעגל.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-t border-white/25 pt-6">
              <p className="text-brand-gold text-sm font-bold mb-4">לעובד</p>
              <h3 className="text-2xl font-bold mb-3">התפתחות שיש עליה בעלות</h3>
              <p className="text-white/70 leading-relaxed">מיקוד באתגר אישי, הבנה טובה יותר של דפוסי הפעולה והזדמנות לתרגל שינוי בקצב שמתאים למציאות העבודה.</p>
            </div>
            <div className="border-t border-white/25 pt-6">
              <p className="text-brand-gold text-sm font-bold mb-4">למנהל</p>
              <h3 className="text-2xl font-bold mb-3">עובד שמוביל את ההתפתחות שלו</h3>
              <p className="text-white/70 leading-relaxed">העובד מגיע עם מטרה ברורה ועם אחריות לתהליך. המנהל יכול לסייע ביצירת הזדמנויות לתרגול ולמידה.</p>
            </div>
            <div className="border-t border-white/25 pt-6">
              <p className="text-brand-gold text-sm font-bold mb-4">למשאבי אנוש</p>
              <h3 className="text-2xl font-bold mb-3">המשכיות לתהליך ההערכה</h3>
              <p className="text-white/70 leading-relaxed">דרך מעשית לחבר בין יעדי הפיתוח שעלו בשיחות המשוב לבין תהליך שמתרחש בפועל — ולא נשאר על הנייר.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-brand-accent mb-4">למי זה מתאים</p>
            <h2 className="text-3xl md:text-4xl font-black leading-tight">לארגונים שרוצים ששלב ההתפתחות יתחיל אחרי שיחת המשוב — ולא ייעצר בה.</h2>
          </div>
          <ul className="space-y-4 text-lg text-brand-muted leading-relaxed">
            <li className="flex gap-3"><span className="text-brand-touch font-black">✓</span><span>ארגונים שמבקשים לתת מענה מעשי ליעדי פיתוח מתוך תהליכי הערכה ומשוב.</span></li>
            <li className="flex gap-3"><span className="text-brand-touch font-black">✓</span><span>מנהלים ועובדים שמוכנים לעבוד על שינוי התנהגותי ממוקד.</span></li>
            <li className="flex gap-3"><span className="text-brand-touch font-black">✓</span><span>קבוצות קטנות של עמיתים שיכולים ללמוד זה מזה ולתמוך בהתנסות.</span></li>
          </ul>
        </div>
      </section>

      <section className="bg-[#E9E3D8] py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs font-bold tracking-[0.16em] text-brand-accent mb-4">ONE BIG THING</p>
          <h2 className="text-3xl md:text-5xl font-black leading-tight">לא עוד יעד שנשאר על הנייר.</h2>
          <p className="text-lg md:text-xl text-brand-muted leading-relaxed max-w-3xl mx-auto mt-6">שלושה מפגשים שמייצרים מסגרת להתנסות, למידה והתקדמות — סביב הדבר האחד שחשוב לכל משתתף לשנות.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-9">
            <Link to="/contact?topic=תכנית%20OBT%20קבוצתית" className="inline-flex items-center px-8 py-4 bg-brand-dark text-white font-bold hover:bg-brand-accent transition-colors">לתיאום שיחה על התכנית ←</Link>
            <a href="https://wa.me/972526417512?text=%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%9C%20%D7%AA%D7%9B%D7%A0%D7%99%D7%AA%20OBT" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-4 border border-brand-dark/25 font-bold hover:bg-white transition-colors">או ב-WhatsApp</a>
          </div>
          <p className="text-sm text-brand-muted mt-10">גלעד קילון · ייעוץ ופיתוח ארגוני · <a href="https://kilon-consulting.com" className="underline underline-offset-4">kilon-consulting.com</a></p>
        </div>
      </section>
    </main>
  );
};

export default OBTProgram;
