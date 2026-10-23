import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type Offering = { slug: string; title: string; kind: string; description: string; detail: string; url?: string; group: 'unique' | 'workshop' };
const offerings: Offering[] = [
  { slug: 'obt', title: 'תהליך OBT להתפתחות אישית', kind: 'תהליך ייחודי', description: 'תהליך מובנה שעוזר להבין מה רוצים לשנות, מה עוצר את השינוי ואיך להתקדם בצעדים מעשיים.', detail: 'עבודה ממוקדת על מטרה משמעותית, על ההרגלים שמקשים להתקדם ועל הדרך לתרגל שינוי במציאות.', url: 'https://obt.kilon-consulting.com/', group: 'unique' },
  { slug: 'feedback', title: 'משוב שמייצר התפתחות', kind: 'תהליך ייחודי לארגונים', description: 'גישה אחרת לתהליך המשוב והערכת הביצועים, עם אחריות ברורה להתפתחות העובד ותפקיד תומך למנהל ולארגון.', detail: 'תהליך ארגוני שמחליף את ההסתפקות בשיחת הערכה שנתית בעבודה ממוקדת על התפתחות ושינוי לאורך זמן.', url: 'https://effervescent-gelato-193991.netlify.app/', group: 'unique' },
  { slug: 'communication-styles', title: 'סדנת סגנונות תקשורת', kind: 'סדנה', description: 'להבין איך אנשים שונים מתקשרים, מה מניע אותם ואיך להתאים את השיחה לאדם שמולנו.', detail: 'סדנה חווייתית על סגנונות תקשורת, עם שפה משותפת וכלים שאפשר לקחת לשיחות ולעבודה היומיומית.', group: 'workshop' },
  { slug: 'system-and-relationships', title: 'מערכת ויחסים: סדנת שותפויות', kind: 'סדנה', description: 'לעבוד על היחסים בין האנשים וגם על הממשקים, הציפיות ודרך העבודה שמאפשרים לשותפות להצליח.', detail: 'סדנה על החיבור בין מערכת היחסים לבין המערכת הארגונית: תפקידים, אחריות, תהליכים והסכמות בין שותפים ובין יחידות.', group: 'workshop' },
  { slug: 'negotiation-to-partnership', title: 'ממשא ומתן לבניית שותפויות', kind: 'הרצאה או סדנה', description: 'איך לעבור מהתמקדות במה שכל צד רוצה להשיג לבניית הסכמות ושותפויות שמחזיקות לאורך זמן.', detail: 'מפגש מעשי על ניהול משא ומתן מתוך ראייה רחבה יותר של היחסים והעבודה המשותפת אחרי שסוגרים את ההסכם.', group: 'workshop' },
  { slug: 'obt-capsule', title: 'קפסולת OBT', kind: 'חצי יום ממוקד', description: 'טעימה ממוקדת מתהליך OBT, שמחברת בין מטרה אישית לבין מה שעוצר את השינוי.', detail: 'מפגש של חצי יום להיכרות עם הגישה, להתנסות בזיהוי המתח בין הכוונה להתנהגות ולבחירת צעד ראשון לעבודה אישית.', group: 'workshop' },
  { slug: 'system-and-relationships-lecture', title: 'בין מערכת ליחסים', kind: 'הרצאה', description: 'איך המערכת והיחסים משפיעים זה על זה, ומה אפשר לעשות כדי לשפר את העבודה המשותפת.', detail: 'הרצאה על יחסים, ממשקים והאופן שבו תהליכים ארגוניים משפיעים על היכולת לעבוד יחד.', group: 'workshop' },
  { slug: 'technology-and-relationships', title: 'כשהטכנולוגיה משתגעת, מישהו צריך להישאר שפוי', kind: 'הרצאה', description: 'על אנשים, טכנולוגיה והיכולת לשמור על שיקול דעת וקשר אנושי בתוך שינוי מהיר.', detail: 'הרצאה שמחברת בין שינוי טכנולוגי, עבודה ארגונית והאתגר האנושי שנשאר גם כשהמערכות משתנות.', group: 'workshop' }
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
    <div className="mt-10 border-t border-brand-dark/10 pt-8 max-w-3xl"><p className="text-lg leading-relaxed">{selected.detail}</p><div className="mt-8 flex flex-wrap gap-4 items-center">
      {selected.url && <a href={selected.url} target="_blank" rel="noopener noreferrer" className="inline-flex px-6 py-3 bg-brand-dark text-white font-bold hover:bg-brand-accent transition-colors">לדף הנחיתה של התהליך ←</a>}
      <a href={`mailto:gilad@kilon.co.il?subject=${encodeURIComponent(selected.title)}`} className="inline-flex px-6 py-3 border border-brand-dark/20 font-bold hover:border-brand-dark transition-colors">לשיחה על הנושא ←</a>
    </div></div></div></main>;
  const renderItems = (items: Offering[]) => <div className="grid md:grid-cols-2 gap-4">{items.map(item => <button key={item.slug} onClick={() => navigate(`/products/${item.slug}`)} className="text-right bg-white border border-brand-dark/10 p-7 md:p-9 hover:border-brand-accent transition-colors"><p className="text-xs font-bold text-brand-accent mb-4">{item.kind}</p><h3 className="text-xl md:text-2xl font-bold mb-3">{item.title}</h3><p className="text-brand-muted leading-relaxed">{item.description}</p><span className="inline-block mt-6 font-bold underline underline-offset-4">לפרטים ←</span></button>)}</div>;
  return <main className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl"><div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
    <header className="max-w-4xl mb-14 md:mb-20"><p className="text-xs font-bold tracking-[0.18em] text-brand-accent mb-4">מוצרים, הרצאות וסדנאות</p><h1 className="text-4xl md:text-6xl font-black leading-tight">דרכים שונות לעבוד יחד.</h1><p className="text-lg md:text-2xl leading-relaxed text-brand-muted mt-6">שני תהליכים ייחודיים שפיתחתי, ולצדם הרצאות וסדנאות שאפשר להתאים לארגון ולקהל.</p></header>
    <section className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-6">תהליכים ייחודיים</h2>{renderItems(unique)}</section>
    <section><h2 className="text-2xl md:text-3xl font-bold mb-6">הרצאות וסדנאות</h2>{renderItems(workshops)}</section>
  </div></main>;
};
export default ProductsPage;
