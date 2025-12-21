
import React, { useState } from 'react';
import { BrandLogo } from './Landing';
import { UserSession, ViewType } from '../types';

interface HeaderProps {
  onNavigate: (view: ViewType) => void;
  currentView: string;
  session: UserSession | null;
  onLogout: () => void;
}

const LabIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 2v7.5" />
    <path d="M14 2v7.5" />
    <path d="M8.5 2h7" />
    <path d="M14 9.5a5 5 0 1 1-4 0" />
    <path d="M5.5 16h13" />
    <path d="M10 16v.01" />
    <path d="M14 16v.01" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, session, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = session?.teamId === 'admin';

  const navItems: { id: ViewType; label: string }[] = [
    { id: 'home', label: 'דף הבית' },
    { id: 'about', label: 'אודות' },
    { id: 'clients', label: 'לקוחות' },
    { id: 'articles', label: 'חומרים מקצועיים' },
  ];

  const handleNav = (id: ViewType) => {
    onNavigate(id);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const isLabView = currentView === 'lab' || ['dashboard', 'executive', 'synergy', 'ideas', 'communication', 'feedback360', 'tasks', 'wizard'].includes(currentView);

  return (
    <>
      <header className="px-6 md:px-12 py-6 sticky top-0 z-[1000] bg-brand-beige/95 backdrop-blur-xl border-b border-brand-dark/10 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="cursor-pointer" onClick={() => handleNav('home')}>
            <BrandLogo size="sm" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center gap-10 border-l border-brand-dark/10 pl-10 ml-10">
              {navItems.filter(i => i.id !== 'home').map(item => (
                <button 
                  key={item.id}
                  onClick={() => handleNav(item.id)} 
                  className={`text-[13px] font-bold uppercase tracking-[0.2em] nav-underline transition-all ${currentView === item.id ? 'text-brand-dark' : 'text-brand-muted hover:text-brand-dark'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => handleNav('lab')} 
              className={`px-6 py-2 border border-brand-dark/20 rounded-full text-[13px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${isLabView ? 'bg-brand-dark text-white' : 'text-brand-dark hover:bg-brand-dark/5'}`}
            >
              <span>המעבדה (Workspace)</span>
              <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></span>
            </button>
          </nav>
          
          {/* Mobile Access Buttons */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Quick Access Lab Button for Mobile - Now with Lab Flask Icon */}
            <button 
              onClick={() => handleNav('lab')}
              className={`h-12 px-4 border-2 transition-all flex items-center justify-center gap-2 ${isLabView ? 'bg-brand-accent border-brand-accent text-white shadow-lg' : 'bg-white border-brand-dark text-brand-dark shadow-[4px_4px_0px_#1a1a1a]'}`}
              aria-label="The Lab"
            >
              <LabIcon className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">Workspace</span>
            </button>

            {/* Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="h-12 w-12 flex items-center justify-center text-brand-dark bg-white border-2 border-brand-dark/10 shadow-sm"
              aria-label="Open Menu"
            >
              <div className="w-6 h-4 flex flex-col justify-between items-end">
                <span className="h-0.5 bg-brand-dark w-6"></span>
                <span className="h-0.5 bg-brand-dark w-4"></span>
                <span className="h-0.5 bg-brand-dark w-6"></span>
              </div>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-6">
                {isAdmin && (
                  <button 
                    onClick={() => handleNav('admin')}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-brand-accent text-brand-accent font-black text-[10px] uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all"
                  >
                    <span>אזור עריכה</span>
                  </button>
                )}
                <button onClick={onLogout} className="text-[11px] font-black text-brand-muted hover:text-brand-dark uppercase tracking-widest transition-colors">Logout</button>
              </div>
            ) : (
              <button onClick={() => handleNav('login')} className="px-8 py-2.5 bg-brand-dark text-white rounded-none text-[11px] font-black uppercase tracking-[0.2em] hover:bg-brand-accent transition-all">Login</button>
            )}
          </div>
        </div>
      </header>

      {/* Full Screen Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-[99999] lg:hidden flex flex-col h-[100dvh] w-full overflow-hidden">
          <div className="flex items-center justify-between px-6 py-6 border-b border-brand-dark/10 bg-brand-beige shadow-sm">
            <div onClick={() => handleNav('home')}>
              <BrandLogo size="sm" />
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-4 text-brand-dark bg-white border-2 border-brand-dark rounded-full shadow-lg active:scale-90 transition-all"
              aria-label="Close Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-white px-8 py-12">
            <nav className="flex flex-col gap-10 text-right">
              {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`block w-full text-5xl font-black italic tracking-tighter text-right py-2 ${currentView === item.id ? 'text-brand-accent' : 'text-brand-dark'}`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="h-1.5 w-16 bg-brand-accent/30 mr-0"></div>
              
              <button 
                onClick={() => handleNav('lab')}
                className="block w-full text-5xl font-black italic tracking-tighter text-brand-accent flex items-center justify-end gap-4 py-2"
              >
                <span>המעבדה (Workspace)</span>
                <LabIcon className="w-8 h-8 animate-pulse" />
              </button>
            </nav>

            <div className="mt-20 pt-10 border-t-2 border-brand-dark/10 space-y-10 pb-32">
              {session ? (
                <div className="space-y-8">
                  <div className="bg-brand-beige p-8 border-r-8 border-brand-dark shadow-md text-right">
                    <p className="text-brand-muted font-bold text-xs mb-1 uppercase tracking-widest">מחובר כצוות</p>
                    <p className="text-brand-dark font-black text-2xl">{isAdmin ? 'מנהל מערכת' : session.teamId}</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleNav('admin')} className="w-full py-5 bg-brand-accent/5 text-brand-accent border-4 border-brand-accent font-black text-2xl italic shadow-lg">
                      אזור עריכה ⚙️
                    </button>
                  )}
                  <button onClick={onLogout} className="block w-full text-2xl font-black text-brand-muted underline decoration-2 decoration-brand-accent text-right">התנתק מהמערכת</button>
                </div>
              ) : (
                <button onClick={() => handleNav('login')} className="w-full py-8 bg-brand-dark text-white font-black text-2xl shadow-[10px_10px_0px_#2563eb] active:translate-x-1 active:translate-y-1 transition-all">
                  כניסה למרחב העבודה
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
