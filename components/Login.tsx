
import React, { useState } from 'react';
import { BrandLogo } from './Landing';

interface LoginProps {
  onLogin: (teamId: string, isManager: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'manager' | 'employee'>('employee');
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId.trim()) {
      alert("נא להזין קוד צוות");
      return;
    }
    
    if (mode === 'manager' && password !== 'gilad2025') {
      alert("קוד ניהול שגוי");
      return;
    }
    
    onLogin(teamId.trim().toLowerCase(), mode === 'manager');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-fadeIn">
      <div className="glass-card w-full max-w-lg rounded-[3.5rem] p-12 border-white/10 shadow-[0_0_80px_rgba(45,212,191,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-brand to-transparent opacity-50"></div>
        
        <div className="flex flex-col items-center mb-10">
          <BrandLogo size="sm" />
          <h2 className="text-3xl font-black text-white mt-6 tracking-tight italic">Portal Access</h2>
        </div>

        <div className="flex bg-slate-900/50 p-2 rounded-2xl mb-10 border border-white/5">
          <button 
            onClick={() => setMode('employee')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${mode === 'employee' ? 'bg-cyan-brand text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            צוות / עובד
          </button>
          <button 
            onClick={() => setMode('manager')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${mode === 'manager' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            מנהל מערכת
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pr-4">Team Workspace Code</label>
            <input 
              type="text" 
              placeholder="הזן קוד צוות (למשל: משה)..."
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-8 py-5 text-xl text-white outline-none focus:border-cyan-brand transition-all text-right font-bold"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            />
          </div>

          {mode === 'manager' && (
            <div className="space-y-2 animate-slideDown">
              <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] pr-4">Admin Access Key</label>
              <input 
                type="password" 
                placeholder="קוד גישה ניהולי..."
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-8 py-5 text-xl text-white outline-none focus:border-amber-500 transition-all text-right font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit"
            className={`w-full py-6 rounded-3xl font-black text-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${mode === 'manager' ? 'bg-amber-500 text-slate-950' : 'bg-cyan-brand text-slate-950'}`}
          >
            כניסה למערכת
            <span className="text-3xl">→</span>
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
          Secure Session • Gilad Kilon Strategy Lab
        </p>
      </div>
    </div>
  );
};

export default Login;
