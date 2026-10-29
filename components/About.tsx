import React from 'react';
import portraitUrl from '../gilad-kilon-portrait.jpg';

const About: React.FC = () => {
  return <div className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl">
    <section className="border-b border-brand-dark/10 bg-brand-dark text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative"><img src={portraitUrl} alt="גלעד קילון" className="absolute left-8 top-10 w-32 h-32 md:w-40 md:h-40 rounded-full object-cover object-center border-4 border-brand-gold/40 shadow-xl" />
        <p className="text-xs font-bold tracking-[0.18em] text-brand-gold mb-5">מי אני ואיך אני עובד</p>
        <h1 className="text-4xl md:text-7xl font-bold leading-tight max-w-5xl relative">אני אוהב להבין אנשים ומערכות, ולמצוא דרך להפוך הבנה לעשייה.</h1>
        <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-3xl mt-8 relative">גלעד קילון · יועץ ארגוני, מפתח מנהלים ומלווה צוותי הנהלה · יותר מ־20 שנות ניסיון</p>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-[0.75fr_1.25fr] gap-12 md:gap-20 items-start">
      <div>
        <div className="aspect-[3/4] max-w-sm overflow-hidden bg-brand-paper border border-brand-dark/10">
          <img src="/profile.jpg" alt="גלעד קילון" className="w-full h-full object-cover" />
        </div>
        <div className="mt-5 text-sm text-brand-muted leading-relaxed">אוהב אנשים, מערכות מורכבות, שאלות טובות וריצה בשדות.</div>
      </div>
      <div className="space-y-7 text-lg md:text-xl leading-relaxed">
        <p>אני יועץ ארגוני כבר יותר מעשרים שנה, ועובד עם מנהלים וארגונים בתחומים שונים, מהייטק ותעשייה ועד שירותים, פיננסים ובריאות. אני גם מרצה באקדמיה. בעבודה עם ארגונים מעניינים אותי האנשים, המטרות שהם מנסים להשיג, והדרך שבה המבנה ותהליכי העבודה עוזרים להם או מקשים עליהם.</p>
        <p>אני מסתכל על התמונה הרחבה, אבל לא שוכח את האנשים שחיים בתוכה. אני שם לב למה שנאמר וגם למה שנשאר באוויר, ובודק איך תפקידים, אחריות, תהליכים וציפיות משפיעים על מה שקורה ביניהם.</p>
        <p>יש הרבה סיבות לפנות לייעוץ. מנהלת שרוצה להתפתח ולהרחיב את ההשפעה שלה, צוות הנהלה שצריך להפוך כיוון מוסכם לתוכנית עבודה, ארגון שגדל וצריך להתאים את המבנה שלו, או מנהלים ויחידות שמתקשים לעבוד יחד. לפעמים מתחילים מקונפליקט, ולפעמים דווקא משאיפה לצמוח או לעשות דברים טוב יותר. בכל מקרה, חשוב להבין מה קורה בפועל ומה יעזור להתקדם.</p>
        <p>אני לא מאמין שתהליך צריך להמשיך רק כי כך תוכנן מראש. צריך להקשיב למה שקורה, לדבר ישירות גם על דברים לא נוחים, ולמצוא דרך שאנשים יכולים לעבוד איתה. מבחינתי, כנות ורגישות לא סותרות זו את זו.</p>
        <blockquote className="border-r-4 border-brand-accent pr-6 py-2 text-2xl md:text-3xl font-bold leading-snug">להבין מה קורה. למצוא מה צריך להשתנות. להתחיל לעבוד אחרת.</blockquote>
        <p>אני גר בקיבוץ משמרות, נשוי ואבא לחמישה. אני אוהב לרוץ בשדות, לפנות את הראש ולחזור לדברים קצת יותר ברור. בעבודה אני מחפש את אותו הדבר: להבין מה חשוב, לא לסבך את מה שאפשר לומר בפשטות, ולמצוא צעד שאפשר לעשות.</p>
        <div className="pt-4 flex flex-wrap gap-3">
          <a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-brand-dark text-white font-bold hover:bg-brand-accent transition-colors">נדבר?</a>
          <a href="https://www.linkedin.com/in/giladkilon/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-brand-dark/20 font-bold hover:border-brand-dark transition-colors">LinkedIn</a>
        </div>
      </div>
    </section>
  </div>;
};

export default About;
