
import React, { useState } from 'react';
import { BrandLogo } from './Landing';
import { createWorkspace, loginToWorkspace } from '../firebase';

interface LoginProps {
  onLogin: (teamId: string, isManager: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'employee'>('login');
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!teamId.trim()) {
      setError("נא להזין שם מרחב עבודה / צוות");
      return;
    }

    setLoading(true);
    const tid = teamId.trim().toLowerCase();

    if (mode === 'signup') {
      if (password.length < 4) {
        setError("הסיסמה חייבת להכיל לפחות 4 תווים");
        setLoading(false);
        return;
      }
      const res = await createWorkspace(tid, password);
      if (res.success) {
        onLogin(tid, true);
      } else {
        setError(res.error || "שגיאה ביצירת המרחב");
      }
    } else if (mode === 'login') {
      const res = await loginToWorkspace(tid, password);
      if (res.success) {
        onLogin(tid, true);
      } else {
        setError(res.error || "פרטי התחברות שגויים");
      }
    } else if (mode === 'employee') {
      // Employees don't need password for Pulse, but the workspace must exist
      onLogin(tid, false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-fadeIn">
      <div className="glass-card w-full max-w-lg rounded-[3.5rem] p-12 border-white/10 shadow-[0_0_80px_rgba(45,212,191,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-brand to-transparent opacity-50"></div>
        
        <div className="flex flex-col items-center mb-8">
          <BrandLogo size="sm" />
          <h2 className="text-3xl font-black text-white mt-6 tracking-tight italic">
            {mode === 'signup' ? 'Create Workspace' : mode === 'login' ? 'Manager Access' : 'Employee Login'}
          </h2>
        </div>

        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl mb-8 border border-white/5">
          <button 
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            כניסת מנהל
          </button>
          <button 
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-cyan-brand text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            פתיחת מרחב
          </button>
          <button 
            onClick={() => { setMode('employee'); setError(''); }}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'employee' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}
          >
            עובד (Pulse)
          </button>
        </div>

        <form onSubmit={handleAction} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pr-4">Workspace Name / Team ID</label>
            <input 
              type="text" 
              placeholder="שם הצוות שלך (באנגלית)..."
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-8 py-5 text-xl text-white outline-none focus:border-cyan-brand transition-all text-right font-bold"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value.toLowerCase().replace(/\s+/g, ''))}
            />
          </div>

          {(mode === 'login' || mode === 'signup') && (
            <div className="space-y-2 animate-slideDown">
              <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] pr-4">Password</label>
              <input 
                type="password" 
                placeholder="סיסמה..."
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-8 py-5 text-xl text-white outline-none focus:border-amber-500 transition-all text-right font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-6 rounded-3xl font-black text-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${mode === 'signup' ? 'bg-cyan-brand text-slate-950' : mode === 'login' ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-950'}`}
          >
            {loading ? (
              <div className="w-8 h-8 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{mode === 'signup' ? 'יצירת מרחב עבודה' : 'כניסה למערכת'}</span>
                <span className="text-3xl">→</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em] leading-relaxed">
          {mode === 'signup' 
            ? 'By creating a workspace, you isolate your team data from others.' 
            : 'Secure session with Real-Time Firestore Sync.'}
        </p>
      </div>
    </div>
  );
};

export default Login;
