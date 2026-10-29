
import React, { useState, useEffect } from 'react';
import { BrandLogo } from './Landing';
import { createWorkspace, loginToWorkspace, getSystemConfig, isFirebaseReady, signInAdmin } from '../firebase';

interface LoginProps {
  onLogin: (teamId: string, isManager: boolean, isAdmin?: boolean) => void;
  message?: string;
  adminOnly?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, message, adminOnly = false }) => {
  const [isUnlocked, setIsUnlocked] = useState(adminOnly);
  const [accessCode, setAccessCode] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'employee' | 'admin'>(adminOnly ? 'admin' : 'login');
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [masterCode, setMasterCode] = useState('GILAD2025');

  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTeamId = params.get('teamId');
    if (urlTeamId && !adminOnly) {
      setTeamId(urlTeamId);
      setMode('employee');
      setIsUnlocked(true);
    }

    if (isFirebaseReady()) {
      getSystemConfig().then(config => setMasterCode(config.masterCode));
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim().toLowerCase() === masterCode.toLowerCase()) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError("קוד גישה למערכת שגוי");
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'admin') {
      setLoading(true);
      const result = await signInAdmin(password);
      setLoading(false);
      if (result.success) onLogin('admin', true, true);
      else setError(result.error || "התחברות מנהל נכשלה");
      return;
    }

    if (!teamId.trim()) {
      setError("נא להזין שם מרחב עבודה");
      return;
    }

    setLoading(true);
    const tid = teamId.trim().toLowerCase();

    try {
      if (mode === 'signup') {
        const res = await createWorkspace(tid, password);
        if (res.success) onLogin(tid, true);
        else setError(res.error || "שגיאה ביצירת המרחב");
      } else if (mode === 'login') {
        const res = await loginToWorkspace(tid, password);
        if (res.success) onLogin(tid, true);
        else setError(res.error || "פרטי התחברות שגויים");
      } else {
        onLogin(tid, false);
      }
    } catch (err: any) {
      setError("שגיאת תקשורת");
    }
    setLoading(false);
  };

  if (mode === 'admin') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fadeIn bg-brand-beige">
        <div className="studio-card w-full max-w-md p-12 border-brand-dark bg-white shadow-[16px_16px_0px_#1a1a1a]">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-3xl font-black text-brand-dark italic uppercase">ADMIN PANEL</h2>
            <p className="text-brand-muted text-xs font-black tracking-widest mt-2">גישת מנהל מערכת בלבד</p>
          </div>
          <form onSubmit={handleAction} className="space-y-8 text-right">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-brand-dark uppercase tracking-widest">קוד ניהול</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                className="w-full bg-white border-4 border-brand-dark p-5 text-2xl text-brand-dark outline-none focus:ring-4 focus:ring-brand-accent/20 font-bold"
                value={password}
                autoFocus
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="bg-red-500 text-white font-black p-3 text-center text-xs">{error}</p>}
            <button disabled={loading} className="w-full py-6 bg-brand-dark text-white font-black text-xl hover:bg-brand-accent transition-all shadow-xl active:scale-95 disabled:opacity-60">{loading ? 'מתחבר...' : 'כניסה לממשק ניהול'}</button>
            {adminOnly ? <button type="button" onClick={() => { window.location.href = '/home'; }} className="w-full text-brand-muted font-black text-[10px] uppercase tracking-widest hover:text-brand-dark underline decoration-brand-accent">חזרה לאתר</button> : <button type="button" onClick={() => setMode('login')} className="w-full text-brand-muted font-black text-[10px] uppercase tracking-widest hover:text-brand-dark underline decoration-brand-accent">חזרה לכניסה רגילה</button>}
          </form>
        </div>
      </div>
    );
  }

  if (!isUnlocked && !adminOnly) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fadeIn bg-brand-beige">
        <div className="studio-card w-full max-w-md p-12 border-brand-dark bg-white shadow-[16px_16px_0px_#1a1a1a] text-center">
          <div className="w-24 h-24 bg-brand-beige border-4 border-brand-dark flex items-center justify-center mx-auto mb-10">
            <span className="text-5xl">🗝️</span>
          </div>
          <h2 className="text-4xl font-black text-brand-dark mb-4 italic tracking-tighter">שער כניסה</h2>
          <p className="text-brand-muted mb-10 font-bold italic">הזן את קוד הגישה האישי שקיבלת מגלעד.</p>
          <form onSubmit={handleUnlock} className="space-y-8">
            <input 
              type="text" 
              placeholder="ACCESS CODE"
              className="w-full bg-white border-4 border-brand-dark p-6 text-center text-3xl text-brand-dark outline-none focus:ring-4 focus:ring-brand-accent/20 font-black placeholder:opacity-10"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
            {error && <p className="bg-red-500 text-white font-black p-3 text-center text-xs">{error}</p>}
            <button className="w-full py-6 bg-brand-dark text-white font-black text-2xl hover:bg-brand-accent transition-all shadow-2xl">כניסה למערכת ←</button>
          </form>

          <div className="mt-16 pt-10 border-t-2 border-brand-dark/10 flex flex-col items-center gap-4">
             <button 
               onClick={() => setMode('admin')} 
               className="group flex items-center gap-3 px-8 py-4 bg-white border-4 border-brand-dark text-brand-dark font-black text-xs uppercase tracking-[0.2em] hover:bg-brand-dark hover:text-white transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:shadow-none"
             >
               <span>ניהול מערכת (Admin)</span>
               <span className="text-lg">⚙️</span>
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="studio-card w-full max-w-lg p-12 border-brand-dark bg-white shadow-[16px_16px_0px_#1a1a1a] relative">
        <div className="flex flex-col items-center mb-10">
          <BrandLogo size="sm" />
          <h2 className="text-3xl font-black text-brand-dark mt-8 italic">{mode === 'employee' ? 'כניסת עובד למרחב' : 'התחברות ניהולית'}</h2>
        </div>

        <div className="flex bg-brand-beige p-1.5 mb-10 border-2 border-brand-dark/20 shadow-inner">
          <button onClick={() => setMode('login')} className={`flex-1 py-4 font-black text-[11px] uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:bg-brand-dark/5'}`}>כניסה</button>
          <button onClick={() => setMode('signup')} className={`flex-1 py-4 font-black text-[11px] uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-brand-accent text-white' : 'text-brand-muted hover:bg-brand-dark/5'}`}>הרשמה</button>
          <button onClick={() => setMode('employee')} className={`flex-1 py-4 font-black text-[11px] uppercase tracking-widest transition-all ${mode === 'employee' ? 'bg-brand-dark text-white' : 'text-brand-muted hover:bg-brand-dark/5'}`}>עובד</button>
        </div>

        <form onSubmit={handleAction} className="space-y-8 text-right">
          {error && <div className="bg-red-500 text-white p-4 text-center text-sm font-black">{error}</div>}
          
          <div className="space-y-3">
            <label className="text-[11px] font-black text-brand-dark uppercase tracking-widest pr-2">שם המרחב הצוותי</label>
            <input 
              type="text" 
              placeholder="e.g. google-team"
              className="w-full bg-white border-4 border-brand-dark p-5 text-2xl text-brand-dark outline-none text-left font-black focus:ring-4 focus:ring-brand-accent/20"
              value={teamId}
              disabled={!!(new URLSearchParams(window.location.search).get('teamId'))}
              onChange={(e) => setTeamId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            />
          </div>

          {(mode === 'login' || mode === 'signup') && (
            <div className="space-y-3">
              <label className="text-[11px] font-black text-brand-dark uppercase tracking-widest pr-2">סיסמה אישית</label>
              <input 
                type="password" 
                className="w-full bg-white border-4 border-brand-dark p-5 text-2xl text-brand-dark outline-none text-left font-black focus:ring-4 focus:ring-brand-accent/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="pt-6 space-y-6">
            <button type="submit" disabled={loading} className="w-full py-7 bg-brand-dark text-white font-black text-2xl hover:bg-brand-accent transition-all shadow-2xl active:scale-95">
              {loading ? "טוען..." : mode === 'signup' ? "פתח מרחב חדש" : "כניסה למערכת"}
            </button>
            <div className="flex justify-center">
              <button type="button" onClick={() => setMode('admin')} className="text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] hover:text-brand-dark border-b border-transparent hover:border-brand-dark transition-all">ADMIN ACCESS ⚙️</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
