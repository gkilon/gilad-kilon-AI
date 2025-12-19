
import React from 'react';

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
    <div className="max-w-6xl mx-auto py-16 animate-fadeIn space-y-24 pb-32 text-right">
      <section className="flex flex-col md:flex-row gap-20 items-center md:items-start border-b border-white/5 pb-24">
        <div className="relative shrink-0 order-last">
          <div className="relative w-[480px] h-[620px] rounded-[5rem] overflow-hidden border-2 border-white/10 shadow-2xl bg-slate-950 group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black flex flex-col items-center justify-center text-center p-16">
               <div className="w-40 h-40 bg-amber-500/10 rounded-full flex items-center justify-center mb-10 border border-amber-500/20">
                 <span className="text-9xl">🤵‍♂️</span>
               </div>
               <h3 className="text-6xl font-black text-white uppercase tracking-tighter leading-tight italic">GILAD<br/><span className="text-amber-500">KILON</span></h3>
            </div>
            <img src="./gilad.jpg" alt="גלעד קילון" className="absolute inset-0 w-full h-full object-cover grayscale-[10%] opacity-0 transition-opacity duration-1000" onLoad={(e) => (e.currentTarget.style.opacity = '1')} onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
          <div className="absolute -bottom-8 -left-8 bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl z-20 border-2 border-white/10 flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-5xl font-black text-amber-500 leading-none">20</span>
            <span className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Years of Vision</span>
          </div>
        </div>

        <div className="flex-1 space-y-12">
          <div className="space-y-6">
            <h1 className="text-8xl md:text-9xl font-black text-white tracking-tighter italic">גלעד קילון</h1>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-400 leading-tight">ליווי אסטרטגי • פיתוח הנהלות • מנהיגות בעידן ה-AI</h2>
          </div>
          <p className="text-4xl md:text-5xl text-slate-100 leading-[1.1] font-black border-r-8 border-amber-500 pr-12 italic tracking-tight">
            "אני לא ספק של שירותים, אני שותף לדרך. ב-20 השנים האחרונות למדתי ששינוי אמיתי קורה רק כשיורדים לשטח ומפסיקים לשחק בכאילו."
          </p>
        </div>
      </section>

      <section className="space-y-20">
        <h3 className="text-center text-base font-black text-slate-500 uppercase tracking-[0.8em] italic">תחומי המומחיות</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {expertises.map((exp, idx) => (
            <div key={idx} className="glass-card p-12 rounded-[4rem] border-white/5 hover:border-amber-500/30 transition-all group bg-slate-900/40 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-3xl font-black text-amber-500 leading-tight mb-6">{exp.title}</h4>
                <p className="text-xl text-slate-300 leading-relaxed font-bold italic">"{exp.desc}"</p>
              </div>
            </div>
          ))}
          <div className="glass-card p-12 rounded-[4rem] bg-cyan-brand/5 border-cyan-brand/20">
            <span className="text-6xl block mb-4">🤖</span>
            <h4 className="text-3xl font-black text-cyan-brand italic leading-tight">AI Augmented Leadership</h4>
            <p className="text-xl text-cyan-50/70 leading-relaxed font-bold">הטכנולוגיה לא מחליפה את הלב הניהולי, היא משכללת אותו. הכלים שפיתחנו כאן נועדו להעניק לך יתרון אסטרטגי.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
