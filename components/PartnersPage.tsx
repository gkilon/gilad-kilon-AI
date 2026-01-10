
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
    <div className="max-w-6xl mx-auto py-24 animate-fadeIn space-y-24 pb-48 text-right px-6" dir="rtl">
      
      <section className="text-center space-y-8">
        <div className="inline-block border-2 border-brand-dark p-8 shadow-[8px_8px_0px_#1a1a1a] bg-white">
          <h1 className="text-5xl md:text-8xl font-black text-brand-dark tracking-tighter italic uppercase leading-none">
            שיתופי פעולה.
          </h1>
        </div>
        <p className="text-xl md:text-3xl text-brand-muted max-w-2xl mx-auto font-medium leading-relaxed italic">
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
            <div key={partner.id} className="studio-card p-10 bg-white border-brand-dark flex flex-col md:flex-row gap-8 items-center md:items-start group transition-all hover:shadow-[12px_12px_0px_var(--brand-accent)]">
              <div className="w-32 h-32 shrink-0 bg-brand-beige/20 border-2 border-brand-dark flex items-center justify-center p-4">
                <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="flex-1 space-y-4 text-center md:text-right">
                <div className="flex items-center gap-3 justify-center md:justify-end">
                   <h3 className="text-3xl font-black italic text-brand-dark group-hover:text-brand-accent transition-colors">{partner.name}</h3>
                   <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                </div>
                <p className="text-brand-muted font-bold italic leading-relaxed text-lg">
                  {partner.description}
                </p>
                {partner.link && (
                  <a 
                    href={partner.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block pt-4 text-brand-dark font-black text-xs uppercase tracking-widest border-b-2 border-brand-accent hover:bg-brand-accent hover:text-white px-2 py-1 transition-all"
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

      <div className="p-16 border-2 border-brand-dark/10 text-center space-y-8 italic bg-white/50">
        <p className="text-2xl text-brand-dark font-black tracking-tight leading-relaxed max-w-3xl mx-auto">
          "אני מאמין בחיבורים שיוצרים ערך מוסף. הכלים והחברות שאני בוחר לעבוד איתם הם אלו שמאפשרים לי להעניק ללקוחות שלי את הפתרונות הטובים ביותר בשוק."
        </p>
        <div className="h-px w-20 bg-brand-dark mx-auto"></div>
        <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-muted">GK Strategic Ecosystem</span>
      </div>
    </div>
  );
};

export default PartnersPage;
