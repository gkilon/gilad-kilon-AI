
import React, { useState, useEffect } from 'react';
import { getSystemConfig, updateSystemConfig } from '../firebase';
import { Article, ClientLogo, Collaboration } from '../types';

const AdminPanel: React.FC<{ onBack: () => void, onGoToAssets?: () => void }> = ({ onBack, onGoToAssets }) => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'system' | 'clients_partners' | 'articles'>('system');

  useEffect(() => {
    getSystemConfig().then(data => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaveStatus('שומר...');
    await updateSystemConfig(config);
    setSaveStatus('נשמר בהצלחה!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const addItem = (type: 'clients' | 'articles' | 'partners') => {
    if (type === 'clients') {
      const newItem: ClientLogo = { id: Math.random().toString(36).substr(2, 9), name: '', url: '' };
      setConfig({ ...config, clients: [...(config.clients || []), newItem] });
    } else if (type === 'partners') {
      const newItem: Collaboration = { id: Math.random().toString(36).substr(2, 9), name: '', logoUrl: '', description: '', link: '' };
      setConfig({ ...config, collaborations: [...(config.collaborations || []), newItem] });
    } else {
      const newItem: Article = { 
        id: Math.random().toString(36).substr(2, 9), 
        title: '', 
        category: '', 
        date: new Date().getFullYear().toString(), 
        link: '',
        content: '' 
      };
      setConfig({ ...config, articles: [newItem, ...config.articles] });
    }
  };

  const removeItem = (type: 'clients' | 'articles' | 'partners', id: string) => {
    const confirmMsg = "האם אתה בטוח שברצונך למחוק?";
    if (window.confirm(confirmMsg)) {
      if (type === 'partners') {
        setConfig({ ...config, collaborations: config.collaborations.filter((item: any) => item.id !== id) });
      } else if (type === 'clients') {
        setConfig({ ...config, clients: config.clients.filter((item: any) => item.id !== id) });
      } else {
        setConfig({ ...config, articles: config.articles.filter((item: any) => item.id !== id) });
      }
    }
  };

  const updateItem = (type: 'clients' | 'articles' | 'partners', id: string, field: string, value: string) => {
    let newList;
    if (type === 'partners') {
      newList = config.collaborations.map((item: any) => item.id === id ? { ...item, [field]: value } : item);
      setConfig({ ...config, collaborations: newList });
    } else if (type === 'clients') {
      newList = config.clients.map((item: any) => item.id === id ? { ...item, [field]: value } : item);
      setConfig({ ...config, clients: newList });
    } else {
      newList = config.articles.map((item: any) => item.id === id ? { ...item, [field]: value } : item);
      setConfig({ ...config, articles: newList });
    }
  };

  if (loading) return <div className="text-center py-20 text-brand-dark font-black">טוען הגדרות...</div>;

  return (
    <div className="max-w-5xl mx-auto py-20 animate-fadeIn pb-40 text-right px-6">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-brand-dark italic">ניהול תוכן המערכת</h2>
        <div className="flex gap-4">
          {onGoToAssets && (
            <button onClick={onGoToAssets} className="bg-brand-accent text-white px-6 py-2 font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_#1a1a1a] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">נכסי מותג (Assets) ✨</button>
          )}
          <button onClick={onBack} className="text-brand-muted hover:text-brand-dark font-bold text-sm uppercase tracking-widest border-b border-brand-dark">חזרה ←</button>
        </div>
      </div>

      <div className="flex bg-white/50 p-1 mb-10 border border-brand-dark/10 shadow-sm overflow-x-auto">
        <button onClick={() => setActiveTab('system')} className={`flex-1 min-w-[120px] py-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'system' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:bg-brand-dark/5'}`}>הגדרות ליבה</button>
        <button onClick={() => setActiveTab('clients_partners')} className={`flex-1 min-w-[120px] py-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'clients_partners' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:bg-brand-dark/5'}`}>לקוחות ושותפים</button>
        <button onClick={() => setActiveTab('articles')} className={`flex-1 min-w-[120px] py-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'articles' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:bg-brand-dark/5'}`}>ניהול מאמרים</button>
      </div>

      <div className="studio-card p-10 md:p-16 border-brand-dark bg-white shadow-[12px_12px_0px_#1a1a1a] space-y-12">
        
        {activeTab === 'system' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="space-y-4">
              <label className="text-brand-accent font-black uppercase tracking-widest text-[10px]">קוד גישה כללי (Master Code)</label>
              <input 
                type="text" 
                value={config.masterCode} 
                onChange={e => setConfig({...config, masterCode: e.target.value.toUpperCase()})}
                className="w-full bg-brand-beige/30 border-2 border-brand-dark p-6 text-2xl font-black text-center text-brand-dark focus:border-brand-accent outline-none"
              />
            </div>
            <div className="space-y-4">
              <label className="text-brand-accent font-black uppercase tracking-widest text-[10px]">כתובת שאלון 360 (Netlify URL)</label>
              <input 
                type="text" 
                value={config.feedback360Url} 
                onChange={e => setConfig({...config, feedback360Url: e.target.value})}
                className="w-full bg-brand-beige/30 border-2 border-brand-dark p-6 text-xl font-bold text-left text-brand-dark focus:border-brand-accent outline-none"
                dir="ltr"
              />
            </div>
            <div className="space-y-4">
              <label className="text-brand-accent font-black uppercase tracking-widest text-[10px]">כתובת אבחון DNA תקשורת (Netlify URL)</label>
              <input 
                type="text" 
                value={config.communicationDnaUrl} 
                onChange={e => setConfig({...config, communicationDnaUrl: e.target.value})}
                className="w-full bg-brand-beige/30 border-2 border-brand-dark p-6 text-xl font-bold text-left text-brand-dark focus:border-brand-accent outline-none"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {activeTab === 'clients_partners' && (
          <div className="space-y-16 animate-fadeIn">
            {/* Section: Clients */}
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b-2 border-brand-dark pb-4">
                <h3 className="text-2xl font-black italic">ניהול לקוחות</h3>
                <button onClick={() => addItem('clients')} className="bg-brand-dark text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all">+ הוסף לוגו לקוח</button>
              </div>
              <div className="grid gap-6">
                {(config.clients || []).map((c: ClientLogo) => (
                  <div key={c.id} className="flex flex-col md:flex-row gap-4 p-6 bg-brand-beige/20 border border-brand-dark/10 group">
                    <div className="w-16 h-16 shrink-0 bg-white border border-brand-dark/10 flex items-center justify-center p-2 shadow-inner">
                      {c.url ? <img src={c.url} alt="preview" className="max-w-full max-h-full object-contain" /> : <span className="text-[10px] text-brand-muted font-black">NO LOGO</span>}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input placeholder="שם הלקוח" value={c.name} onChange={e => updateItem('clients', c.id, 'name', e.target.value)} className="w-full p-2 border-b border-brand-dark/20 bg-transparent outline-none focus:border-brand-accent font-bold" />
                      <input placeholder="קישור ללוגו (URL)" value={c.url} onChange={e => updateItem('clients', c.id, 'url', e.target.value)} className="w-full p-2 border-b border-brand-dark/20 bg-transparent outline-none focus:border-brand-accent text-left text-xs" dir="ltr" />
                    </div>
                    <button onClick={() => removeItem('clients', c.id)} className="text-red-500 font-black text-xs uppercase tracking-widest hover:underline pt-2">מחק</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Partners */}
            <div className="space-y-8 pt-8 border-t-4 border-brand-beige">
              <div className="flex justify-between items-center border-b-2 border-brand-dark pb-4">
                <h3 className="text-2xl font-black italic">ניהול שיתופי פעולה</h3>
                <button onClick={() => addItem('partners')} className="bg-brand-accent text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark transition-all">+ הוסף שותף/כלי</button>
              </div>
              <div className="grid gap-8">
                {(config.collaborations || []).map((p: Collaboration) => (
                  <div key={p.id} className="p-8 bg-brand-beige/20 border-2 border-brand-dark space-y-6 shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-24 h-24 shrink-0 bg-white border border-brand-dark flex items-center justify-center p-2">
                        {p.logoUrl ? <img src={p.logoUrl} alt="preview" className="max-w-full max-h-full object-contain" /> : <span className="text-[10px] text-brand-muted font-black">NO LOGO</span>}
                      </div>
                      <div className="flex-1 space-y-4">
                         <input placeholder="שם החברה/הכלי" value={p.name} onChange={e => updateItem('partners', p.id, 'name', e.target.value)} className="w-full p-3 border-b-2 border-brand-dark bg-transparent outline-none focus:border-brand-accent font-black text-xl" />
                         <input placeholder="קישור ללוגו (URL)" value={p.logoUrl} onChange={e => updateItem('partners', p.id, 'logoUrl', e.target.value)} className="w-full p-2 border-b border-brand-dark/20 bg-transparent outline-none focus:border-brand-accent text-left text-xs" dir="ltr" />
                         <input placeholder="קישור לאתר (אופציונלי)" value={p.link || ''} onChange={e => updateItem('partners', p.id, 'link', e.target.value)} className="w-full p-2 border-b border-brand-dark/20 bg-transparent outline-none focus:border-brand-accent text-left text-xs" dir="ltr" />
                         <textarea placeholder="תיאור קצר על השותפות / הכלי" value={p.description || ''} onChange={e => updateItem('partners', p.id, 'description', e.target.value)} className="w-full p-3 border-b-2 border-brand-dark bg-transparent outline-none focus:border-brand-accent text-sm" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={() => removeItem('partners', p.id)} className="text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white px-3 py-1 border border-red-500 transition-all">מחק שותפות</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="flex justify-between items-center border-b-2 border-brand-dark pb-4">
              <h3 className="text-2xl font-black italic">רשימת מאמרים</h3>
              <button onClick={() => addItem('articles')} className="bg-brand-dark text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all">+ הוסף מאמר חדש</button>
            </div>
            <div className="grid gap-8">
              {(config.articles || []).map((a: Article) => (
                <div key={a.id} className="p-8 bg-brand-beige/20 border-2 border-brand-dark space-y-6">
                  <div className="flex justify-between items-start">
                    <input value={a.title} onChange={e => updateItem('articles', a.id, 'title', e.target.value)} className="flex-1 p-3 border-b-2 border-brand-dark bg-transparent outline-none font-black text-xl" placeholder="כותרת" />
                    <button onClick={() => removeItem('articles', a.id)} className="mr-6 text-red-500 text-[10px] font-black uppercase">מחק</button>
                  </div>
                  <textarea value={a.content || ''} onChange={e => updateItem('articles', a.id, 'content', e.target.value)} className="w-full h-40 p-4 border border-brand-dark/10" placeholder="תוכן המאמר..." />
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleSave} className="w-full py-8 bg-brand-dark text-white font-black text-2xl hover:bg-brand-accent transition-all shadow-xl active:scale-95">
          {saveStatus || "עדכן והפץ שינויים במערכת"}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
