
import React from 'react';

const About: React.FC = () => {
  const expertises = [
    {
      title: 'פיתוח מנהיגות ומנהלים',
      desc: 'חיזוק יכולות המנהל ביום-יום הארגוני. אני לא כאן כדי להרצות, אלא כדי לעבוד יחד איתך על התוצאות העסקיות והאנושיות.',
      icon: '🏔️'
    },
    {
      title: 'ליווי הנהלות וארגונים',
      desc: 'גיבוש צוות ההנהלה ליחידה אחת מסונכרנת. קביעת כללי משחק ברורים שעובדים גם כשקשה, לא רק כשהכל הולך חלק.',
      icon: '🤝'
    },
    {
      title: 'ייעוץ ארגוני מערכתי',
      desc: 'ליווי שינויים עמוקים. אנחנו לא "מציירים" תרשימים, אנחנו מתאימים את הארגון למציאות משתנה ולנסיבות השטח.',
      icon: '🏗️'
    },
    {
      title: 'בניית שותפויות וממשקים',
      desc: 'בניית ממשקי עבודה חזקים על בסיס מודל חמשת התנאים. שותפות אמיתית נבנית על אמון, בהירות ותוצאות.',
      icon: '💎'
    },
    {
      title: 'ניהול בעידן הטכנולוגי',
      desc: 'הטמעת כלי עבודה מתקדמים כחלק אינטגרלי מהניהול. שימוש בטכנולוגיה ובינה מלאכותית כדי לפנות זמן למה שחשוב באמת - האנשים.',
      icon: '🤖'
    },
    {
      title: 'ייעוץ אישי (Coaching)',
      desc: 'ליווי אישי ודיסקרטי בצמתים קריטיים. חיזוק התפקוד הניהולי ואימון בדרכי פעולה חדשות שבאמת עובדות.',
      icon: '🎯'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 animate-fadeIn space-y-20 pb-32 text-right px-6" dir="rtl">
      
      {/* 1. Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter italic uppercase">
            גלעד קילון
          </h1>
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-amber-300">
              עבודה עם הנהלות | פיתוח מנהלים | ייעוץ ארגוני
            </h2>
            <p className="text-sm md:text-lg text-amber-300/70 font-bold uppercase tracking-tighter opacity-90">
              AI TOOLS FOR MANAGEMENT IN A FRANTIC WORLD
            </p>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4 pt-8 border-t border-white/5">
          <p className="text-2xl font-bold text-white leading-tight">
            אני לא ספק שירות אלא שותף לדרך, מישהו לרוץ איתו...
          </p>
          <p className="text-xl text-slate-300 font-medium leading-relaxed">
            אני מאמין ששינוי אמיתי קורה כשיורדים ללב הדברים ומפסיקים "לשחק בכאילו".
          </p>
        </div>
      </section>

      {/* 2. Expertise Grid */}
      <section className="space-y-12">
        <div className="flex items-center gap-4 justify-center">
           <div className="h-px bg-white/10 flex-1"></div>
           <span className="text-amber-300 font-bold uppercase tracking-widest text-[10px] whitespace-nowrap">Core Expertise</span>
           <div className="h-px bg-white/10 flex-1"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertises.map((exp, idx) => (
            <div key={idx} className="glass-card p-8 rounded-[2.5rem] border-white/5 hover:border-amber-300/30 transition-all group bg-slate-900/40 relative flex flex-col items-center text-center">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{exp.icon}</div>
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors">{exp.title}</h4>
              <p className="text-slate-400 leading-relaxed text-sm font-medium">{exp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Personal Section (Behind the Scenes) */}
      <section className="glass-card p-10 md:p-16 rounded-[4rem] border-white/5 bg-slate-950/50 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          
          {/* Profile Image Area */}
          <div className="relative shrink-0">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-[3rem] overflow-hidden border-2 border-white/10 shadow-2xl bg-slate-900 group">
              {/* THE FIX: Using a direct path string instead of import to avoid module errors */}
              <img 
                src="/gilad.jpg" 
                alt="גלעד קילון" 
                className="absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-500"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Visual placeholder shown only if image fails to load or file is missing */}
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-white z-10">
                <div className="text-6xl font-bold text-amber-300/20 tracking-tighter">GK</div>
                <span className="text-[9px] font-bold text-slate-500 mt-4 uppercase tracking-widest opacity-40 italic text-center px-4">
                  Gilad Kilon<br/>Strategic Partner
                </span>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-amber-300 text-slate-950 px-5 py-2 rounded-2xl font-bold text-[11px] uppercase tracking-tighter shadow-xl z-30">
              FOUNDER
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">מאחורי הקלעים</h3>
            <div className="space-y-4 text-lg md:text-xl text-slate-200 leading-relaxed font-bold">
              <p className="text-amber-300 font-bold text-2xl mb-2 drop-shadow-sm">
                עומק עם קלילות וחיוך ופשטות.
              </p>
              <p>
                גדלתי בקיבוץ בצפון והשורשים האלה מלווים אותי בכל מהלך. עם השנים למדתי לקחת דברים מסוימים ולשחרר דברים אחרים, תובנה שעוזרת לי לזקק את העיקר מהטפל גם בעבודה עם הנהלות.
              </p>
              <p>
                היום אני גר בקיבוץ משמרות, נשוי למיכל ואבא לחמישה ילדים: שחר, זהר, אדר, עמר ואדם. 
              </p>
              <p>
                הריצה בשדות באופן קבוע היא מנוע הצמיחה האישי שלי, ואני חובב ספורט מושבע – גם כשזה דורש ממני מאמץ בשטח וגם כשזה קורה על הכורסה מול המסך.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Contact Footer */}
      <div className="text-center pt-10 border-t border-white/5 space-y-8">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Ready for a meaningful change?</p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          <div className="flex flex-col items-center group">
             <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mb-2 group-hover:text-amber-300 transition-colors">Direct Line</span>
             <a href="tel:+972526417512" className="text-2xl font-bold text-white hover:text-amber-300 transition-colors tracking-tight">052-6417512</a>
          </div>
          <div className="flex flex-col items-center group">
             <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mb-2 group-hover:text-amber-300 transition-colors">Email</span>
             <a href="mailto:gilad@kilon.co.il" className="text-2xl font-bold text-white hover:text-amber-300 transition-colors tracking-tight">gilad@kilon.co.il</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
