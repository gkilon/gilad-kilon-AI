
import React from 'react';
import { ToolEntry } from './Landing';

interface TheLabProps {
  onEnterTool: (view: string) => void;
  isLoggedIn: boolean;
}

const TheLab: React.FC<TheLabProps> = ({ onEnterTool, isLoggedIn }) => {
  return (
    <div className="min-h-screen pt-20 pb-40 px-6 max-w-7xl mx-auto">
      
      {/* 1. הדר - כותרת המעבדה */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12 border-b-2 border-brand-dark pb-12">
        <div className="space-y-6 text-right">
          <span className="text-[13px] font-black text-brand-accent uppercase tracking-[0.6em]">PRACTICAL WORKSPACE</span>
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-none">המעבדה.</h1>
        </div>
        <div className="bg-brand-dark text-white px-10 py-5 text-[12px] font-black uppercase tracking-[0.3em] shadow-[8px_8px_0px_#2563eb] mb-2">
          {isLoggedIn ? 'PREMIUM ACCESS' : 'GUEST MODE'}
        </div>
      </div>

      {/* 2. הסבר פרקטי וישיר עם הבהרת הרשמה */}
      <section className="mb-20 space-y-12 text-right">
        <div className="max-w-4xl mr-0">
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark leading-tight mb-8">
            מרחב עבודה פרקטי <br/>
            <span className="text-brand-accent italic">עם כלים מבוססי AI.</span>
          </h2>
          <p className="text-xl md:text-2xl text-brand-muted font-bold leading-relaxed border-r-8 border-brand-accent pr-8 mb-12">
            כאן הניסיון שלי פוגש את הטכנולוגיה. אלו כלים פשוטים שעוזרים לך לנהל משימות, להבין מה קורה בצוות ולקבל החלטות טובות יותר. <br/>
            <span className="text-brand-dark font-black">שימו לב: כדי להשתמש בכלים, לשמור את המידע ולקבל ניתוח AI אישי, יש לפתוח מרחב עבודה (הרשמה קצרה).</span>
          </p>
        </div>

        {/* מדריך שימוש מהיר */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-brand-dark/10">
          <div className="space-y-4">
            <div className="text-brand-accent font-black text-4xl italic">01.</div>
            <h4 className="text-xl font-black">פותחים מרחב אישי</h4>
            <p className="text-brand-muted font-medium">נרשמים פעם אחת כדי שתוכלו לשמור את הנתונים שלכם ולעבוד בצורה מסודרת לאורך זמן.</p>
          </div>
          <div className="space-y-4">
            <div className="text-brand-accent font-black text-4xl italic">02.</div>
            <h4 className="text-xl font-black">בוחרים כלי ועובדים</h4>
            <p className="text-brand-muted font-medium">בוחרים את הכלי שמתאים לאתגר שלכם ומזינים את המחשבות או הנתונים בצורה חופשית.</p>
          </div>
          <div className="space-y-4">
            <div className="text-brand-accent font-black text-4xl italic">03.</div>
            <h4 className="text-xl font-black">מקבלים כיוון מה-AI</h4>
            <p className="text-brand-muted font-medium">הסוכן הדיגיטלי מנתח את מה שכתבתם, מציע ניסוחים מקצועיים ונותן צעדים פרקטיים לביצוע.</p>
          </div>
        </div>
      </section>

      {/* 3. באנר אורחים - מודגש יותר לגבי הצורך בהרשמה */}
      {!isLoggedIn && (
        <div className="mb-24 border-4 border-brand-dark bg-brand-beige p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 animate-fadeIn shadow-[15px_15px_0px_#2563eb]">
          <div className="space-y-6 text-right">
            <div className="inline-block bg-brand-dark text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">REGISTRATION REQUIRED</div>
            <h3 className="text-3xl md:text-5xl font-black text-brand-dark italic tracking-tighter leading-none">הכלים מחכים למרחב שלך.</h3>
            <p className="text-brand-muted text-xl font-bold italic max-w-2xl leading-relaxed">
              כרגע אפשר רק להתרשם מהכלים. כדי להתחיל להזין נתונים, להשתמש ב-AI ולנהל את המשימות שלכם, אתם צריכים לפתוח מרחב עבודה אישי (Login/Signup).
            </p>
          </div>
          <button 
            onClick={() => onEnterTool('login')}
            className="whitespace-nowrap bg-brand-accent text-white px-12 py-7 font-black text-xl uppercase tracking-widest hover:bg-brand-dark transition-all shadow-2xl active:scale-95 border-2 border-brand-dark"
          >
            פתח מרחב עבודה והתחל ←
          </button>
        </div>
      )}

      {/* 4. גריד הכלים */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ToolEntry 
          title="ניהול שינוי (WOOP)" 
          desc="להפוך רצונות לתוכנית עבודה אמיתית. ה-AI עוזר לך לדייק את המכשולים ואת הצעדים הבאים." 
          icon="🎯" 
          onClick={() => onEnterTool('dashboard')} 
        />
        <ToolEntry 
          title="פורום הנהלה (TOWS)" 
          desc="כלי שעוזר לקבל החלטות על בסיס חיבור בין המצב בחוץ ליכולות שלכם בפנים." 
          icon="💎" 
          onClick={() => onEnterTool('executive')} 
        />
        <ToolEntry 
          title="דופק צוותי (Pulse)" 
          desc="מדידה פשוטה של המצב בצוות - מחויבות, תקשורת ואמון. ה-AI נותן לך שורה תחתונה ניהולית." 
          icon="📊" 
          onClick={() => onEnterTool('synergy')} 
        />
        <ToolEntry 
          title="מעבדת רעיונות" 
          desc="מקום לרשום או להקליט רעיונות. ה-AI יסכם אותם ויחבר אותם למה שאתה עושה עכשיו." 
          icon="💡" 
          onClick={() => onEnterTool('ideas')} 
        />
        <ToolEntry 
          title="DNA תקשורת" 
          desc="אבחון פשוט שעוזר להבין איך לדבר עם אחרים ולהניע אותם בצורה טובה יותר." 
          icon="🧬" 
          onClick={() => onEnterTool('communication')} 
        />
        <ToolEntry 
          title="משוב 360" 
          desc="סיכום חכם של משוב מכמה כיוונים. עוזר לראות איפה אפשר להשתפר ומהן החוזקות שלך." 
          icon="👁️‍🗨️" 
          onClick={() => onEnterTool('feedback360')} 
        />
      </div>

      <div className="mt-32 p-16 border-4 border-brand-dark text-center space-y-8 italic bg-white shadow-[10px_10px_0px_rgba(0,0,0,0.05)]">
        <p className="text-2xl md:text-3xl text-brand-dark font-black tracking-tight leading-relaxed max-w-3xl mx-auto">
          "הכלים האלה לא מחליפים את החשיבה שלך, הם עוזרים לה לקרות מהר יותר וטוב יותר."
        </p>
        <div className="h-px w-24 bg-brand-accent mx-auto"></div>
        <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-muted">GK STRATEGIC LABORATORY v2.0</span>
      </div>
    </div>
  );
};

export default TheLab;
