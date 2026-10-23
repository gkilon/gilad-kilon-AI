
import React from 'react';
import { Icons } from './Landing';

interface ToolTeaserProps {
  toolId: string;
  onLogin: () => void;
}

const toolInfo: Record<string, { title: string, subtitle: string, benefits: string[], icon: React.ReactNode }> = {
  dashboard: {
    title: "ניהול שינוי (WOOP)",
    subtitle: "למה רוב השינויים נכשלים? כי הם נשארים בגדר 'רצון'.",
    icon: <Icons.WOOP />,
    benefits: [
      "הפיכת חזון למשימות אופרטיביות תוך דקות",
      "זיהוי חסמים פסיכולוגיים וארגוניים לפני שהם הופכים לבעיה",
      "ליווי AI צמוד שמדייק את הניסוחים והתוכנית שלך",
      "לוח מעקב אינטואיטיבי להתקדמות המהלך"
    ]
  },
  executive: {
    title: "פורום הנהלה (TOWS)",
    subtitle: "מעבר ממיפוי מצב (SWOT) לקבלת החלטות אסטרטגיות.",
    icon: <Icons.TOWS />,
    benefits: [
      "הצלבה חכמה בין חוזקות להזדמנויות חיצוניות",
      "גיבוש אסטרטגיות הגנה מפני איומים בשטח",
      "ייצור תוכנית עבודה הנהלתית מבוססת נתונים",
      "ארכיון החלטות אסטרטגיות ללמידה ארגונית"
    ]
  },
  synergy: {
    title: "דופק צוותי (Pulse)",
    subtitle: "איך הצוות שלך באמת מרגיש מתחת לפני השטח?",
    icon: <Icons.Pulse />,
    benefits: [
      "מדידת סנכרון ובהירות תפקידים בזמן אמת",
      "זיהוי מגמות שחיקה או חוסר מחויבות לפני פיצוץ",
      "ניתוח AI שמעניק למנהל שורה תחתונה ניהולית",
      "כלי אנונימי ופשוט שמעלה את רמת האמון בצוות"
    ]
  },
  tasks: {
    title: "ניהול משימות",
    subtitle: "הופכים החלטות לביצוע בשטח.",
    icon: <Icons.Tasks />,
    benefits: [
      "ניהול משימות צוותי ואישי בממשק אחד נקי",
      "תיעוד מהיר של משימות שעולות בפורום הנהלה",
      "סנכרון מלא עם מרחב העבודה שלך",
      "פשטות מקסימלית בלי 'רעש' מיותר"
    ]
  },
  ideas: {
    title: "מעבדת רעיונות",
    subtitle: "אל תיתן לרעיונות הטובים ביותר שלך ללכת לאיבוד.",
    icon: <Icons.Ideas />,
    benefits: [
      "הקלטה קולית ועיבוד טקסט חכם",
      "שיוך אוטומטי של רעיונות לפרויקטים קיימים",
      "סיכום אסטרטגי וגזירת צעדים באדיבות AI",
      "מקום מסודר לניהול היצירתיות הניהולית שלך"
    ]
  },
  communication: {
    title: "DNA תקשורת",
    subtitle: "אבחון מקצועי להבנת סגנון התקשורת וההנעה.",
    icon: <Icons.DNA />,
    benefits: [
      "זיהוי סגנון התקשורת הדומיננטי שלך",
      "טיפים פרקטיים לשיח עם סגנונות אחרים",
      "כלי שעוזר לצמצם חיכוך ואי-הבנות בצוות",
      "מבוסס על מודלים מוכחים בפיתוח ארגוני"
    ]
  },
  feedback360: {
    title: "משוב 360",
    subtitle: "לראות את עצמך דרך העיניים של הסביבה.",
    icon: <Icons.Feedback />,
    benefits: [
      "ניתוח פערים בין תפיסה עצמית למשוב חיצוני",
      "זיהוי נקודות עיוורון (Blind Spots) קריטיות",
      "בניית תוכנית פיתוח אישית מבוססת משוב",
      "תהליך דיסקרטי ומובנה לצמיחה ניהולית"
    ]
  }
};

const ToolTeaser: React.FC<ToolTeaserProps> = ({ toolId, onLogin }) => {
  const info = toolInfo[toolId] || toolInfo['dashboard'];

  return (
    <div className="max-w-7xl mx-auto py-16 md:py-24 px-6" dir="rtl">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        
        <div className="space-y-8 text-right">
          <div className="inline-block bg-brand-sage/25 px-4 py-2">
             <span className="text-xs font-bold text-brand-accent">Preview Mode</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">{info.title}</h2>
            <p className="text-xl md:text-2xl text-brand-muted leading-relaxed border-r-4 border-brand-touch pr-6">{info.subtitle}</p>
          </div>
          
          <ul className="space-y-4">
            {info.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-lg font-bold text-brand-dark">
                <span className="text-brand-accent mt-1">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onLogin}
              className="bg-brand-accent text-white px-8 py-4 font-bold text-lg hover:bg-brand-touch transition-colors active:scale-95"
            >
              התחבר לקבלת גישה מלאה
            </button>
            <a 
              href="mailto:gilad@kilon.co.il"
              className="border border-brand-dark/30 text-brand-dark px-8 py-4 font-bold text-lg hover:bg-brand-dark hover:text-white transition-colors text-center"
            >
              צור קשר לקבלת קוד
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] bg-brand-dark text-white border border-brand-dark/10 shadow-[12px_12px_0px_#D3A15D] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
             <div className="w-40 h-40 opacity-10 absolute -top-10 -left-10 select-none text-brand-dark">{info.icon}</div>
             <div className="relative z-10 space-y-6">
                <div className="w-24 h-24 mx-auto mb-4 text-brand-dark">{info.icon}</div>
                <div className="space-y-2">
                   <p className="text-sm font-bold text-brand-gold">The Professional Experience</p>
                   <p className="text-xl font-medium text-white/80">כדי לראות את הכלי בפעולה ולהתחיל לעבוד על המטרות שלך, יש להיכנס למערכת.</p>
                </div>
                <div className="w-16 h-1 bg-brand-touch mx-auto"></div>
                <p className="text-sm font-bold text-brand-gold">"פשטות. עומק. אנושיות."</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ToolTeaser;
