
import React, { useEffect, useState } from 'react';
import { getSystemConfig } from '../firebase';
import { ClientLogo } from '../types';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystemConfig().then(config => {
      setClients(config.clients || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-24 animate-fadeIn space-y-24 pb-48 text-right px-6" dir="rtl">
      
      <section className="text-center space-y-8">
        <div className="inline-block border-2 border-brand-dark p-8 shadow-[8px_8px_0px_#1a1a1a] bg-white">
          <h1 className="text-5xl md:text-8xl font-black text-brand-dark tracking-tighter italic uppercase leading-none">
            שותפים לדרך.
          </h1>
        </div>
        <p className="text-xl md:text-3xl text-brand-muted max-w-2xl mx-auto font-medium leading-relaxed italic">
          "הצלחה נמדדת לא רק בתוצאות, אלא באמון ובקשרים שנבנים לאורך זמן."
        </p>
      </section>

      <section className="studio-card p-12 md:p-24 border-brand-dark bg-white shadow-[16px_16px_0px_rgba(26,26,26,0.05)]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="w-10 h-10 border-4 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : clients.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 md:gap-20 items-center justify-center">
            {clients.map(client => (
              <div key={client.id} className="flex flex-col items-center gap-4 group">
                <div className="w-full aspect-square bg-brand-beige/30 border border-brand-dark/5 p-8 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700 hover:bg-white hover:shadow-xl">
                  <img 
                    src={client.url} 
                    alt={client.name} 
                    title={client.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-6">
             <div className="text-7xl grayscale opacity-10">🏢 🤝 🏗️</div>
             <p className="text-brand-muted font-black uppercase tracking-[0.3em] text-xs">רשימת השותפים תעודכן בקרוב</p>
          </div>
        )}
      </section>

      <div className="p-16 border-2 border-brand-dark/10 text-center space-y-8 italic bg-white/50">
        <p className="text-2xl text-brand-dark font-black tracking-tight leading-relaxed max-w-3xl mx-auto">
          "אני מאמין בעבודה בגובה העיניים, בשקיפות מלאה ובמחויבות בלתי מתפשרת להצלחה של הארגונים שאני מלווה."
        </p>
        <div className="h-px w-20 bg-brand-dark mx-auto"></div>
        <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-muted">Gilad Kilon Strategic Partners</span>
      </div>
    </div>
  );
};

export default ClientsPage;
