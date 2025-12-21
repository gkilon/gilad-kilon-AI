
import React, { useState, useEffect } from 'react';
import { getSystemConfig, updateSystemConfig } from '../firebase';
import { Article, ClientLogo } from '../types';

const AdminPanel: React.FC<{ onBack: () => void, onGoToAssets?: () => void }> = ({ onBack, onGoToAssets }) => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'system' | 'clients' | 'articles'>('system');

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

  const addItem = (type: 'clients' | 'articles') => {
    if (type === 'clients') {
      const newItem: ClientLogo = { id: Math.random().toString(36).substr(2, 9), name: '', url: '' };
      setConfig({ ...config, clients: [...config.clients, newItem] });
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

  const removeItem = (type: 'clients' | 'articles', id: string) => {
    setConfig({ ...config, [type]: config[type].filter((item: any) => item.id !== id) });
  };

  const updateItem = (type: 'clients' | 'articles', id: string, field: string, value: string) => {
    const newList = config[type].map((item: any) => item.id === id ? { ...item, [field]: value } : item);
    setConfig({ ...config, [type]: newList });
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

      <div className="flex bg-white/50 p-1 mb-10 border border-brand-dark/10 shadow-sm">
        <button onClick={() => setActiveTab('system')} className={`flex-1 py-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'system' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:bg-brand-dark/5'}`}>הגדרות ליבה</button>
        <button onClick={() => setActiveTab('clients')} className={`flex-1 py-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'clients' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:bg-brand-dark/5'}`}>ניהול לקוחות</button>
        <button onClick={() => setActiveTab('articles')} className={`flex-1 py-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'articles' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:bg-brand-dark/5'}`}>ניהול מאמרים</button>
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
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="bg-brand-beige p-6 border-r-4 border-brand-accent">
               <h4 className="font-bold text-brand-dark mb-2">איך מוסיפים לוגו?</h4>
               <p className="text-sm text-brand-muted">הדבק כאן קישור (URL) ישיר לתמונת הלוגו. תוכל להשתמש בלוגואים מאתר האינטרנט שלך או משירותי אחסון תמונות.</p>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black italic">רשימת לקוחות</h3>
              <button onClick={() => addItem('clients')} className="bg-brand-dark text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all">+ הוסף לקוח</button>
            </div>
            <div className="grid gap-6">
              {config.clients.map((c: ClientLogo) => (
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
        )}

        {activeTab === 'articles' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="bg-brand-beige p-6 border-r-4 border-brand-accent">
               <h4 className="font-bold text-brand-dark mb-2">ניהול מאמרים ותוכן</h4>
               <p className="text-sm text-brand-muted">תוכל להזין קישור חיצוני (Link) או להכניס את תוכן המאמר ישירות (Content). אם תזין תוכן, הוא יוצג בדף המאמר המעוצב באתר.</p>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black italic">רשימת מאמרים</h3>
              <button onClick={() => addItem('articles')} className="bg-brand-dark text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all">+ הוסף מאמר</button>
            </div>
            <div className="grid gap-8">
              {config.articles.map((a: Article) => (
                <div key={a.id} className="p-8 bg-brand-beige/20 border-2 border-brand-dark space-y-6 shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-brand-muted">כותרת המאמר</label>
                      <input placeholder="כותרת המאמר" value={a.title} onChange={e => updateItem('articles', a.id, 'title', e.target.value)} className="w-full p-3 border-b-2 border-brand-dark bg-transparent outline-none focus:border-brand-accent font-black text-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-brand-muted">קטגוריה</label>
                      <input placeholder="קטגוריה" value={a.category} onChange={e => updateItem('articles', a.id, 'category', e.target.value)} className="w-full p-3 border-b-2 border-brand-dark bg-transparent outline-none focus:border-brand-accent font-bold" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-brand-muted">תאריך / שנה</label>
                      <input placeholder="תאריך" value={a.date} onChange={e => updateItem('articles', a.id, 'date', e.target.value)} className="w-full p-3 border-b-2 border-brand-dark bg-transparent outline-none focus:border-brand-accent font-bold" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-brand-muted">קישור חיצוני (אופציונלי)</label>
                      <input placeholder="קישור (URL)" value={a.link || ''} onChange={e => updateItem('articles', a.id, 'link', e.target.value)} className="w-full p-3 border-b-2 border-brand-dark bg-transparent outline-none focus:border-brand-accent text-left text-sm" dir="ltr" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-brand-muted">תוכן המאמר (טקסט מלא)</label>
                    <textarea 
                      placeholder="הכנס את תוכן המאמר כאן..." 
                      value={a.content || ''} 
                      onChange={e => updateItem('articles', a.id, 'content', e.target.value)} 
                      className="w-full h-64 p-6 border-2 border-brand-dark bg-white outline-none focus:border-brand-accent font-medium leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button onClick={() => removeItem('articles', a.id)} className="text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 px-4 py-2 border border-red-200 transition-all">מחק מאמר</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={handleSave}
          className="w-full py-8 bg-brand-dark text-white rounded-none font-black text-2xl hover:bg-brand-accent transition-all shadow-xl active:scale-95"
        >
          {saveStatus || "עדכן והפץ שינויים במערכת"}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
