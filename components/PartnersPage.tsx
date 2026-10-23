
import React, { useEffect, useState } from 'react';
import { getSystemConfig } from '../firebase';
import { Collaboration } from '../types';

const PartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystemConfig().then(config => {
      setPartners(config.collaborations || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-16 md:py-24 space-y-16 pb-32 text-right px-6" dir="rtl">
      
      <section className="max-w-4xl space-y-6 border-r-4 border-brand-touch pr-6 md:pr-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-brand-dark leading-tight">
            שיתופי פעולה.
          </h1>
        </div>
        <p className="text-lg md:text-2xl text-brand-muted max-w-3xl leading-relaxed">
          "חיבורים מקצועיים, כלים מתקדמים ושותפויות שמרחיבות את גבולות האפשר."
        </p>
      </section>

      <section className="grid gap-12 md:grid-cols-2">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
             <div className="w-12 h-12 border-4 border-brand-dark border-t-brand-accent rounded-full animate-spin"></div>
          </div>
        ) : partners.length > 0 ? (
          partners.map(partner => (
            <div key={partner.id} className="p-7 md:p-9 bg-brand-paper border border-brand-dark/10 flex flex-col md:flex-row gap-6 items-center md:items-start group transition-colors hover:border-brand-accent">
              <div className="w-28 h-28 shrink-0 bg-brand-sage/20 border border-brand-dark/10 flex items-center justify-center p-4">
                <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="flex-1 space-y-4 text-center md:text-right">
                <div className="flex items-center gap-3 justify-center md:justify-end">
                   <h3 className="text-2xl font-bold text-brand-dark group-hover:text-brand-accent transition-colors">{partner.name}</h3>
                   <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                </div>
                <p className="text-brand-muted leading-relaxed text-lg">
                  {partner.description}
                </p>
                {partner.link && (
                  <a 
                    href={partner.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block pt-4 text-brand-dark font-bold text-sm border-b border-brand-accent hover:bg-brand-accent hover:text-white px-2 py-1 transition-all"
                  >
                    מעבר לאתר השותף ←
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 border-4 border-dashed border-brand-dark/10">
             <p className="text-brand-muted font-black italic">השותפויות יעודכנו כאן בקרוב.</p>
          </div>
        )}
      </section>

      <div className="p-8 md:p-12 border border-brand-dark/10 space-y-6 bg-brand-sage/15">
        <p className="text-xl md:text-2xl text-brand-dark font-bold tracking-tight leading-relaxed max-w-3xl">
          "אני מאמין בחיבורים שיוצרים ערך מוסף. הכלים והחברות שאני בוחר לעבוד איתם הם אלו שמאפשרים לי להעניק ללקוחות שלי את הפתרונות הטובים ביותר בשוק."
        </p>
        <div className="h-px w-20 bg-brand-dark mx-auto"></div>
        <span className="text-sm font-bold text-brand-muted">GK Strategic Ecosystem</span>
      </div>
    </div>
  );
};

export default PartnersPage;
