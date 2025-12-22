
import React from 'react';
import { ToolEntry, Icons } from './Landing';

interface TheLabProps {
  onEnterTool: (view: string) => void;
  onBack?: () => void;
  isLoggedIn: boolean;
}

const TheLab: React.FC<TheLabProps> = ({ onEnterTool, onBack, isLoggedIn }) => {
  return (
    <div className="min-h-screen pt-20 pb-40 px-6 max-w-7xl mx-auto">
      
      {onBack && (
        <div className="mb-8 text-right">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-brand-muted font-black text-sm uppercase tracking-widest hover:text-brand-dark transition-all group mr-auto md:mr-0"
          >
            <span>חזרה לעמוד הראשי</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">←</span>
          </button>
        </div>
      )}

      {/* 1. הדר - כותרת המעבדה */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12 border-b-2 border-brand-dark pb-12">
        <div className="space-y-6 text-right">
          <span className="text-[13px] font-black text-brand-accent uppercase tracking-[0.6em]">PRACTICAL WORKSPACE</span>
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-none">המעבדה<span className="text-brand-accent">.</span></h1>
        </div>
        <div className="bg-brand-dark text-white px-10 py-5 text-[12px] font-black uppercase tracking-[0.3em] shadow-[8px_8px_0px_var(--brand-accent)] mb-2">
          {isLoggedIn ? 'PREMIUM ACCESS' : 'STRATEGIC PREVIEW'}
        </div>
      </div>

      {/* 2. הסבר מקצועי מודגש (הועבר למעלה) */}
      <section className="mb-16 text-right animate-fadeIn">
        <div className="max-w-5xl mr-0 space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark italic leading-tight">
            המרחב שבו אסטרטגיה ניהולית פוגשת בינה מלאכותית.
          </h2>
          <p className="text-xl md:text-3xl text-brand-muted font-medium leading-relaxed border-r-8 border-brand-accent pr-8 py-2 italic">
            פיתחתי את הכלים האלו כדי לעזור לך לזקק את העיקר בתוך הרעש הארגוני. 
            כל כלי כאן הוא זיקוק של עשרות שנים בשטח, המונגש דרך יכולות AI מתקדמות כדי לפנות לך זמן למה שחשוב באמת: האנשים והתוצאות.
          </p>
        </div>
      </section>

      {/* 3. דיסקליימר שיווקי ומזמין (רק לאורחים) */}
      {!isLoggedIn && (
        <section className="mb-20 animate-fadeIn">
          <div className="studio-card p-10 md:p-14 border-[4px] border-brand-dark bg-white shadow-[15px_15px_0px_var(--brand-accent)] relative overflow-hidden group">
            {/* Background design element */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-accent/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 text-right">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 text-brand-accent font-black text-[10px] uppercase tracking-[0.4em] mb-2">
                   <span>Unlock Full Experience</span>
                   <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></div>
                </div>
                
                <h3 className="text-2xl md:text-4xl font-black text-brand-dark italic tracking-tight">
                  בואו נהפוך את התובנות לביצועים.
                </h3>
                
                <p className="text-lg md:text-xl text-brand-muted font-bold leading-relaxed">
                  הכלים כאן פתוחים לכם לשימוש והתנסות בגרסת "טעימה". 
                  כדי לקבל את מלוא המעטפת המקצועית, לשמור נתונים ולהפעיל את סוכני ה-AI האישיים - 
                  כל מה שצריך זה להזין את <span className="text-brand-dark border-b-2 border-brand-accent">קוד הגישה שקיבלתם ממני</span>.
                </p>
              </div>

              <div className="shrink-0 w-full lg:w-auto">
                <button 
                  onClick={() => onEnterTool('login')}
                  className="w-full lg:w-auto bg-brand-dark text-white px-12 py-7 font-black text-xl uppercase tracking-widest hover:bg-brand-accent transition-all shadow-xl active:scale-95 border-4 border-brand-dark flex items-center justify-center gap-4"
                >
                  <span>התחברות לגישה מלאה</span>
                  <span className="text-2xl">🗝️</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. גריד הכלים */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
        <ToolEntry 
          title="ניהול שינוי (WOOP)" 
          desc="להפוך רצונות לתוכנית עבודה אמיתית. ה-AI עוזר לך לדייק את המכשולים ואת הצעדים הבאים." 
          icon={<Icons.WOOP />} 
          onClick={() => onEnterTool('dashboard')} 
        />
        <ToolEntry 
          title="פורום הנהלה (TOWS)" 
          desc="כלי שעוזר לקבל החלטות על בסיס חיבור בין המצב בחוץ ליכולות שלכם בפנים." 
          icon={<Icons.TOWS />} 
          onClick={() => onEnterTool('executive')} 
        />
        <ToolEntry 
          title="דופק צוותי (Pulse)" 
          desc="מדידה פשוטה של המצב בצוות - מחויבות, תקשורת ואמון. ה-AI נותן לך שורה תחתונה ניהולית." 
          icon={<Icons.Pulse />} 
          onClick={() => onEnterTool('synergy')} 
        />
        <ToolEntry 
          title="ניהול משימות" 
          desc="מרכז הבקרה לביצוע השוטף. ניהול משימות פשוט, מהיר ואפקטיבי לצוות ולארגון." 
          icon={<Icons.Tasks />} 
          onClick={() => onEnterTool('tasks')} 
        />
        <ToolEntry 
          title="מעבדת רעיונות" 
          desc="מקום לרשום או להקליט רעיונות. ה-AI יסכם אותם ויחבר אותם למה שאתה עושה עכשיו." 
          icon={<Icons.Ideas />} 
          onClick={() => onEnterTool('ideas')} 
        />
        <ToolEntry 
          title="DNA תקשורת" 
          desc="אבחון פשוט שעוזר להבין איך לדבר עם אחרים ולהניע אותם בצורה טובה יותר." 
          icon={<Icons.DNA />} 
          onClick={() => onEnterTool('communication')} 
        />
        <ToolEntry 
          title="משוב 360" 
          desc="סיכום חכם של משוב מכמה כיוונים. עוזר לראות איפה אפשר להשתפר ומהן החוזקות שלך." 
          icon={<Icons.Feedback />} 
          onClick={() => onEnterTool('feedback360')} 
        />
      </div>

      <div className="mt-32 p-16 border-4 border-brand-dark text-center space-y-8 italic bg-white shadow-[10px_10px_0px_var(--brand-accent)]">
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
