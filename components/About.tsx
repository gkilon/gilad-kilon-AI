
import React from 'react';

const About: React.FC = () => {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-brand-beige" dir="rtl">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto py-24 px-6 space-y-24 pb-48 text-right">

        {/* 1. Profile Title */}
        <section className="text-center space-y-8 animate-fadeIn">
          <div className="inline-block border-b-2 border-brand-accent pb-4">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.4em] block mb-2">About The Architect</span>
            <h1 className="text-5xl md:text-7xl font-black text-brand-dark tracking-tighter leading-none">
              קצת עליי.
            </h1>
          </div>
        </section>

        {/* 2. Personal Story Section */}
        <section className="flex flex-col md:flex-row-reverse items-start gap-16 animate-slideUp">

          {/* Profile Image Area */}
          <div className="relative shrink-0 w-full md:w-1/3">
            <div className="relative aspect-[3/4] overflow-hidden border border-brand-dark/10 group">
              <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-500 z-10"></div>
              <img
                src="profile.jpg"
                alt="גלעד קילון"
                className="absolute inset-0 w-full h-full object-cover z-0 filter grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>

            <button
              onClick={handleDownload}
              className="w-full mt-6 py-4 border border-brand-dark/20 text-brand-dark text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <span>הורדת פרופיל PDF</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-10">
            <div className="space-y-6 text-xl md:text-2xl text-brand-dark leading-relaxed font-light">
              <p>
                <span className="font-bold">גדלתי בקיבוץ בצפון </span>
                והשורשים האלה מלווים אותי בכל מהלך. עם השנים למדתי לקחת דברים מסוימים ולשחרר דברים אחרים, תובנה שעוזרת לי לזקק את העיקר מהטפל גם בעבודה עם הנהלות.
              </p>
              <p>
                היום אני גר בקיבוץ משמרות, נשוי למיכל ואבא לחמישה ילדים: שחר, זהר, אדר, עמר ואדם.
              </p>
              <p>
                הריצה בשדות באופן קבוע היא מנוע הצמיחה האישי שלי, ואני חובב ספורט מושבע – גם כשזה דורש ממני מאמץ בשטח וגם כשזה קורה על הכורסה מול המסך.
              </p>
              <p className="text-3xl font-black text-brand-dark pt-4">
                אני לא ספק שירות אלא שותף לדרך.
              </p>
              <p>
                אני מאמין ששינוי אמיתי קורה כשיורדים ללב הדברים ומפסיקים "לשחק בכאילו".
              </p>
            </div>

            <div className="pt-10 border-t border-brand-dark/10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex items-center gap-4 group">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-brand-dark/10 text-brand-muted group-hover:border-brand-accent group-hover:text-brand-accent transition-all">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm text-brand-dark">קיבוץ משמרות</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-brand-dark/10 text-brand-muted group-hover:border-brand-accent group-hover:text-brand-accent transition-all">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-sm text-brand-dark">ריצה | ספורט | נגינה | מוזיקה | שחמט</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Contact Footer */}
        <section className="text-center pt-24 border-t border-brand-dark/5 space-y-12">
          <h3 className="text-[10px] font-black text-brand-muted uppercase tracking-[0.5em]">DIRECT CONTACT</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-center items-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-brand-dark/5">

            <div className="flex flex-col items-center group py-4">
              <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-3 group-hover:text-brand-accent transition-colors">WhatsApp</span>
              <a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="text-lg font-black text-brand-dark hover:text-brand-accent transition-colors">Direct Chat</a>
            </div>

            <div className="flex flex-col items-center group py-4">
              <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-3 group-hover:text-brand-accent transition-colors">Phone</span>
              <a href="tel:+972526417512" className="text-lg font-black text-brand-dark hover:text-brand-accent transition-colors">052-6417512</a>
            </div>

            <div className="flex flex-col items-center group py-4">
              <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-3 group-hover:text-brand-accent transition-colors">Email</span>
              <a href="mailto:gilad@kilon.org" className="text-lg font-black text-brand-dark hover:text-brand-accent transition-colors">gilad@kilon.org</a>
            </div>

            <div className="flex flex-col items-center group py-4">
              <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest mb-3 group-hover:text-brand-accent transition-colors">LinkedIn</span>
              <a
                href="https://www.linkedin.com/in/giladkilon/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-brand-dark/10 rounded-full hover:border-brand-dark hover:bg-brand-dark group transition-all"
                title="LinkedIn"
              >
                <svg className="w-5 h-5 fill-brand-dark group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
