
import React, { useState, useEffect } from 'react';
import { BrandLogo } from './Landing';
import { createWorkspace, loginToWorkspace, isFirebaseReady, getSystemConfig } from '../firebase';

interface LoginProps {
  onLogin: (teamId: string, isManager: boolean, isAdmin?: boolean) => void;
  message?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, message }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'employee' | 'admin'>('login');
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [masterCode, setMasterCode] = useState('GILAD2025');

  const dbReady = isFirebaseReady();

  useEffect(() => {
    // Check for teamId in URL
    const params = new URLSearchParams(window.location.search);
    const urlTeamId = params.get('teamId');
    if (urlTeamId) {
      setTeamId(urlTeamId);
      setMode('employee');
      setIsUnlocked(true);
    }

    if (dbReady) {
      getSystemConfig().then(config => setMasterCode(config.masterCode));
    }
  }, [dbReady]);

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
      if (password.trim().toLowerCase() === 'gilad_admin_99') {
        onLogin('admin', true, true);
      } else {
        setError("סיסמת ניהול שגויה");
      }
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
        // Employee entry - simple identification
        onLogin(tid, false);
      }
    } catch (err: any) {
      setError("שגיאת תקשורת");
    }
    setLoading(false);
  };

  const handlePersonalUse = () => {
    onLogin(`personal-${accessCode.toLowerCase()}`, true);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fadeIn">
        <div className="glass-card w-full max-w-md rounded-[3rem] p-12 border-amber-500/20 shadow-2xl text-center">
          <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-500/30">
            <span className="text-5xl">🔐</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-4 italic">שער כניסה</h2>
          <p className="text-slate-400 mb-8 font-medium">הזן את קוד הגישה שקיבלת מגלעד.</p>
          <form onSubmit={handleUnlock} className="space-y-6">
            <input 
              type="text" 
              placeholder="קוד גישה"
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-8 py-5 text-center text-xl text-white outline-none focus:border-amber-500 transition-all font-bold"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
            {error && <p className="text-red-400 font-bold text-sm">{error}</p>}
            <button className="w-full py-5 bg-amber-500 text-slate-950 rounded-2xl font-black text-xl hover:bg-white transition-all shadow-lg active:scale-95">המשך ←</button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
             <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">System Management</p>
             <button onClick={() => { setIsUnlocked(true); setMode('admin'); }} className="px-6 py-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-purple-500 hover:text-white transition-all">
               כניסת מנהל מערכת (ADMIN)
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fadeIn">
      {message && (
        <div className="w-full max-w-lg mb-8 bg-amber-500/10 border border-amber-500/30 p-6 rounded-[2rem] text-center shadow-lg">
          <p className="text-amber-500 font-black text-xl italic">{message}</p>
        </div>
      )}

      <div className="glass-card w-full max-w-lg rounded-[3.5rem] p-12 border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col items-center mb-8">
          <BrandLogo size="sm" />
          <h2 className="text-2xl font-black text-white mt-6 italic">{mode === 'employee' ? 'כניסת עובד למרחב' : 'התחברות ניהולית'}</h2>
        </div>

        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl mb-8 border border-white/5">
          <button onClick={() => setMode('login')} className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-purple-500 text-white' : 'text-slate-500 hover:text-white'}`}>כניסת מנהל</button>
          <button onClick={() => setMode('signup')} className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-cyan-brand text-slate-950' : 'text-slate-500 hover:text-white'}`}>פתיחת מרחב</button>
          <button onClick={() => setMode('employee')} className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${mode === 'employee' ? 'bg-white text-slate-950' : 'text-slate-500 hover:text-white'}`}>כניסת עובד</button>
        </div>

        <form onSubmit={handleAction} className="space-y-6">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm font-bold">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-4 italic">שם המרחב הצוותי</label>
            <input 
              type="text" 
              placeholder="management-2025"
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xl text-white outline-none text-right font-bold"
              value={teamId}
              disabled={!!(new URLSearchParams(window.location.search).get('teamId'))}
              onChange={(e) => setTeamId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            />
          </div>

          {(mode === 'login' || mode === 'signup') && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-4 italic">סיסמה אישית</label>
              <input 
                type="password" 
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xl text-white outline-none text-right font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="pt-4 space-y-4">
            <button type="submit" disabled={loading} className={`w-full py-6 rounded-3xl font-black text-xl transition-all shadow-xl active:scale-95 ${mode === 'signup' ? 'bg-cyan-brand text-slate-950' : mode === 'admin' ? 'bg-purple-500 text-white' : 'bg-white text-slate-950'}`}>
              {loading ? "מעבד..." : mode === 'signup' ? "פתח מרחב חדש" : "כניסה למערכת"}
            </button>
            
            {mode === 'employee' && (
              <p className="text-[10px] text-slate-500 text-center font-bold px-8">כניסת עובד נועדה למילוי שאלוני דופק ומשוב ללא גישה לנתוני הניהול וה-AI.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
