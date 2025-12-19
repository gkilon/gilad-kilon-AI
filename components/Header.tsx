
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
    <header className="px-3 md:px-10 py-4 md:py-6 border-b border-white/5 bg-slate-950/95 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-1">
        
        <div className="flex items-center gap-1 md:gap-10 cursor-pointer group pr-1 md:pr-10 border-r border-white/10 shrink-0" onClick={() => onNavigate('home')}>
          <div className="scale-[0.3] sm:scale-[0.4] md:scale-[0.5] transition-transform group-hover:scale-[0.35] md:group-hover:scale-[0.55] duration-500 origin-right">
             <BrandLogo size="lg" />
          </div>
        </div>

        <nav className="hidden xl:flex items-center gap-12 flex-1 justify-center">
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
        
        <div className="flex items-center gap-2 md:gap-8 shrink-0">
          <button 
            onClick={() => onNavigate('about')}
            className={`px-4 md:px-8 py-2 md:py-3 rounded-full transition-all border-2 text-[11px] md:text-[14px] font-black uppercase tracking-wider shadow-lg active:scale-95 whitespace-nowrap ${
              currentView === 'about' 
                ? 'bg-white text-slate-950 border-white' 
                : 'bg-amber-400 text-slate-950 border-amber-400 hover:bg-amber-300 hover:border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
            }`}
          >
            אודות
          </button>
          
          <div className="flex items-center">
            {session ? (
              <button onClick={onLogout} className="px-1 md:px-4 py-2 text-[10px] md:text-[12px] font-black text-slate-500 hover:text-rose-400 uppercase tracking-widest transition-colors">התנתק</button>
            ) : (
              <button onClick={() => onNavigate('login')} className="px-3 md:px-10 py-2 md:py-3 bg-white text-slate-950 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-widest hover:bg-cyan-brand transition-all shadow-xl active:scale-95">כניסה</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
