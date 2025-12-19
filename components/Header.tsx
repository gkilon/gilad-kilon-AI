
import React from 'react';
import { BrandLogo } from './Landing';
import { UserSession } from '../types';

interface HeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
  session: UserSession | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, session, onLogout }) => {
  return (
    <header className="px-10 py-6 border-b border-white/5 bg-slate-950/95 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10 cursor-pointer group pr-10 border-r border-white/10" onClick={() => onNavigate('home')}>
          <div className="scale-[0.5] transition-transform group-hover:scale-[0.55] duration-500 origin-right">
             <BrandLogo size="lg" />
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-12">
          <div className="flex items-center gap-8 border-l border-white/10 pl-12 ml-4">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] select-none">אסטרטגיה</span>
            {[
              { id: 'executive', label: 'הנהלה' },
              { id: 'dashboard', label: 'שינוי' },
              { id: 'tasks', label: 'משימות' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)} 
                className={`text-[15px] font-black uppercase tracking-wider transition-all relative py-2 ${currentView === item.id ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}
              >
                {item.label}
                {currentView === item.id && <span className="absolute -bottom-1 left-0 w-full h-1 bg-purple-500 rounded-full shadow-[0_0_15px_#a855f7]"></span>}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] select-none">תובנות</span>
            {[
              { id: 'synergy', label: 'דופק' },
              { id: 'ideas', label: 'רעיונות' },
              { id: 'communication', label: 'DNA' },
              { id: 'feedback360', label: '360' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)} 
                className={`text-[15px] font-black uppercase tracking-wider transition-all relative py-2 ${currentView === item.id ? 'text-cyan-brand' : 'text-slate-400 hover:text-white'}`}
              >
                {item.label}
                {currentView === item.id && <span className="absolute -bottom-1 left-0 w-full h-1 bg-cyan-brand rounded-full shadow-[0_0_15px_#2dd4bf]"></span>}
              </button>
            ))}
          </div>
        </nav>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate('about')}
            className={`px-8 py-3 rounded-full transition-all border-2 text-[12px] font-black uppercase tracking-[0.2em] ${
              currentView === 'about' ? 'bg-white text-slate-950 border-white shadow-xl' : 'border-white/10 text-slate-400 hover:text-white hover:border-white/30'
            }`}
          >
            גלעד
          </button>
          
          {session ? (
            <button onClick={onLogout} className="px-4 py-2 text-[12px] font-black text-slate-500 hover:text-rose-400 uppercase tracking-widest transition-colors">התנתק</button>
          ) : (
            <button onClick={() => onNavigate('login')} className="px-10 py-3 bg-white text-slate-950 rounded-full text-[12px] font-black uppercase tracking-widest hover:bg-cyan-brand transition-all shadow-xl active:scale-95">כניסה</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
