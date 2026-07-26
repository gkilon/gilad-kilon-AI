import React from 'react';
import { motion } from 'framer-motion';
import { ToolEntry, Icons } from './Landing';
import { FadeIn } from './motion/FadeIn';

interface TheLabProps {
  onEnterTool: (view: string) => void;
  onBack?: () => void;
  isLoggedIn: boolean;
}

const TheLab: React.FC<TheLabProps> = ({ onEnterTool, onBack, isLoggedIn }) => {
  return (
    <div className="min-h-screen bg-brand-beige" dir="rtl">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none z-0"></div>

      <div className="relative z-10 pt-20 pb-40 px-6 max-w-7xl mx-auto">

        {onBack && (
          <FadeIn delay={0.1}>
            <div className="mb-8 text-right">
              <motion.button
                onClick={onBack}
                className="flex items-center gap-2 text-brand-muted font-bold text-xs uppercase tracking-widest hover:text-brand-dark transition-all group mr-auto md:mr-0"
                whileHover={{ x: -4 }}
              >
                <span>חזרה לעמוד הראשי</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">←</span>
              </motion.button>
            </div>
          </FadeIn>
        )}

        {/* 1. Header */}
        <FadeIn delay={0.2}>
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 border-b border-brand-dark/10 pb-12">
            <div className="space-y-4 text-right">
              <motion.span 
                className="text-[11px] font-bold text-brand-accent uppercase tracking-[0.4em] block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                PROFESSIONAL WORKSPACE
              </motion.span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-brand-dark">המעבדה<span className="text-brand-accent">.</span></h1>
            </div>
            <motion.div 
              className="bg-brand-dark text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-3 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div 
                className={`w-2 h-2 rounded-full ${isLoggedIn ? 'bg-green-500' : 'bg-brand-gold animate-pulse'}`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              {isLoggedIn ? 'CONSULTING ACCESS' : 'STRATEGIC PREVIEW'}
            </motion.div>
          </div>
        </FadeIn>

        {/* 2. Professional Explanation */}
        <FadeIn delay={0.3} className="mb-24 text-right">
          <div className="max-w-4xl mr-0 space-y-8">
            <h2 className="text-3xl md:text-5xl font-light text-brand-dark tracking-tight leading-tight">
              המרחב שבו אסטרטגיה ניהולית <strong className="font-black">פוגשת בינה מלאכותית.</strong>
            </h2>
            <div className="flex gap-8">
              <motion.div 
                className="w-1 bg-brand-accent/30 self-stretch"
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 0.8, delay: 0.4 }}
              ></motion.div>
              <p className="text-xl text-brand-muted font-light leading-relaxed max-w-2xl">
                פיתחתי את הכלים האלו כדי לעזור לנו לזקק את העיקר בתוך הרעש הארגוני במהלך העבודה המשותפת.
                כל כלי כאן הוא זיקוק של עשרות שנים בשטח, המונגש דרך יכולות AI מתקדמות כדי לפנות זמן למה שחשוב באמת: האנשים והתוצאות.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* 3. Marketing Disclaimer (Guest Only) */}
        {!isLoggedIn && (
          <FadeIn delay={0.4} className="mb-24">
            <motion.div 
              className="bg-white border border-brand-dark/10 p-10 md:p-14 relative overflow-hidden group hover:border-brand-accent/50 transition-colors duration-500 shadow-sm hover:shadow-xl"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute top-0 right-0 w-2 h-full bg-brand-dark/5 group-hover:bg-brand-accent/20 transition-all"
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true }}
              ></motion.div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 text-right">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-3 text-brand-accent font-bold text-[10px] uppercase tracking-[0.3em]">
                    <span>Unlock Consultant Experience</span>
                  </div>

                  <h3 className="text-3xl font-black text-brand-dark tracking-tight">
                    בואו נהפוך את התובנות לביצועים.
                  </h3>

                  <p className="text-lg text-brand-muted font-light leading-relaxed">
                    הכלים כאן פתוחים לכם לשימוש והתנסות בגרסת "טעימה".
                    כדי לקבל את מלוא המעטפת המקצועית, לשמור נתונים ולהפעיל את סוכני ה-AI האישיים -
                    כל מה שצריך זה להזין את <span className="font-bold text-brand-dark border-b border-brand-accent">קוד הגישה שקיבלתם ממני</span>.
                  </p>
                </div>

                <div className="shrink-0 w-full lg:w-auto">
                  <motion.button
                    onClick={() => onEnterTool('login')}
                    className="w-full lg:w-auto bg-brand-dark text-white px-10 py-5 font-bold text-sm uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center justify-center gap-4 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>התחברות לגישה מלאה</span>
                    <motion.span 
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        )}

        {/* 4. Tool Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-dark/5 border border-brand-dark/5 shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ToolEntry
            title="ניהול שינוי (WOOP)"
            desc="להפוך רצונות לתוכנית עבודה אמיתית. ה-AI עוזר לנו לדייק את המכשולים ואת הצעדים הבאים."
            icon={<Icons.WOOP />}
            onClick={() => onEnterTool('dashboard')}
          />
          <ToolEntry
            title="פורום הנהלה (TOWS)"
            desc="כלי לקבלת החלטות על בסיס חיבור בין המצב בחוץ ליכולות שלכם בפנים."
            icon={<Icons.TOWS />}
            onClick={() => onEnterTool('executive')}
          />
          <ToolEntry
            title="דופק צוותי (Pulse)"
            desc="מדידה פשוטה של המצב בצוות - מחויבות, תקשורת ואמון. ה-AI נותן לנו שורה תחתונה ניהולית."
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
            desc="מקום לרשום או להקליט רעיונות. ה-AI יסכם אותם ויחבר אותם למה שאנחנו עושים עכשיו."
            icon={<Icons.Ideas />}
            onClick={() => onEnterTool('ideas')}
          />
          <ToolEntry
            title="DNA תקשורת"
            desc="אבחון מקצועי שעוזר להבין איך לדבר עם אחרים ולהניע אותם בצורה טובה יותר."
            icon={<Icons.DNA />}
            onClick={() => onEnterTool('communication')}
          />
          <ToolEntry
            title="משוב 360"
            desc="סיכום חכם של משוב מכמה כיוונים. עוזר לראות איפה אפשר להשתפר ומהן החוזקות."
            icon={<Icons.Feedback />}
            onClick={() => onEnterTool('feedback360')}
          />
        </motion.div>

        <motion.div 
          className="mt-24 text-center space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="h-px w-24 bg-brand-dark/10 mx-auto"></div>
          <p className="text-xl text-brand-dark font-light italic tracking-tight leading-relaxed max-w-2xl mx-auto">
            "הכלים האלה לא מחליפים את החשיבה שלך, הם עוזרים לה לקרות מהר יותר וטוב יותר."
          </p>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted/50 block pt-4">GK STRATEGIC LABORATORY v2.1</span>
        </motion.div>
      </div>
    </div>
  );
};

export default TheLab;

