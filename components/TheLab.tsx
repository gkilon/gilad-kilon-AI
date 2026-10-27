import React from 'react';
import { ToolEntry, Icons } from './Landing';

interface TheLabProps {
  onEnterTool: (view: string) => void;
  onBack?: () => void;
  isLoggedIn: boolean;
}

const TheLab: React.FC<TheLabProps> = ({ onEnterTool, onBack, isLoggedIn }) => {
  const tools = [
    { title: 'ניהול שינוי (WOOP)', desc: 'לחדד מטרה, לזהות מה עלול לעצור את ההתקדמות ולבחור צעדים מעשיים.', icon: <Icons.WOOP />, view: 'dashboard' },
    { title: 'פורום הנהלה (TOWS)', desc: 'לחבר בין המצב בשוק ליכולות הארגון ולגבש כיווני פעולה.', icon: <Icons.TOWS />, view: 'executive' },
    { title: 'דופק צוותי', desc: 'לקבל תמונה על תקשורת, אמון, מחויבות ובהירות בצוות.', icon: <Icons.Pulse />, view: 'synergy' },
    { title: 'ניהול משימות', desc: 'לרכז משימות אישיות וצוותיות ולעקוב אחרי מה שסוכם.', icon: <Icons.Tasks />, view: 'tasks' },
    { title: 'מעבדת רעיונות', desc: 'לרכז רעיונות ולחבר אותם לנושאים ולמהלכים שנמצאים בעבודה.', icon: <Icons.Ideas />, view: 'ideas' },
    { title: 'סגנונות תקשורת', desc: 'להבין סגנונות תקשורת שונים ולחשוב איך להתאים את הדרך שבה פונים לאחרים.', icon: <Icons.DNA />, view: 'communication' },
    { title: 'משוב 360', desc: 'לרכז נקודות מבט שונות ולזהות כיוונים להתפתחות אישית וניהולית.', icon: <Icons.Feedback />, view: 'feedback360' }
  ];

  return (
    <main className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl">
      <section className="border-b border-white/10 bg-brand-dark text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          {onBack && (
            <button onClick={onBack} className="mb-10 inline-flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors">
              <span aria-hidden="true">→</span> חזרה לאתר
            </button>
          )}
          <p className="text-sm font-bold text-brand-gold mb-4">כלים לעבודה עם מנהלים וצוותים</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">המעבדה</h1>
          <p className="mt-5 max-w-3xl text-lg md:text-xl leading-relaxed text-white/70">
            מרחב של כלים שפיתחתי לעבודה עם מנהלים, צוותי הנהלה וארגונים. אפשר להתנסות בכלים הזמינים, ולמשתמשים עם קוד גישה יש גם אפשרויות עבודה נוספות.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${isLoggedIn ? 'bg-emerald-50 text-emerald-800' : 'bg-white/10 text-white/75'}`}>
              <span className={`h-2 w-2 rounded-full ${isLoggedIn ? 'bg-emerald-600' : 'bg-brand-accent'}`} />
              {isLoggedIn ? 'גישה מלאה פעילה' : 'תצוגה והתנסות'}
            </span>
            {!isLoggedIn && <button onClick={() => onEnterTool('login')} className="text-sm font-bold underline underline-offset-4 text-white hover:text-brand-gold">כניסה עם קוד גישה</button>}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold">כלים במרחב העבודה</h2>
          <p className="mt-3 leading-relaxed text-brand-muted">כל כלי נועד לעזור להתמקד בשאלה ניהולית או ארגונית מסוימת, ולחבר בין החשיבה לבין הפעולה.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolEntry key={tool.view} title={tool.title} desc={tool.desc} icon={tool.icon} onClick={() => onEnterTool(tool.view)} />
          ))}
        </div>
        <div className="mt-12 border-t border-brand-dark/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm leading-relaxed text-brand-muted">חלק מהכלים מיועדים לשימוש במסגרת תהליכי ייעוץ, סדנאות ועבודה משותפת.</p>
          <a href="mailto:gilad@kilon.co.il?subject=שאלה%20על%20המעבדה" className="font-bold text-brand-accent hover:text-brand-dark transition-colors">שאלה על אחד הכלים? כתבו לי ←</a>
        </div>
      </section>
    </main>
  );
};

export default TheLab;
