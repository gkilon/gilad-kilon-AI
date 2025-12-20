
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
    <header className="px-6 md:px-12 py-6 sticky top-0 z-50 bg-brand-beige/90 backdrop-blur-xl border-b border-brand-dark/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="cursor-pointer" onClick={() => onNavigate('home')}>
          <BrandLogo size="sm" />
        </div>

        <nav className="hidden lg:flex items-center">
          <div className="flex items-center gap-10 border-l border-brand-dark/10 pl-10 ml-10">
            {[
              { id: 'about', label: 'אודות' },
              { id: 'clients', label: 'לקוחות' },
              { id: 'articles', label: 'חומרים מקצועיים' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id)} 
                className={`text-[13px] font-bold uppercase tracking-[0.2em] nav-underline transition-all ${currentView === item.id ? 'text-brand-dark' : 'text-brand-muted hover:text-brand-dark'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => onNavigate('lab')} 
            className={`px-6 py-2 border border-brand-dark/20 rounded-full text-[13px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${currentView === 'lab' || ['dashboard', 'executive', 'synergy', 'ideas', 'communication', 'feedback360'].includes(currentView) ? 'bg-brand-dark text-white' : 'text-brand-dark hover:bg-brand-dark/5'}`}
          >
            <span>המעבדה</span>
            <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></span>
          </button>
        </nav>
        
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-brand-dark/40 uppercase hidden md:inline">Team: {session.teamId}</span>
              <button onClick={onLogout} className="text-[11px] font-black text-brand-muted hover:text-brand-dark uppercase tracking-widest transition-colors">Logout</button>
            </div>
          ) : (
            <button onClick={() => onNavigate('login')} className="px-8 py-2.5 bg-brand-dark text-white rounded-none text-[11px] font-black uppercase tracking-[0.2em] hover:bg-brand-accent transition-all shadow-lg">Login</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
