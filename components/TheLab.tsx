
import React from 'react';
import { ToolEntry } from './Landing';

interface TheLabProps {
  onEnterTool: (view: string) => void;
  isLoggedIn: boolean;
}

const TheLab: React.FC<TheLabProps> = ({ onEnterTool, isLoggedIn }) => {
  return (
    <div className="min-h-screen pt-20 pb-40 px-6 max-w-7xl mx-auto">
      {/* Marketing Banner */}
      {!isLoggedIn && (
        <div className="mb-16 border-4 border-brand-accent bg-white p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 animate-fadeIn shadow-[20px_20px_0px_rgba(37,99,235,0.1)]">
          <div className="space-y-6 text-right">
            <div className="inline-block bg-brand-accent text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">LAB PREVIEW</div>
            <h3 className="text-3xl md:text-5xl font-black text-brand-dark italic tracking-tighter">זו רק טעימה מהמעבדה האסטרטגית.</h3>
            <p className="text-brand-muted text-xl font-bold italic max-w-2xl leading-relaxed">
              הכלים פתוחים כרגע לצפייה במצב גנרי. למשתמשים רשומים יש גישה לכלים המלאים, שמירת נתונים לאורך זמן, וניתוח AI אישי המחובר לאסטרטגיה שלכם.
            </p>
          </div>
          <button 
            onClick={() => onEnterTool('login')}
            className="whitespace-nowrap bg-brand-dark text-white px-12 py-6 font-black text-xl uppercase tracking-widest hover:bg-brand-accent transition-all shadow-2xl active:scale-95"
          >
            פתח מרחב עבודה מלא ←
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 border-b-2 border-brand-dark pb-16">
        <div className="space-y-6 text-right">
          <span className="text-[13px] font-black text-brand-accent uppercase tracking-[0.6em]">THE LABORATORY</span>
          <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none">המעבדה.</h1>
          <p className="text-xl text-brand-muted font-medium max-w-xl leading-relaxed">
            כאן הניסיון הניהולי שלי פוגש את הטכנולוגיה. כלים אסטרטגיים שנועדו להפוך מורכבות לפשטות ביצועית ולקבלת החלטות מבוססת נתונים.
          </p>
        </div>
        <div className="bg-brand-dark text-white px-10 py-5 text-[12px] font-black uppercase tracking-[0.3em] shadow-[8px_8px_0px_#2563eb]">
          {isLoggedIn ? 'PREMIUM ACCESS ACTIVE' : 'GUEST PREVIEW MODE'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ToolEntry 
          title="ניהול שינוי (WOOP)" 
          desc="מתודולוגיה מדעית להפיכת רצונות לתוכניות עבודה אופרטיביות. הכלי כולל סוכן AI שמדייק איתך את המכשולים והתוכנית." 
          icon="🎯" 
          onClick={() => onEnterTool('dashboard')} 
        />
        <ToolEntry 
          title="פורום הנהלה (TOWS)" 
          desc="ניתוח אסטרטגי מתקדם המצליב בין גורמי פנים וחוץ כדי לגזור אסטרטגיות צמיחה, הגנה ושיפור מיידיות." 
          icon="💎" 
          onClick={() => onEnterTool('executive')} 
        />
        <ToolEntry 
          title="דופק צוותי (Pulse)" 
          desc="מדידה שוטפת של רמת הסנכרון, המחויבות והאווירה בצוות. מאפשר זיהוי מגמות וקבלת תובנות AI על מצב הצוות." 
          icon="📊" 
          onClick={() => onEnterTool('synergy')} 
        />
        <ToolEntry 
          title="מעבדת רעיונות" 
          desc="מקום לרישום והקלטה של רעיונות גולמיים. ה-AI ינתח אותם, יסווג ויחבר אותם לפרויקטים הקיימים שלך באופן אוטומטי." 
          icon="💡" 
          onClick={() => onEnterTool('ideas')} 
        />
        <ToolEntry 
          title="DNA תקשורת" 
          desc="אבחון מעמיק של סגנונות תקשורת ניהוליים. עוזר להבין איך להניע אחרים ולשפר ממשקים בארגון." 
          icon="🧬" 
          onClick={() => onEnterTool('communication')} 
        />
        <ToolEntry 
          title="משוב 360" 
          desc="סינתזה חכמה של משוב מרובת מקורות. מזהה נקודות עיוורון ומגבש תוכנית פעולה אינטגרטיבית לדיוק המנהל." 
          icon="👁️‍🗨️" 
          onClick={() => onEnterTool('feedback360')} 
        />
      </div>

      <div className="mt-32 p-16 border-2 border-brand-dark/10 text-center space-y-8 italic bg-white/50">
        <p className="text-2xl text-brand-dark font-black tracking-tight leading-relaxed max-w-2xl mx-auto">
          "הכלים האלה הם לא תחליף לחשיבה ניהולית, הם המאיץ שלה. הם נועדו לפנות לך זמן למה שחשוב באמת - האנשים."
        </p>
        <div className="h-px w-20 bg-brand-dark mx-auto"></div>
        <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-muted">GK STRATEGIC LAB</span>
      </div>
    </div>
  );
};

export default TheLab;
