import React from 'react';
// ייבוא התמונה ישירות מהתיקייה שמעל (השורש)
import giladImage from '../gilad.jpg';

const About: React.FC = () => {
  const expertises = [
    {
      title: 'תהליכי פיתוח מנהיגות',
      desc: 'חיזוק יכולות המנהל ביום-יום הארגוני. אני לא כאן כדי להרצות, אלא כדי לעבוד יחד איתך על התוצאות העסקיות והאנושיות.'
    },
    {
      title: 'בניית שותפויות פנים וחוץ',
      desc: 'בניית ממשקי עבודה חזקים על בסיס מודל חמשת התנאים. שותפות אמיתית נבנית על אמון, בהירות ותוצאות.'
    },
    {
      title: 'פיתוח הנהלות בכירות',
      desc: 'גיבוש צוות ההנהלה ליחידה אחת מסונכרנת. קביעת כללי משחק ברורים שעובדים גם כשקשה, לא רק כשהכל הולך חלק.'
    },
    {
      title: 'ייעוץ ארגוני מערכתי',
      desc: 'ליווי שינויים עמוקים. אנחנו לא "מציירים" תרשימים, אנחנו מתאימים את הארגון למציאות משתנה ולנסיבות השטח.'
    },
    {
      title: 'ייעוץ אישי (Executive Coaching)',
      desc: 'ליווי אישי ודיסקרטי בצמתים קריטיים. חיזוק התפקוד הניהולי ואימון בדרכי פעולה חדשות שבאמת עובדות.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-16 animate-fadeIn space-y-20 pb-32 text-right">
      {/* Profile Header */}
      <section className="flex flex-col md:flex-row gap-12 items-center md:items-start border-b border-white/5 pb-16">
        
        {/* Photo Container */}
        <div className="relative shrink-0 group order-first md:order-last">
          <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full scale-110 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative w-48 h-48 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl z-10 bg-slate-800 flex items-center justify-center">
            <img 
              src={giladImage} 
              alt="גלעד קילון"
              className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.style.background = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
                  const initials = document.createElement('div');
                  initials.className = "absolute inset-0 flex items-center justify-center text-4xl font-black text-amber-500/40";
                  initials.innerText = "GK";
                  parent.appendChild(initials);
                }
              }}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 p-3 rounded-full shadow-xl z-20 font-black text-[10px] hidden md:flex items-center justify-center w-14 h-14 border-4 border-slate-950">
            20Y+
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px]">Your Partner for Growth</span>
            <h1 className="text-6xl font-black text-white tracking-tighter">גלעד קילון</h1>
            <h2 className="text-2xl font-bold text-slate-400">גישה ייעוצית • הון אנושי</h2>
          </div>
          
          <div className="space-y-6">
            <p className="text-2xl text-slate-200 leading-relaxed font-bold border-r-4 border-amber-500 pr-8">
              "אני לא ספק של שירותים, אני שותף לדרך. ב-20 השנים האחרונות למדתי ששינוי אמיתי קורה רק כשיורדים לשטח, מדברים בגובה העיניים ומפסיקים 'לשחק בכאילו'."
            </p>
            <p className="text-xl text-slate-400 leading-relaxed pr-9">
              אני מאמין בחיבור הוליסטי – בין העסקי לאנושי, ובין החזון למעשה. העבודה שלי היא לא להגיש דוחות יפים למגירה, אלא להיות איתך בצמתים הקריטיים ולוודא שהשינוי שסימנו באמת קורה. בלי קיצורי דרך ובלי סיסמאות ריקות.
            </p>
          </div>

          <div className="flex gap-8 items-center pt-4">
            <div className="text-center">
              <span className="block text-4xl font-black text-white">20</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">שנות ניסיון</span>
            </div>
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <div className="text-center">
              <span className="block text-4xl font-black text-white">MA</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">סוציולוגיה ארגונית</span>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Grid */}
      <section className="space-y-10">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] text-center">איך אנחנו מייצרים שינוי</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertises.map((exp, idx) => (
            <div key={idx} className="glass-card p-8 rounded-[2rem] border-white/5 hover:border-amber-500/30 transition-all group h-full flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-black text-amber-500 opacity-40 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                <h4 className="text-lg font-black text-white">{exp.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{exp.desc}</p>
              </div>
            </div>
          ))}
          
          <div className="glass-card p-8 rounded-[2rem] bg-cyan-brand/5 border-cyan-brand/20 flex flex-col justify-between h-full group">
              <div className="space-y-4">
                <span className="text-lg">🤖</span>
                <h4 className="text-lg font-black text-white">GenAI בשירות הפיתוח</h4>
                <p className="text-xs text-cyan-50/70 leading-relaxed font-medium">אנחנו רותמים את הטכנולוגיה כדי להפסיק לדבר ולהתחיל לעשות. ה-AI עוזר לנו לדייק את ההחלטות ולוודא שהזמן שלנו מושקע במקומות שבאמת מזיזים את המחט.</p>
              </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="glass-card rounded-[3rem] p-12 text-center bg-slate-950/50 border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-amber-500/5 blur-3xl opacity-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h3 className="text-2xl font-black text-white italic">בלי משחקים - פשוט תוצאות</h3>
          <p className="text-slate-400 text-lg leading-relaxed italic">
            "הייחודיות שלי היא היכולת לשלב בין מתודולוגיות בינלאומיות לבין הבנה עמוקה של הדינמיקה הישראלית. אני מחויב ליצור אצלכם שינוי אמיתי ופועל בביטחון תוך שותפות אמיתית עם לקוחותיי. כי בסוף, הכל מתחיל ונגמר באנשים."
          </p>
        </div>
      </section>

      <footer className="text-center pt-10 border-t border-white/5">
        <p className="text-slate-700 font-black uppercase tracking-[0.5em] text-[10px]">Gilad Kilon • Partner for Organizational Excellence • Since 2004</p>
      </footer>
    </div>
  );
};

export default About;