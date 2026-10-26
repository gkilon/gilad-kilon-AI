import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

type Offering = { slug: string; title: string; kind: string; description: string; detail: string; url?: string; group: 'unique' | 'workshop' };
const offerings: Offering[] = [
  { slug: 'obt', title: 'תהליך OBT להתפתחות אישית', kind: 'תהליך ייחודי', description: 'תהליך אישי מובנה שעוזר לזהות מטרה משמעותית, להבין מה עוצר את השינוי ולתרגם תובנות לצעדים מעשיים.', detail: 'עבודה ממוקדת על מטרה משמעותית, על ההרגלים שמקשים להתקדם ועל הדרך לתרגל שינוי במציאות.', url: 'https://obt.kilon-consulting.com/', group: 'unique' },
  { slug: 'feedback', title: 'משוב שמייצר התפתחות', kind: 'תהליך ייחודי לארגונים', description: 'תהליך ארגוני שמעמיד את התפתחות העובד במרכז, ומגדיר מחדש את תפקיד העובד, המנהל והארגון בשיחת המשוב ובהמשך הדרך.', detail: 'תהליך ארגוני שמחליף את ההסתפקות בשיחת הערכה שנתית בעבודה ממוקדת על התפתחות ושינוי לאורך זמן.', url: 'https://effervescent-gelato-193991.netlify.app/', group: 'unique' },
  { slug: 'communication-styles', title: 'סדנת סגנונות תקשורת', kind: 'סדנה', description: 'כלים לזהות הבדלים בסגנונות תקשורת ולהבין איך הם משפיעים על שיחות, אי-הבנות ושיתוף פעולה.', detail: 'סדנה חווייתית על סגנונות תקשורת, עם שפה משותפת וכלים שאפשר לקחת לשיחות ולעבודה היומיומית.', group: 'workshop' },
  { slug: 'system-and-relationships', title: 'מערכת ויחסים: סדנת שותפויות', kind: 'סדנה', description: 'סדנה למנהלים ולשותפים שרוצים לשפר את העבודה המשותפת, לא רק את היחסים ביניהם אלא גם את הממשקים, התפקידים והציפיות.', detail: 'סדנה על החיבור בין מערכת היחסים לבין המערכת הארגונית: תפקידים, אחריות, תהליכים והסכמות בין שותפים ובין יחידות.', group: 'workshop' },
  { slug: 'negotiation-to-partnership', title: 'ממשא ומתן לבניית שותפויות', kind: 'הרצאה או סדנה', description: 'מפגש על ניהול משא ומתן שמביא בחשבון גם את ההסכם וגם את מערכת היחסים ואת השותפות שתידרש אחריו.', detail: 'מפגש מעשי על ניהול משא ומתן מתוך ראייה רחבה יותר של היחסים והעבודה המשותפת אחרי שסוגרים את ההסכם.', group: 'workshop' },
  { slug: 'obt-capsule', title: 'קפסולת OBT', kind: 'חצי יום ממוקד', description: 'מפגש היכרות מרוכז עם גישת OBT, שמאפשר להתנסות בזיהוי מטרה אישית והגורמים שמקשים להתקדם אליה.', detail: 'מפגש של חצי יום להיכרות עם הגישה, להתנסות בזיהוי המתח בין הכוונה להתנהגות ולבחירת צעד ראשון לעבודה אישית.', group: 'workshop' },
  { slug: 'system-and-relationships-lecture', title: 'בין מערכת ליחסים: מבנה, פונקציות ואנשים', kind: 'הרצאה משולבת', description: 'הרצאה שמחברת בין שותפויות וסגנונות תקשורת, ובין מה שקורה בין אנשים לבין המבנה והכוחות שמעצבים את העבודה המשותפת.', detail: 'באמצעות דוגמאות וכלים מעשיים, נבחן איך מבנה ארגוני, תהליכי עבודה וממשקים פוגשים תקשורת, הקשבה, אמון וקונפליקטים. המטרה היא להבין טוב יותר מה משפיע על שיתוף הפעולה, ומה אפשר לעשות אחרת.', group: 'workshop' },
  { slug: 'technology-and-relationships', title: 'כשהטכנולוגיה משתגעת, מישהו צריך להישאר שפוי', kind: 'הרצאה', description: 'הרצאה על האתגר האנושי בתוך שינוי טכנולוגי: איך לשמור על שיקול דעת, תקשורת וקשר גם כשהמערכות משתנות.', detail: 'מפגש שמחבר בין טכנולוגיה, עבודה ארגונית והתגובות האנושיות לשינוי. מתאים לארגונים שרוצים לדבר על ההשפעה של הטכנולוגיה על הדרך שבה אנחנו עובדים יחד.', group: 'workshop' }
];

const ProductsPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const selected = offerings.find(item => item.slug === slug);
  const unique = offerings.filter(item => item.group === 'unique');
  const workshops = offerings.filter(item => item.group === 'workshop');
  if (slug && !selected) return <main className="min-h-screen bg-brand-beige px-6 py-24 text-center" dir="rtl"><h1 className="text-3xl font-bold">לא מצאתי את הפריט הזה</h1><button onClick={() => navigate('/products')} className="mt-6 underline">לכל המוצרים והסדנאות</button></main>;
  if (selected) return <main className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl"><div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
    <button onClick={() => navigate('/products')} className="text-sm font-bold text-brand-muted hover:text-brand-dark mb-10">← לכל המוצרים והסדנאות</button>
    <p className="text-xs font-bold text-brand-accent mb-4">{selected.kind}</p><h1 className="text-4xl md:text-6xl font-black leading-tight max-w-4xl">{selected.title}</h1>
    <p className="text-xl md:text-2xl leading-relaxed text-brand-muted mt-7 max-w-3xl">{selected.description}</p>
    <div className="mt-10 border-t border-brand-dark/10 pt-8 max-w-3xl"><p className="text-lg leading-relaxed">{selected.detail}</p><div className="mt-8 flex flex-wrap gap-3 items-center">
      {selected.url && <a href={selected.url} target="_blank" rel="noopener noreferrer" className="inline-flex px-6 py-3 bg-brand-accent text-white font-bold hover:bg-brand-touch transition-colors">להיכרות עם התהליך ←</a>}
      <Link to={`/contact?topic=${encodeURIComponent(selected.title)}`} className="inline-flex px-6 py-3 border border-brand-dark/20 font-bold hover:border-brand-dark transition-colors">לפרטים נוספים ולשיחה ←</Link>
    </div></div></div></main>;
  const renderItems = (items: Offering[]) => <div className="grid md:grid-cols-2 gap-4">{items.map(item => <button key={item.slug} onClick={() => navigate(`/products/${item.slug}`)} className="text-right bg-brand-paper border border-brand-dark/10 p-7 md:p-9 hover:border-brand-accent hover:bg-white transition-colors"><p className="text-xs font-bold text-brand-accent mb-4">{item.kind}</p><h3 className="text-xl md:text-2xl font-bold mb-3">{item.title}</h3><p className="text-brand-muted leading-relaxed">{item.description}</p><span className="inline-block mt-6 font-bold underline underline-offset-4">לפרטים נוספים ←</span></button>)}</div>;
  return <main className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl"><div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
    <header className="max-w-4xl mb-14 md:mb-20 border-r-4 border-brand-touch pr-6 md:pr-8"><p className="text-xs font-bold tracking-[0.18em] text-brand-accent mb-4">מוצרים, הרצאות וסדנאות</p><h1 className="text-4xl md:text-6xl font-black leading-tight">דרכים שונות לעבוד יחד.</h1><p className="text-lg md:text-2xl leading-relaxed text-brand-muted mt-6">כאן תמצאו תהליכים שפיתחתי לצד הרצאות וסדנאות. לכל אחד יש מטרה אחרת, ואפשר לבחור את הפורמט שמתאים לצורך של הארגון.</p></header>
    <section className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-6">תהליכים ייחודיים</h2>{renderItems(unique)}</section>
    <section><h2 className="text-2xl md:text-3xl font-bold mb-6">הרצאות וסדנאות</h2>{renderItems(workshops)}</section>
  </div></main>;
};
export default ProductsPage;
