
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
    <div className="max-w-6xl mx-auto py-24 animate-fadeIn space-y-24 pb-48 text-right px-6" dir="rtl">
      
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="inline-block border-2 border-brand-dark p-8 shadow-[8px_8px_0px_#1a1a1a] bg-white">
          <h1 className="text-5xl md:text-8xl font-black text-brand-dark tracking-tighter italic uppercase leading-none">
            לקוחות ושותפים.
          </h1>
        </div>
        <p className="text-xl md:text-3xl text-brand-muted max-w-2xl mx-auto font-medium leading-relaxed italic">
          "הצלחה נמדדת לא רק בתוצאות, אלא באמון, בחיבורים ובקשרים שנבנים לאורך זמן."
        </p>
      </section>

      {/* Clients Section */}
      <section className="space-y-12">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-px flex-1 bg-brand-dark/10"></div>
           <h2 className="text-2xl font-black text-brand-dark italic uppercase tracking-widest">לקוחות שאני מלווה</h2>
           <div className="h-px w-10 bg-brand-accent"></div>
        </div>
        
        <div className="studio-card p-12 md:p-20 border-brand-dark bg-white shadow-[16px_16px_0px_rgba(26,26,26,0.05)]">
          {loading ? (
            <div className="flex justify-center items-center h-40">
               <div className="w-8 h-8 border-4 border-brand-dark border-t-brand-accent rounded-full animate-spin"></div>
            </div>
          ) : clients.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 md:gap-16 items-center justify-center">
              {clients.map(client => (
                <div key={client.id} className="flex flex-col items-center gap-4 group">
                  <div className="w-full aspect-square bg-brand-beige/20 border border-brand-dark/5 p-8 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700 hover:bg-white hover:shadow-xl">
                    <img 
                      src={client.url} 
                      alt={client.name} 
                      title={client.name}
                      className="max-h-full max-w-full object-contain"
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
      <section className="space-y-12">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-px flex-1 bg-brand-dark/10"></div>
           <h2 className="text-2xl font-black text-brand-dark italic uppercase tracking-widest">שיתופי פעולה וכלים מקצועיים</h2>
           <div className="h-px w-10 bg-brand-accent"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
               <div className="w-10 h-10 border-4 border-brand-dark border-t-brand-accent rounded-full animate-spin"></div>
            </div>
          ) : partners.length > 0 ? (
            partners.map(partner => (
              <div key={partner.id} className="studio-card p-8 bg-white border-brand-dark flex flex-col md:flex-row gap-6 items-center md:items-start group transition-all hover:shadow-[12px_12px_0px_var(--brand-accent)]">
                <div className="w-24 h-24 shrink-0 bg-brand-beige/20 border-2 border-brand-dark flex items-center justify-center p-3">
                  <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="flex-1 space-y-3 text-center md:text-right">
                  <h3 className="text-2xl font-black italic text-brand-dark group-hover:text-brand-accent transition-colors">{partner.name}</h3>
                  <p className="text-brand-muted font-bold italic leading-relaxed text-sm">
                    {partner.description}
                  </p>
                  {partner.link && (
                    <a 
                      href={partner.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block pt-2 text-brand-dark font-black text-[10px] uppercase tracking-widest border-b-2 border-brand-accent hover:bg-brand-accent hover:text-white px-2 py-0.5 transition-all"
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
        </div>
      </section>

      <div className="p-16 border-2 border-brand-dark/10 text-center space-y-8 italic bg-white/50 shadow-inner">
        <p className="text-2xl text-brand-dark font-black tracking-tight leading-relaxed max-w-3xl mx-auto">
          "אני מאמין בחיבורים שיוצרים ערך מוסף. הכלים והחברות שאני בוחר לעבוד איתם הם אלו שמאפשרים לי להעניק ללקוחות שלי את הפתרונות הטובים ביותר."
        </p>
        <div className="h-px w-20 bg-brand-dark mx-auto"></div>
        <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-muted">Gilad Kilon Strategic Ecosystem</span>
      </div>
    </div>
  );
};

export default ClientsPage;
