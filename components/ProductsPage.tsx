import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

type Offering = {
  slug: string;
  title: string;
  kind: string;
  description: string;
  detail: string;
  audience: string;
  approach: string;
  url?: string;
  group: 'process' | 'focused';
};

const offerings: Offering[] = [
  {
    slug: 'obt',
    title: 'OBT להתפתחות אישית',
    kind: 'תהליך עומק',
    description: 'להבין מה עוצר את השינוי — ולהתחיל לפעול אחרת.',
    detail: 'תהליך מובנה שעוזר לאדם לבחור מטרה משמעותית, לזהות את ההנחות והחששות שמובילים אותו לפעול בניגוד למטרה, ולבנות צעדים מעשיים לשינוי. לא מסתפקים בתכנית פעולה; בודקים גם מה מקשה ליישם אותה במציאות.',
    audience: 'מנהלים ואנשים שרוצים להתקדם בנושא שחשוב להם, אבל מגלים שכוונה טובה ותכנית מסודרת לא תמיד מספיקות.',
    approach: 'מחברים בין מטרה, דפוסי פעולה והגורמים שמקשים להשתנות. העבודה אישית, הדרגתית ומעשית.',
    url: 'https://obt.kilon-consulting.com/',
    group: 'process'
  },
  {
    slug: 'p2g',
    title: 'P2G — מתהליך הערכה לתהליך התפתחות',
    kind: 'תכנית ארגונית',
    description: 'להעביר את מרכז הכובד מהערכת העובד לאחריות שלו להתפתחות.',
    detail: 'תכנית שמציעה חשיבה מחודשת על תהליך הערכת הביצועים. במקום להסתפק בשיחה תקופתית ובמשוב, יוצרים תהליך שמסייע לעובד להוביל את ההתפתחות שלו, כשהמנהל משמש גורם תומך והארגון מאפשר את התנאים לכך.',
    audience: 'ארגונים ומשאבי אנוש שרוצים לבחון מחדש את תהליך הערכת הביצועים ואת חלוקת האחריות להתפתחות.',
    approach: 'לא מצפים מכל מנהל להפוך למאמן אישי. בונים תהליך וכלים שמחזירים לעובד אחריות ומגדירים למנהל ול-HR תפקיד תומך וברור.',
    url: 'https://effervescent-gelato-193991.netlify.app/',
    group: 'process'
  },
  {
    slug: 'management-development',
    title: 'פיתוח מנהלים וייעוץ אישי',
    kind: 'תהליך ניהולי',
    description: 'לעבוד על האתגרים האמיתיים של המנהל, ולא רק על ארגז הכלים שלו.',
    detail: 'ליווי אישי סביב צמתים ניהוליים, כניסה לתפקיד, החלטות מורכבות, יחסים עם ממשקים או פער בין הכוונות לבין מה שקורה בפועל. העבודה מותאמת למנהל, לתפקיד ולמציאות הארגונית שבה הוא פועל.',
    audience: 'מנהלים בדרגים שונים, במיוחד כשהתפקיד משתנה, כשהאתגר מסתבך או כשהדרך הנוכחית כבר לא מספיקה.',
    approach: 'שיחה ישירה ומכבדת, הסתכלות על האדם ועל המערכת, וחיבור בין הבנה לעשייה שאפשר ליישם ביום-יום.',
    group: 'process'
  },
  {
    slug: 'team-development',
    title: 'פיתוח ובניית צוותי הנהלה',
    kind: 'תהליך ארגוני',
    description: 'לעזור לקבוצה של מנהלים להפוך לצוות שמסוגל לחשוב, להחליט ולפעול יחד.',
    detail: 'תהליך שמסייע לצוות הנהלה לחדד את המטרה המשותפת, לדבר על מתחים וחילוקי דעות, להבהיר תפקידים וציפיות ולשפר את איכות קבלת ההחלטות והעבודה המשותפת.',
    audience: 'צוותי הנהלה וצוותים ניהוליים שצריכים להתגבש, להתחדש או להתמודד עם פערים שמקשים עליהם לפעול כצוות.',
    approach: 'לא מסתפקים ב״גיבוש״. עובדים על מה שקורה בין חברי הצוות ועל האופן שבו הצוות מתפקד כיחידה משותפת.',
    group: 'process'
  },
  {
    slug: 'interfaces-and-partnerships',
    title: 'ממשקי עבודה ושותפויות',
    kind: 'תהליך ארגוני',
    description: 'לשפר את העבודה בין אנשים ויחידות — לא רק את היחסים ביניהם.',
    detail: 'ליווי של ממשקים שבהם אחריות, ציפיות, תהליכים או סדרי עדיפויות אינם מתואמים מספיק. מבררים מה נדרש מהשותפים, היכן העבודה נתקעת ואילו הסכמות ושינויים יעזרו לה להתקדם.',
    audience: 'מנהלים, יחידות ושותפים עסקיים שתלויים זה בזה, אבל מתקשים לייצר עבודה חלקה ואפקטיבית.',
    approach: 'מחברים בין היחסים לבין המערכת: תפקידים, אחריות, תהליכים, ציפיות והיכולת לדבר על מה שלא עובד.',
    group: 'process'
  },
  {
    slug: 'change-processes',
    title: 'ליווי תהליכי שינוי',
    kind: 'תהליך ארגוני',
    description: 'לחבר בין השינוי שהארגון מבקש לבין מה שאנשים צריכים לעשות אחרת בפועל.',
    detail: 'ליווי ארגונים בתקופות של צמיחה, שינוי מבני, שינוי דרך עבודה או הטמעת כיוון חדש. בוחנים גם את התכנון וגם את המציאות האנושית והארגונית שבה השינוי אמור להתרחש.',
    audience: 'מנהלים והנהלות שמובילים שינוי ורוצים להתמודד עם הפער בין ההחלטה לבין היישום.',
    approach: 'מתייחסים להתנגדויות, למתחים ולפערים כמידע שצריך להבין, לא כרעש שצריך להשתיק.',
    group: 'process'
  },
  {
    slug: 'communication-styles',
    title: 'סגנונות תקשורת בעולם העבודה החדש',
    kind: 'סדנה',
    description: 'להבין את ההבדלים בינינו — ולמצוא דרך לעבוד ולדבר טוב יותר יחד.',
    detail: 'סדנה שמאפשרת לזהות הבדלים בסגנונות תקשורת, להבין איך הם משפיעים על שיחות, החלטות ואי-הבנות, ולתרגל דרכים להתאים את התקשורת למי שנמצא מולנו. ניתן לשלב אבחון אישי המבוסס AI כחלק מהלמידה.',
    audience: 'צוותים, מנהלים וארגונים שרוצים לשפר תקשורת ושיתוף פעולה בלי לתייג אנשים או לצמצם אותם לצבע או לסגנון אחד.',
    approach: 'האבחון הוא נקודת מוצא לשיחה ולהבנה, לא תחליף להיכרות עם האדם ולבחינת ההקשר.',
    url: 'https://communication.kilon-consulting.com/',
    group: 'focused'
  },
  {
    slug: 'system-and-relationships',
    title: 'מערכת ויחסים: מממשקים לשותפויות',
    kind: 'סדנה ממוקדת',
    description: 'לא רק לשפר את היחסים — לשפר את העבודה המשותפת.',
    detail: 'סדנה שמחברת בין מה שקורה בין אנשים לבין המבנה שבו הם עובדים: תפקידים, אחריות, ציפיות, תהליכים והסכמות. נבחן מדוע שיתוף פעולה נתקע ומה צריך לשנות כדי ששותפות תעבוד.',
    audience: 'מנהלים, צוותי משאבי אנוש, צוותי הנהלה ויחידות שצריכים לשפר את העבודה המשותפת בממשקים מרכזיים.',
    approach: 'בודקים את ה״ישות השלישית״ שנוצרת בין השותפים — מערכת היחסים והעבודה המשותפת — ואת התנאים שמאפשרים לה להצליח.',
    group: 'focused'
  },
  {
    slug: 'obt-capsule',
    title: 'קפסולת OBT',
    kind: 'התנסות ממוקדת',
    description: 'טעימה מעשית מגישה שעוזרת להפוך כוונה לשינוי.',
    detail: 'מפגש ממוקד להיכרות עם עקרונות OBT: בוחרים מטרה אישית, מזהים את המתח בין הכוונה לבין ההתנהגות בפועל, ובוחנים צעד ראשון שאפשר לתרגל. זו התנסות ממוקדת ולא תחליף לתהליך OBT מלא.',
    audience: 'צוותים, מנהלים או קבוצות שרוצים להכיר את הגישה דרך התנסות קצרה ומעשית.',
    approach: 'במקום להסתפק בהסבר תיאורטי, המשתתפים מתנסים באופן שבו אפשר לחקור מה עוצר שינוי ולבחור צעד מעשי.',
    group: 'focused'
  },
  {
    slug: 'negotiation-to-partnership',
    title: 'ממשא ומתן לבניית שותפויות',
    kind: 'הרצאה או סדנה',
    description: 'לחשוב גם על ההסכם — וגם על העבודה המשותפת שתבוא אחריו.',
    detail: 'מפגש מעשי על ניהול משא ומתן מתוך ראייה רחבה: לא רק איך מגיעים להסכם, אלא גם איך בונים את מערכת היחסים ואת התנאים שיאפשרו לשותפות להחזיק לאורך זמן.',
    audience: 'מנהלים, צוותים מסחריים ושותפים עסקיים שנדרשים להגיע להסכמות ולהמשיך לעבוד יחד.',
    approach: 'מחברים בין האינטרסים וההסכם לבין אמון, ציפיות והאופן שבו הצדדים יפעלו יחד לאחר סיום המשא ומתן.',
    group: 'focused'
  },
  {
    slug: 'system-and-relationships-lecture',
    title: 'בין מערכת ליחסים',
    kind: 'הרצאה',
    description: 'איך מבנה, תפקידים ואנשים מעצבים את שיתוף הפעולה.',
    detail: 'הרצאה על המפגש בין המבנה הארגוני לבין מערכות היחסים בעבודה. באמצעות דוגמאות וכלים, נבחן איך תהליכים, ממשקים ותקשורת משפיעים זה על זה ומה אפשר לעשות אחרת.',
    audience: 'ארגונים, הנהלות, צוותי HR וקהילות מקצועיות.',
    approach: 'מבט מפוכח על מה שמתרחש בין אנשים, בלי לייחס כל קושי לאישיות ובלי להתעלם מהמערכת שבה הם פועלים.',
    group: 'focused'
  }
];

const ProductsPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  // Keep the previous feedback URL working as an alias for the P2G program.
  const selected = offerings.find(item => item.slug === slug) || (slug === 'feedback' ? offerings.find(item => item.slug === 'p2g') : undefined);
  const processItems = offerings.filter(item => item.group === 'process');
  const focusedItems = offerings.filter(item => item.group === 'focused');
  const category = slug === 'processes' ? {
    title: 'ייעוץ ותהליכים',
    intro: 'עבודה משותפת על אתגרים ניהוליים וארגוניים — מפיתוח מנהלים וצוותים ועד ממשקים ושינוי.',
    items: processItems
  } : slug === 'workshops' ? {
    title: 'סדנאות והרצאות',
    intro: 'מפגשים ממוקדים שמחברים בין תפיסה מקצועית, התנסות וכלים שאפשר לקחת לעבודה.',
    items: focusedItems
  } : null;

  const renderItems = (items: Offering[]) => <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{items.map((item, index) => <article key={item.slug} className="flex flex-col text-right bg-brand-paper border border-brand-dark/10 p-7 md:p-8 hover:border-brand-accent hover:bg-white transition-colors">
    <p className="text-xs font-bold text-brand-accent mb-4">{item.kind}</p>
    <h3 className="text-xl md:text-2xl font-bold mb-3">{item.title}</h3>
    <p className="text-brand-muted leading-relaxed flex-1">{item.description}</p>
    <Link to={`/products/${item.slug}`} className="inline-block mt-7 font-bold underline underline-offset-4">לפרטים נוספים ←</Link>
  </article>)}</div>;

  if (slug && !selected && !category) return <main className="min-h-screen bg-brand-beige px-6 py-24 text-center" dir="rtl"><h1 className="text-3xl font-bold">לא מצאתי את העמוד הזה</h1><button onClick={() => navigate('/products')} className="mt-6 underline">לכל התהליכים והסדנאות</button></main>;

  if (selected) return <main className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl">
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <section className="bg-brand-dark text-white p-7 md:p-10 mb-10 relative overflow-hidden">
      <button onClick={() => navigate('/products')} className="text-sm font-bold text-white/65 hover:text-white mb-10">← לכל התהליכים והסדנאות</button>
      <p className="text-xs font-bold text-brand-gold mb-4">{selected.kind}</p>
      <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-4xl">{selected.title}</h1>
      <p className="text-xl md:text-2xl leading-relaxed text-white/70 mt-7 max-w-3xl">{selected.description}</p></section>
      <div className="mt-10 border-t border-brand-dark/10 pt-8 max-w-3xl space-y-8">
        <section><h2 className="text-lg font-bold mb-2">על מה עובדים?</h2><p className="text-lg leading-relaxed">{selected.detail}</p></section>
        <section><h2 className="text-lg font-bold mb-2">למי זה מתאים?</h2><p className="text-lg leading-relaxed text-brand-muted">{selected.audience}</p></section>
        <section><h2 className="text-lg font-bold mb-2">מה אני מביא לתהליך?</h2><p className="text-lg leading-relaxed text-brand-muted">{selected.approach}</p></section>
        <div className="flex flex-wrap gap-3 items-center pt-2">
          {selected.url && <a href={selected.url} target="_blank" rel="noopener noreferrer" className="inline-flex px-6 py-3 bg-brand-accent text-white font-bold hover:bg-brand-touch transition-colors">{selected.slug === 'obt' ? 'להיכרות עם כלי OBT ←' : selected.slug === 'communication-styles' ? 'להיכרות עם כלי סגנונות התקשורת ←' : selected.slug === 'p2g' ? 'לדף תכנית המשוב ←' : 'לכלי המשלים ←'}</a>}
          <Link to={`/contact?topic=${encodeURIComponent(selected.title)}`} className="inline-flex px-6 py-3 border border-brand-dark/20 font-bold hover:border-brand-dark transition-colors">לשיחה על הנושא ←</Link>
        </div>
      </div>
    </div>
  </main>;

  if (category) return <main className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl">
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <Link to="/products" className="inline-block text-sm font-bold text-brand-muted hover:text-brand-dark mb-10">← לכל האפשרויות</Link>
      <header className="max-w-4xl mb-12 md:mb-16 border-r-4 border-brand-touch pr-6 md:pr-8 bg-brand-dark text-white p-7 md:p-10 relative overflow-hidden">
        <p className="text-xs font-bold tracking-[0.18em] text-brand-gold mb-4">איך אפשר לעבוד יחד</p>
        <h1 className="text-4xl md:text-6xl font-black leading-tight">{category.title}</h1>
        <p className="text-lg md:text-2xl leading-relaxed text-white/70 mt-6">{category.intro}</p>
      </header>
      {renderItems(category.items)}
      <section className="mt-16 bg-brand-dark text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-7">
        <div className="max-w-2xl"><h2 className="text-2xl md:text-3xl font-bold">לא בטוחים מה מתאים?</h2><p className="text-white/70 leading-relaxed mt-3">אפשר להתחיל בשיחה קצרה ולחשוב יחד מה נכון לאתגר שלכם.</p></div>
        <Link to="/contact?topic=התייעצות%20ראשונית" className="inline-flex self-start md:self-auto px-6 py-3 bg-brand-touch text-white font-bold hover:bg-white hover:text-brand-dark transition-colors">בואו נדבר ←</Link>
      </section>
    </div>
  </main>;



  return <main className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl">
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <header className="max-w-4xl mb-12 md:mb-16 border-r-4 border-brand-touch pr-6 md:pr-8 bg-brand-dark text-white p-7 md:p-10 relative overflow-hidden">
        <p className="text-xs font-bold tracking-[0.18em] text-brand-accent mb-4">איך אפשר לעבוד יחד</p>
        <h1 className="text-4xl md:text-6xl font-black leading-tight">מתחילים ממה שצריך להשתנות.</h1>
        <p className="text-lg md:text-2xl leading-relaxed text-brand-muted mt-6">יש אתגרים שדורשים תהליך מתמשך, ויש נושאים שאפשר לפתוח בסדנה או במפגש ממוקד. בחרו את סוג העבודה שמעניין אתכם כדי להכיר את האפשרויות.</p>
      </header>
      <div className="grid md:grid-cols-2 gap-5 max-w-5xl">
        <Link to="/products/processes" className="group bg-brand-paper border border-brand-dark/10 p-8 md:p-10 hover:border-brand-accent hover:bg-white transition-colors">
          <p className="text-xs font-bold tracking-[0.16em] text-brand-accent mb-4">תהליך מתמשך</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">ייעוץ ותהליכים</h2>
          <p className="text-brand-muted leading-relaxed">פיתוח מנהלים וצוותים, שיפור ממשקים, שותפויות וליווי תהליכי שינוי.</p>
          <span className="inline-block mt-7 font-bold underline underline-offset-4">לכל התהליכים ←</span>
        </Link>
        <Link to="/products/workshops" className="group bg-brand-paper border border-brand-dark/10 p-8 md:p-10 hover:border-brand-accent hover:bg-white transition-colors">
          <p className="text-xs font-bold tracking-[0.16em] text-brand-accent mb-4">מפגשים ממוקדים</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">סדנאות והרצאות</h2>
          <p className="text-brand-muted leading-relaxed">נושאים ממוקדים, למידה והתנסות שמחוברים לאתגרים אמיתיים בעבודה.</p>
          <span className="inline-block mt-7 font-bold underline underline-offset-4">לכל הסדנאות וההרצאות ←</span>
        </Link>
      </div>
      <section className="mt-16 md:mt-20 bg-brand-dark text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-7">
        <div className="max-w-2xl"><h2 className="text-2xl md:text-3xl font-bold">לא בטוחים מה מתאים לאתגר שלכם?</h2><p className="text-white/70 leading-relaxed mt-3">אפשר להתחיל בשיחה קצרה, להבין מה קורה ולחשוב יחד מה יהיה נכון.</p></div>
        <Link to="/contact?topic=התייעצות%20ראשונית" className="inline-flex self-start md:self-auto px-6 py-3 bg-brand-touch text-white font-bold hover:bg-white hover:text-brand-dark transition-colors">בואו נדבר ←</Link>
      </section>
    </div>
  </main>;
};

export default ProductsPage;
