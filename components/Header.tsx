
import React from 'react';
import { BrandLogo } from './Landing';

interface HeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="px-8 py-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-3xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 cursor-pointer group pr-6 border-r border-white/10" onClick={() => onNavigate('home')}>
          <BrandLogo size="sm" />
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
          <button 
            onClick={() => onNavigate('about')}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 border font-bold ${
              currentView === 'about' 
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
              : 'border-amber-500/40 text-amber-500 hover:bg-amber-500/10'
            }`}
          >
            קצת עליי
          </button>

          <div className="h-4 w-px bg-white/10 mx-2"></div>

          {[
            { id: 'dashboard', label: 'ניהול השינוי' },
            { id: 'tasks', label: 'משימות' },
            { id: 'executive', label: 'פורום הנהלה' },
            { id: 'synergy', label: 'דופק צוותי' },
            { id: 'ideas', label: 'רעיונות' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id)} 
              className={`${currentView === item.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'} transition-all relative py-2 group/nav`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-white/20 rounded-full transition-all duration-500 ${currentView === item.id ? 'w-full' : 'w-0 group-hover/nav:w-1/2'}`}></span>
            </button>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="px-5 py-2 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            Main Hub
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
