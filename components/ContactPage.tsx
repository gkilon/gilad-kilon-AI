import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

type ContactItem = { id: string; name: string; email: string; phone?: string; organization?: string; topic: string; message: string; createdAt: string };
const ContactPage: React.FC = () => {
  const location = useLocation();
  const adminMode = location.pathname === '/contact-admin';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [topic, setTopic] = useState(new URLSearchParams(location.search).get('topic') || '');
  useEffect(() => { if (!adminMode) setTopic(new URLSearchParams(location.search).get('topic') || ''); }, [location.search, adminMode]);
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const inputClass = 'w-full border border-brand-dark/15 bg-white px-4 py-3 outline-none focus:border-brand-accent';

  const loadContacts = async () => {
    setBusy(true); setStatus('');
    try {
      const response = await fetch('/.netlify/functions/contact-api', { headers: { 'x-contact-admin-token': adminToken } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'לא ניתן לטעון את הפניות');
      setContacts(data.contacts || []);
    } catch (error) { setStatus(error instanceof Error ? error.message : 'שגיאה בטעינת הפניות'); }
    finally { setBusy(false); }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setStatus('');
    try {
      const response = await fetch('/.netlify/functions/contact-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, phone, organization, topic, message, website }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'שליחת הפנייה נכשלה');
      setStatus(data.notificationSent ? 'הפנייה התקבלה. תודה, אחזור אליך.' : 'הפנייה נשמרה, אבל לא נשלחה אליך התראת דוא״ל. צריך לבדוק את הגדרות ההתראה ב-Netlify.');
      setName(''); setEmail(''); setPhone(''); setOrganization(''); setMessage('');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'אירעה שגיאה. נסו שוב.'); }
    finally { setBusy(false); }
  };

  if (adminMode) return <main className="min-h-screen bg-brand-beige px-6 py-16 text-brand-dark" dir="rtl"><div className="max-w-5xl mx-auto">
    <p className="text-xs font-bold tracking-widest text-brand-accent mb-3">ניהול פניות</p><h1 className="text-4xl md:text-5xl font-black mb-8">פניות מהאתר</h1>
    <form onSubmit={e => { e.preventDefault(); void loadContacts(); }} className="flex flex-col sm:flex-row gap-3 mb-8"><input type="password" value={adminToken} onChange={e => setAdminToken(e.target.value)} placeholder="קוד ניהול" className={inputClass} required autoComplete="current-password"/><button disabled={busy} className="px-6 py-3 bg-brand-dark text-white font-bold disabled:opacity-50">הצג פניות</button></form>
    {status && <p role="status" className="mb-6 text-sm">{status}</p>}
    <div className="space-y-4">{contacts.map(c => <article key={c.id} className="bg-white border border-brand-dark/10 p-6"><div className="flex flex-wrap justify-between gap-2"><h2 className="text-xl font-bold">{c.name}</h2><time className="text-sm text-brand-muted">{new Date(c.createdAt).toLocaleString('he-IL')}</time></div><p className="mt-2 text-sm">{c.email}{c.phone ? ' · ' + c.phone : ''}{c.organization ? ' · ' + c.organization : ''}</p><p className="mt-3 font-bold">{c.topic || 'פנייה כללית'}</p><p className="mt-2 whitespace-pre-wrap leading-relaxed">{c.message}</p></article>)}</div>
    {contacts.length === 0 && !status && <p className="text-brand-muted">אין כרגע פניות להצגה.</p>}
  </div></main>;

  return <main className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl"><div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
    <section className="bg-brand-dark text-white p-7 md:p-10 mb-8 relative overflow-hidden"><Link to="/" className="inline-block text-sm font-bold text-white/65 hover:text-white mb-8">← לעמוד הראשי</Link>
    <p className="text-xs font-bold tracking-widest text-brand-gold mb-4">אפשר להתחיל משיחה</p><h1 className="text-4xl md:text-5xl font-black leading-tight">במה אפשר לעזור?</h1>
    <p className="text-lg leading-relaxed text-white/70 mt-5">ספרו לי בקצרה על הצורך או השאלה. הפנייה תישמר במערכת ואחזור אליכם.</p></section>
    <div className="grid sm:grid-cols-3 gap-3 mb-10">
      <a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white border border-brand-dark/10 p-4 hover:border-brand-accent transition-colors"><span className="text-xl" aria-hidden="true">◉</span><span><span className="block text-sm font-bold">WhatsApp</span><span className="block text-xs text-brand-muted mt-1">הודעה קצרה</span></span></a>
      <a href="mailto:gilad@kilon.org" className="flex items-center gap-3 bg-white border border-brand-dark/10 p-4 hover:border-brand-accent transition-colors"><span className="text-xl" aria-hidden="true">✉</span><span><span className="block text-sm font-bold">דוא״ל</span><span dir="ltr" className="block text-xs text-brand-muted mt-1">gilad@kilon.org</span></span></a>
      <a href="tel:+972526417512" className="flex items-center gap-3 bg-white border border-brand-dark/10 p-4 hover:border-brand-accent transition-colors"><span className="text-xl" aria-hidden="true">☎</span><span><span className="block text-sm font-bold">טלפון</span><span dir="ltr" className="block text-xs text-brand-muted mt-1">052-641-7512</span></span></a>
    </div>
    <form onSubmit={submit} className="bg-white border border-brand-dark/10 p-6 md:p-9 space-y-5">
      <div className="absolute -left-[10000px]" aria-hidden="true"><label>אין למלא שדה זה<input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)}/></label></div>
      <label className="block text-sm font-bold">שם מלא *<input className={inputClass + ' mt-2'} value={name} onChange={e => setName(e.target.value)} autoComplete="name" maxLength={120} required /></label>
      <label className="block text-sm font-bold">כתובת דוא״ל *<input className={inputClass + ' mt-2'} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" maxLength={254} required /></label>
      <div className="grid sm:grid-cols-2 gap-5"><label className="block text-sm font-bold">טלפון<input className={inputClass + ' mt-2'} type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" maxLength={40}/></label><label className="block text-sm font-bold">ארגון<input className={inputClass + ' mt-2'} value={organization} onChange={e => setOrganization(e.target.value)} autoComplete="organization" maxLength={160}/></label></div>
      <label className="block text-sm font-bold">נושא הפנייה<input className={inputClass + ' mt-2'} value={topic} onChange={e => setTopic(e.target.value)} maxLength={160} placeholder="למשל: סדנת שותפויות"/></label>
      <label className="block text-sm font-bold">במה מדובר? *<textarea className={inputClass + ' mt-2 min-h-36'} value={message} onChange={e => setMessage(e.target.value)} maxLength={4000} required /></label>
      <button disabled={busy} className="w-full px-6 py-4 bg-brand-dark text-white font-bold hover:bg-brand-accent transition-colors disabled:opacity-50">{busy ? 'שולח…' : 'שליחת פנייה'}</button>
      {status && <p role="status" className="text-sm leading-relaxed">{status}</p>}
      <p className="text-xs text-brand-muted">הפרטים ישמשו לצורך מענה לפנייה בלבד.</p>
    </form>
  </div></main>;
};
export default ContactPage;
