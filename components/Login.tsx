
import React, { useState } from 'react';
import { BrandLogo } from './Landing';
import { createWorkspace, loginToWorkspace, isFirebaseReady } from '../firebase';

interface LoginProps {
  onLogin: (teamId: string, isManager: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'employee'>('login');
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const dbReady = isFirebaseReady();

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (!dbReady) {
      setError("המערכת חווה קשיי תקשורת זמניים. נא לרענן.");
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
        if (password.length < 4) {
          setError("הסיסמה חייבת להכיל לפחות 4 תווים");
          setLoading(false);
          return;
        }
        const res = await createWorkspace(tid, password);
        if (res.success) {
          setSuccessMsg("מרחב העבודה נוצר! מתחבר...");
          setTimeout(() => onLogin(tid, true), 1500);
        } else {
          setError(res.error || "שם המרחב כבר תפוס במערכת");
        }
      } else if (mode === 'login') {
        const res = await loginToWorkspace(tid, password);
        if (res.success) {
          onLogin(tid, true);
        } else {
          setError(res.error || "פרטי התחברות שגויים");
        }
      } else if (mode === 'employee') {
        onLogin(tid, false);
      }
    } catch (err: any) {
      setError(`אירעה שגיאה. נא לנסות שוב.`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-fadeIn">
      <div className="glass-card w-full max-w-lg rounded-[3.5rem] p-12 border-white/10 shadow-[0_0_80px_rgba(45,212,191,0.1)] relative overflow-hidden">
        {/* Progress Bar Indicator */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${dbReady ? 'via-cyan-brand' : 'via-red-500 animate-pulse'} to-transparent opacity-50`}></div>
        
        <div className="flex flex-col items-center mb-8">
          <BrandLogo size="sm" />
          <h2 className="text-3xl font-black text-white mt-6 tracking-tight italic">
            {mode === 'signup' ? 'Open New Workspace' : mode === 'login' ? 'Manager Access' : 'Team Pulse Entry'}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-1.5 h-1.5 rounded-full ${dbReady ? 'bg-cyan-brand' : 'bg-red-500'}`}></span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${dbReady ? 'text-slate-500' : 'text-red-400'}`}>
              {dbReady ? 'Cloud Environment Active' : 'Offline Mode'}
            </span>
          </div>
        </div>

        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl mb-8 border border-white/5">
          <button 
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            כניסת מנהל
          </button>
          <button 
            type="button"
            onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-cyan-brand text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            פתיחת מרחב
          </button>
          <button 
            type="button"
            onClick={() => { setMode('employee'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'employee' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Pulse צוות
          </button>
        </div>

        <form onSubmit={handleAction} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm font-bold animate-shake">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center text-sm font-bold animate-fadeIn">
              {successMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pr-4">שם מרחב עבודה / צוות</label>
            <input 
              type="text" 
              placeholder="למשל: gilad-team"
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-8 py-5 text-xl text-white outline-none focus:border-cyan-brand transition-all text-right font-bold"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            />
          </div>

          {(mode === 'login' || mode === 'signup') && (
            <div className="space-y-2 animate-slideDown">
              <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] pr-4">סיסמת המרחב</label>
              <input 
                type="password" 
                placeholder="****"
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-8 py-5 text-xl text-white outline-none focus:border-amber-500 transition-all text-right font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={loading || !dbReady}
            className={`w-full py-6 rounded-3xl font-black text-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${mode === 'signup' ? 'bg-cyan-brand text-slate-950' : mode === 'login' ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-950'} disabled:opacity-20`}
          >
            {loading ? (
              <div className="w-8 h-8 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{mode === 'signup' ? 'צור מרחב חדש' : mode === 'login' ? 'כניסה למרחב' : 'כניסה ל-Pulse'}</span>
                <span className="text-3xl">→</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em] leading-relaxed">
          {mode === 'signup' 
            ? 'Creating a workspace defines your strategic boundary.' 
            : 'All strategic data is synchronized in real-time.'}
        </p>
      </div>
    </div>
  );
};

export default Login;
