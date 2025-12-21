
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-24 animate-fadeIn space-y-24 pb-48 text-right px-6" dir="rtl">
      
      {/* 1. Profile Title */}
      <section className="text-center space-y-8">
        <div className="inline-block border-2 border-brand-dark p-8 shadow-[8px_8px_0px_#1a1a1a] bg-white">
          <h1 className="text-5xl md:text-8xl font-black text-brand-dark tracking-tighter italic uppercase leading-none">
            קצת עליי.
          </h1>
        </div>
      </section>

      {/* 2. Personal Story Section */}
      <section className="flex flex-col md:flex-row-reverse items-start gap-16">
        
        {/* Profile Image Area - Using ONLY local profile.jpg with NO filters */}
        <div className="relative shrink-0 w-full md:w-1/3">
          <div className="relative aspect-square md:aspect-[3/4] overflow-hidden border-2 border-brand-dark shadow-[12px_12px_0px_#1a1a1a] bg-white">
            <img 
              src="profile.jpg" 
              alt="גלעד קילון" 
              className="absolute inset-0 w-full h-full object-cover z-0"
              style={{ filter: 'none' }}
            />
          </div>
        </div>

        <div className="flex-1 space-y-10">
          <div className="space-y-6 text-xl md:text-2xl text-brand-dark leading-relaxed font-medium">
            <p className="text-brand-accent font-black text-3xl md:text-4xl italic mb-8 border-r-4 border-brand-accent pr-6">
              "עומק עם קלילות וחיוך ופשטות."
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
            <p>
              אני לא ספק שירות אלא שותף לדרך, מישהו לרוץ איתו. אני מאמין ששינוי אמיתי קורה כשיורדים ללב הדברים ומפסיקים "לשחק בכאילו".
            </p>
          </div>
          
          <div className="pt-10 border-t border-brand-dark/10 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-brand-dark/5 rounded-full">
                <svg className="w-5 h-5 fill-brand-muted" viewBox="0 0 24 24">
                  <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-lg">קיבוץ משמרות</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-brand-dark/5 rounded-full">
                <svg className="w-5 h-5 fill-brand-muted" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-lg">ריצה | ספורט | נגינה | מוזיקה | שחמט</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Contact Footer */}
      <section className="text-center pt-16 border-t border-brand-dark/20 space-y-10">
        <h3 className="text-[10px] font-black text-brand-muted uppercase tracking-[0.5em]">KEEP IN TOUCH</h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <div className="flex flex-col items-center group">
             <span className="text-[9px] font-bold text-brand-muted uppercase tracking-tighter mb-2 group-hover:text-brand-accent transition-colors">WhatsApp</span>
             <a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="text-xl md:text-3xl font-black text-brand-accent hover:text-brand-dark transition-colors tracking-tighter">Direct Chat</a>
          </div>

          <div className="flex flex-col items-center group">
             <span className="text-[9px] font-bold text-brand-muted uppercase tracking-tighter mb-2 group-hover:text-brand-accent transition-colors">Direct Line</span>
             <a href="tel:+972526417512" className="text-xl md:text-3xl font-black text-brand-dark hover:text-brand-accent transition-colors tracking-tighter">052-6417512</a>
          </div>
          
          <div className="flex flex-col items-center group">
             <span className="text-[9px] font-bold text-brand-muted uppercase tracking-tighter mb-2 group-hover:text-brand-accent transition-colors">Email</span>
             <a href="mailto:gilad@kilon.co.il" className="text-xl md:text-3xl font-black text-brand-dark hover:text-brand-accent transition-colors tracking-tighter">gilad@kilon.co.il</a>
          </div>

          <div className="flex flex-col items-center group">
             <span className="text-[9px] font-bold text-brand-muted uppercase tracking-tighter mb-2 group-hover:text-brand-accent transition-colors">LinkedIn</span>
             <a 
               href="https://www.linkedin.com/in/giladkilon/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="p-2 border border-brand-dark hover:bg-brand-dark group transition-all"
               title="LinkedIn"
             >
               <svg className="w-5 h-5 fill-brand-dark group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                 <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
               </svg>
             </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
