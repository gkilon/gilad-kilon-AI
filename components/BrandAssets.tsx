
import React from 'react';
import { BrandLogo } from './Landing';

const BrandAssets: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto py-20 px-6 animate-fadeIn text-right" dir="rtl">
      
      <div className="flex justify-between items-center mb-16 border-b-4 border-brand-dark pb-8">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">נכסי מותג.</h1>
          <p className="text-brand-muted font-bold">כל הגרסאות המדויקות לשימוש במייל, במצגות ובמסמכים.</p>
        </div>
        <button onClick={onBack} className="text-brand-muted hover:text-brand-dark font-black text-xs uppercase tracking-widest border-b-2 border-brand-dark">חזרה לניהול ←</button>
      </div>

      <div className="grid gap-20">
        
        {/* 1. Email Signature */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black text-brand-accent uppercase tracking-widest border-r-4 border-brand-accent pr-4">1. חתימה למייל (Email Signature)</h2>
          <div className="studio-card p-12 bg-white border-brand-dark shadow-[12px_12px_0px_#1a1a1a]">
            <div className="flex flex-col md:flex-row items-center gap-12" dir="ltr">
              <BrandLogo size="md" />
              <div className="h-24 w-px bg-brand-dark/10 hidden md:block"></div>
              <div className="text-left font-medium text-brand-dark">
                <p className="text-2xl font-black tracking-tighter">GILAD KILON</p>
                <p className="text-[10px] font-bold tracking-[0.3em] text-brand-muted mb-4">MANAGEMENT CONSULTING</p>
                <div className="space-y-1 text-sm font-bold opacity-70">
                  <p>052-6417512 | gilad@kilon.co.il</p>
                  <p>www.kilon.co.il</p>
                  <p className="text-brand-accent">Strategic Depth. Business Simplicity.</p>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-brand-dark/5">
              <p className="text-xs text-brand-muted italic font-bold">המלצה: צלם מסך (Snipping Tool) את החלק הלבן והדבק בהגדרות החתימה ב-Outlook/Gmail.</p>
            </div>
          </div>
        </section>

        {/* 2. Presentation Logos */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black text-brand-accent uppercase tracking-widest border-r-4 border-brand-accent pr-4">2. לוגו למצגות (Dark & Light)</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Dark Variation */}
            <div className="studio-card p-16 bg-white border-brand-dark flex flex-col items-center justify-center gap-8 shadow-md">
              <BrandLogo size="md" dark={true} />
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">גרסה לרקע בהיר (PPT / PDF)</p>
            </div>
            {/* Light Variation */}
            <div className="studio-card p-16 bg-brand-dark border-brand-dark flex flex-col items-center justify-center gap-8 shadow-md">
              <BrandLogo size="md" dark={false} />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">גרסה לרקע כהה (שקפי פתיחה)</p>
            </div>
          </div>
        </section>

        {/* 3. Document Header Logo */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black text-brand-accent uppercase tracking-widest border-r-4 border-brand-accent pr-4">3. לוגו למסמכים (Letterhead)</h2>
          <div className="studio-card p-12 bg-white border-brand-dark shadow-sm">
            <div className="flex justify-start mb-20" dir="ltr">
               <BrandLogo size="sm" />
            </div>
            <div className="border-t-2 border-brand-dark/10 pt-8 space-y-4 opacity-10">
               <div className="h-4 w-3/4 bg-brand-dark"></div>
               <div className="h-4 w-1/2 bg-brand-dark"></div>
               <div className="h-4 w-2/3 bg-brand-dark"></div>
            </div>
            <p className="mt-10 text-xs text-brand-muted italic font-bold">גרסה מוקטנת ואלגנטית המתאימה לפינה השמאלית העליונה של דפי Word.</p>
          </div>
        </section>

        {/* 4. Large Branding Asset */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black text-brand-accent uppercase tracking-widest border-r-4 border-brand-accent pr-4">4. נכס מותג ענק (Web/Social)</h2>
          <div className="studio-card p-32 bg-brand-beige border-brand-dark flex items-center justify-center shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 opacity-5 bg-grid"></div>
             <BrandLogo size="lg" />
          </div>
        </section>

      </div>

      <div className="mt-32 p-16 border-4 border-brand-dark text-center space-y-4 bg-white">
         <p className="text-xl font-black italic">"הלוגו הוא לא רק סימן, הוא הבטחה לדיוק."</p>
         <p className="text-sm text-brand-muted font-bold">כל הגרסאות בודקו וסונכרנו לפי פרופורציית ה-Blue Dot החדשה.</p>
      </div>
    </div>
  );
};

export default BrandAssets;
