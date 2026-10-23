import React from 'react';

const About: React.FC = () => {
  return <div className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl">
    <section className="border-b border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <p className="text-xs font-bold tracking-[0.18em] text-brand-accent mb-5">מי אני ואיך אני עובד</p>
        <h1 className="text-4xl md:text-7xl font-black leading-tight max-w-5xl">אני אוהב להבין מה באמת קורה בין אנשים — ולמצוא דרך לשנות את זה.</h1>
        <p className="text-xl md:text-2xl text-brand-muted leading-relaxed max-w-3xl mt-8">גלעד קילון · יועץ ארגוני, מפתח מנהלים ומלווה צוותי הנהלה · יותר מ־20 שנות ניסיון</p>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-[0.75fr_1.25fr] gap-12 md:gap-20 items-start">
      <div>
        <div className="aspect-[3/4] max-w-sm overflow-hidden bg-white border border-brand-dark/10">
          <img src="/profile.jpg" alt="גלעד קילון" className="w-full h-full object-cover" />
        </div>
        <div className="mt-5 text-sm text-brand-muted leading-relaxed">אוהב אנשים, מערכות מורכבות, שאלות טובות וריצה בשדות.</div>
      </div>
      <div className="space-y-7 text-lg md:text-xl leading-relaxed">
        <p>אני יועץ ארגוני כבר יותר מעשרים שנה. לאורך הדרך עבדתי עם מנהלים וארגונים מעולמות שונים — מהייטק ותעשייה ועד שירותים, פיננסים ובריאות. אני מרצה באקדמיה, אבל העבודה שלי מתחילה הרבה לפני המודל או המצגת: במה שקורה בחדר, בין האנשים, ובין מה שהארגון מבקש מהם לבין מה שהוא מאפשר להם לעשות.</p>
        <p>הדרך שלי משלבת שתי נקודות מבט. מצד אחד, אני מסתכל על המערכת: מבנה, תפקידים, תהליכים, אחריות וציפיות. מצד שני, אני קשוב לאנשים — למה שנאמר, למה שלא נאמר, למתח, לציניות ולדברים שכולם מרגישים אבל עוד לא הצליחו לנסח.</p>
        <p>לא פעם מגיעים אליי בגלל קונפליקט בין שני מנהלים או בין יחידות. אנחנו מתחילים ממה שכואב, אבל לא עוצרים בהאשמה הדדית. בודקים מה מזין את הקושי, מה כל צד צריך, ואיזה שינוי ביחסים ובדרך העבודה יאפשר להתקדם.</p>
        <p>אני לא מאמין בפתרונות מדף או בתהליך שצריך להמשיך רק כי כך תוכנן מראש. אני מאמין בשיחה ישירה, באמון שנבנה תוך כדי עבודה, ובאמת שאפשר להגיד בלי להשפיל. לפעמים צריך לפתוח משהו לא נוח; תמיד צריך לעשות את זה באופן שמאפשר לאנשים להישאר בשיחה ולעבוד יחד.</p>
        <blockquote className="border-r-4 border-brand-touch pr-6 py-2 text-2xl md:text-3xl font-bold leading-snug">פותחים את מה שלא עובד, כדי שאפשר יהיה לבנות משהו שכן עובד.</blockquote>
        <p>אני גר בקיבוץ משמרות, נשוי ואבא לחמישה. הריצה בשדות עוזרת לי לפנות רעש ולחזור עם ראש נקי. כנראה שגם בעבודה אני מחפש משהו דומה: להבין מה העיקר, להישאר עם מה שקורה באמת, ולהתקדם צעד אחד שאפשר לעשות.</p>
        <div className="pt-4 flex flex-wrap gap-3">
          <a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-brand-dark text-white font-bold hover:bg-brand-accent transition-colors">נדבר?</a>
          <a href="https://www.linkedin.com/in/giladkilon/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-brand-dark/20 font-bold hover:border-brand-dark transition-colors">LinkedIn</a>
        </div>
      </div>
    </section>
  </div>;
};

export default About;
