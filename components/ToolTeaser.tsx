
import React from 'react';

interface ToolTeaserProps {
  toolId: string;
  onLogin: () => void;
}

const toolInfo: Record<string, { title: string, subtitle: string, benefits: string[], icon: string }> = {
  dashboard: {
    title: "ניהול שינוי (WOOP)",
    subtitle: "למה רוב השינויים נכשלים? כי הם נשארים בגדר 'רצון'.",
    icon: "🎯",
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
    icon: "💎",
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
    icon: "📊",
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
    icon: "📋",
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
    icon: "💡",
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
    icon: "🧬",
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
    icon: "👁️‍🗨️",
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
    <div className="max-w-5xl mx-auto py-20 px-6 animate-fadeIn" dir="rtl">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        
        <div className="space-y-8 text-right">
          <div className="inline-block border-2 border-brand-dark px-4 py-1">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-dark">Preview Mode</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">{info.title}</h2>
            <p className="text-2xl text-brand-muted font-medium leading-relaxed italic border-r-4 border-brand-accent pr-6">{info.subtitle}</p>
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
              className="bg-brand-dark text-white px-12 py-5 font-black text-xl hover:bg-brand-accent transition-all shadow-xl active:scale-95"
            >
              התחבר לקבלת גישה מלאה
            </button>
            <a 
              href="mailto:gilad@kilon.co.il"
              className="border-2 border-brand-dark text-brand-dark px-12 py-5 font-black text-xl hover:bg-brand-dark hover:text-white transition-all text-center"
            >
              צור קשר לקבלת קוד
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] bg-brand-beige border-2 border-brand-dark shadow-[20px_20px_0px_#1a1a1a] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
             <div className="text-[150px] opacity-20 absolute -top-10 -left-10 select-none">{info.icon}</div>
             <div className="relative z-10 space-y-6">
                <div className="text-8xl mb-4">{info.icon}</div>
                <div className="space-y-2">
                   <p className="text-sm font-black uppercase tracking-widest text-brand-muted">The Professional Experience</p>
                   <p className="text-xl font-medium text-brand-dark">כדי לראות את הכלי בפעולה ולהתחיל לעבוד על המטרות שלך, יש להיכנס למערכת.</p>
                </div>
                <div className="w-16 h-1 bg-brand-accent mx-auto"></div>
                <p className="text-sm font-bold italic text-brand-muted">"פשטות. עומק. אנושיות."</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ToolTeaser;
