
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
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16 md:space-y-24 text-right">

        {/* Hero Section */}
        <section className="max-w-4xl space-y-6 border-r-4 border-brand-touch pr-6 md:pr-8">
          <div>
            <span className="text-xs font-bold text-brand-accent block mb-4">ניסיון מקצועי</span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
              לקוחות ושותפים.
            </h1>
          </div>
          <p className="text-lg md:text-2xl text-brand-muted max-w-3xl leading-relaxed">
            העבודה שלי נבנית לאורך זמן, עם אנשים וארגונים שבוחרים לחשוב ולעבוד יחד.
          </p>
        </section>

        {/* Clients Section */}
        <section className="space-y-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">ארגונים שעבדתי איתם</h2>
            
          </div>

          <div className="bg-brand-paper border border-brand-dark/10 p-6 md:p-12">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-brand-dark/10 border-t-brand-dark rounded-full animate-spin"></div>
              </div>
            ) : clients.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-center">
                {clients.map(client => (
                  <div key={client.id} className="flex flex-col items-center gap-4 group cursor-default">
                    <div className="w-full h-24 md:h-28 flex items-center justify-center grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
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
              <div className="text-center py-12 opacity-30 italic font-bold"></div>
            )}
          </div>
        </section>

        {/* Partners Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark shrink-0">שותפים מקצועיים</h2>
            <div className="h-px w-full bg-brand-gold/60"></div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {loading ? (
              <div className="col-span-full flex justify-center py-20 bg-white">
                <div className="w-10 h-10 border-4 border-brand-dark/10 border-t-brand-dark rounded-full animate-spin"></div>
              </div>
            ) : partners.length > 0 ? (
              partners.map(partner => (
                <div key={partner.id} className="p-6 md:p-8 bg-brand-paper border border-brand-dark/10 flex flex-col md:flex-row gap-6 items-center md:items-start group hover:border-brand-accent transition-colors">
                  <div className="w-20 h-20 shrink-0 flex items-center justify-center p-3 bg-brand-sage/20">
                    <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <div className="flex-1 space-y-3 text-center md:text-right">
                    <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-accent transition-colors">{partner.name}</h3>
                    <p className="text-brand-muted leading-relaxed text-sm">
                      {partner.description}
                    </p>
                    {partner.link && (
                      <a
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block pt-4 text-brand-dark font-bold text-sm border-b border-brand-dark/20 hover:border-brand-accent hover:text-brand-accent transition-all"
                      >
                        מעבר לאתר השותף ←
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white">
                <p className="text-brand-muted font-light italic"></p>
              </div>
            )}
          </div>
        </section>

        <div className="pt-8 border-t border-brand-dark/10 space-y-4">
          <p className="text-lg text-brand-muted leading-relaxed max-w-3xl">
            לאורך השנים אני עובד עם ארגונים, שותפים ואנשי מקצוע. כל שיתוף פעולה נבנה סביב האנשים, הצורך והעבודה שצריך לעשות.
          </p>
          <span className="text-sm font-bold text-brand-dark block">גלעד קילון · ייעוץ ארגוני ופיתוח מנהלים</span>
        </div>

      </div>
    </div>
  );
};

export default ClientsPage;
