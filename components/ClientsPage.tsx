
import React, { useEffect, useState } from 'react';
import { getSystemConfig } from '../firebase';
import { ClientLogo, Collaboration } from '../types';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [partners, setPartners] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystemConfig().then(config => {
      setClients(config.clients || []);
      setPartners(config.collaborations || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto py-24 px-6 space-y-32 pb-48 text-right">

        {/* Hero Section */}
        <section className="text-center space-y-8 animate-fadeIn">
          <div className="inline-block border-b-2 border-brand-accent pb-4">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.4em] block mb-2">Ecosystem</span>
            <h1 className="text-5xl md:text-8xl font-black text-brand-dark tracking-tighter italic uppercase leading-none">
              לקוחות ושותפים.
            </h1>
          </div>
          <p className="text-xl md:text-3xl text-brand-muted max-w-2xl mx-auto font-light leading-relaxed">
            "הצלחה נמדדת לא רק בתוצאות, אלא באמון, בחיבורים ובקשרים שנבנים לאורך זמן."
          </p>
        </section>

        {/* Clients Section */}
        <section className="space-y-16 animate-slideUp">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-black text-brand-dark italic uppercase tracking-widest shrink-0">לקוחות שאני מלווה</h2>
            <div className="h-px w-full bg-brand-dark/10"></div>
          </div>

          <div className="bg-white border border-brand-dark/5 p-12 md:p-20">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-brand-dark/10 border-t-brand-dark rounded-full animate-spin"></div>
              </div>
            ) : clients.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-16 items-center justify-center">
                {clients.map(client => (
                  <div key={client.id} className="flex flex-col items-center gap-4 group cursor-default">
                    <div className="w-full aspect-square flex items-center justify-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                      <img
                        src={client.url}
                        alt={client.name}
                        title={client.name}
                        className="max-h-24 max-w-full object-contain mix-blend-multiply"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 opacity-30 italic font-bold">רשימת הלקוחות תעודכן בקרוב...</div>
            )}
          </div>
        </section>

        {/* Partners Section */}
        <section className="space-y-16">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-black text-brand-dark italic uppercase tracking-widest shrink-0">שיתופי פעולה וכלים מקצועיים</h2>
            <div className="h-px w-full bg-brand-dark/10"></div>
          </div>

          <div className="grid gap-px bg-brand-dark/10 border border-brand-dark/10 md:grid-cols-2 shadow-sm overflow-hidden">
            {loading ? (
              <div className="col-span-full flex justify-center py-20 bg-white">
                <div className="w-10 h-10 border-4 border-brand-dark/10 border-t-brand-dark rounded-full animate-spin"></div>
              </div>
            ) : partners.length > 0 ? (
              partners.map(partner => (
                <div key={partner.id} className="arch-card p-10 bg-white flex flex-col md:flex-row gap-8 items-center md:items-start group hover:bg-brand-beige/30 transition-colors">
                  <div className="w-20 h-20 shrink-0 border border-brand-dark/10 flex items-center justify-center p-3 bg-white">
                    <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <div className="flex-1 space-y-3 text-center md:text-right">
                    <h3 className="text-2xl font-black text-brand-dark group-hover:text-brand-accent transition-colors">{partner.name}</h3>
                    <p className="text-brand-muted font-light leading-relaxed text-sm">
                      {partner.description}
                    </p>
                    {partner.link && (
                      <a
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block pt-4 text-brand-dark font-bold text-[10px] uppercase tracking-widest border-b border-brand-dark/20 hover:border-brand-accent hover:text-brand-accent transition-all"
                      >
                        מעבר לאתר השותף ←
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white">
                <p className="text-brand-muted font-light italic">השותפויות יעודכנו כאן בקרוב.</p>
              </div>
            )}
          </div>
        </section>

        <div className="mt-24 pt-12 border-t border-brand-dark/10 text-center space-y-6">
          <p className="text-xl text-brand-dark font-light tracking-tight leading-relaxed max-w-3xl mx-auto italic">
            "אני מאמין בחיבורים שיוצרים ערך מוסף. הכלים והחברות שאני בוחר לעבוד איתם הם אלו שמאפשרים לי להעניק ללקוחות שלי את הפתרונות הטובים ביותר."
          </p>
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-brand-muted block">Gilad Kilon Strategic Ecosystem</span>
        </div>

      </div>
    </div>
  );
};

export default ClientsPage;
