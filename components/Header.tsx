
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
    { id: 'home', label: 'עמוד ראשי' },
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
          
          {/* Mobile: Hamburger on the Right */}
          <div className="flex lg:hidden items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="h-10 w-10 flex items-center justify-center text-brand-dark bg-white border-2 border-brand-dark/10 shadow-sm"
              aria-label="Open Menu"
            >
              <div className="w-5 h-3.5 flex flex-col justify-between items-end">
                <span className="h-0.5 bg-brand-dark w-5"></span>
                <span className="h-0.5 bg-brand-dark w-5"></span>
                <span className="h-0.5 bg-brand-dark w-5"></span>
              </div>
            </button>
            <a 
              href="http://obt.kilon-consulting.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="h-10 px-4 bg-brand-accent border-2 border-brand-accent text-white shadow-lg flex items-center justify-center rounded-full"
            >
               <span className="text-[10px] font-black uppercase tracking-widest">OBT</span>
            </a>
          </div>

          {/* Desktop Nav - Centered */}
          <nav className="hidden lg:flex items-center gap-8 border-l border-brand-dark/10 pl-8 ml-8">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => handleNav(item.id)} 
                className={`text-[13px] font-bold uppercase tracking-[0.2em] nav-underline transition-all ${currentView === item.id ? 'text-brand-dark' : 'text-brand-muted hover:text-brand-dark'}`}
              >
                {item.label}
              </button>
            ))}
            <a 
              href="http://obt.kilon-consulting.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand-accent text-white px-5 py-2 rounded-full text-[13px] font-black uppercase tracking-[0.2em] hover:bg-brand-dark transition-all flex items-center gap-2 shadow-lg shadow-brand-accent/20"
            >
              <span>OBT</span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            </a>
            
            <button 
              onClick={() => handleNav('lab')} 
              className={`px-6 py-2 border border-brand-dark/20 rounded-full text-[13px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${isLabView ? 'bg-brand-dark text-white' : 'text-brand-dark hover:bg-brand-dark/5'}`}
            >
              <span>המעבדה (Workspace)</span>
            </button>
          </nav>

          {/* Brand Logo - Left */}
          <div className="cursor-pointer" onClick={() => handleNav('home')}>
            <BrandLogo size="sm" />
          </div>

          {/* Desktop Auth Actions */}
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

      {/* Full Screen Mobile Menu Overlay - Adjusted for transparency */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-lg z-[99999] lg:hidden flex flex-col h-[100dvh] w-full overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between px-6 py-6 border-b border-brand-dark/10 bg-white/30 shadow-sm">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-3 text-brand-dark bg-white border-2 border-brand-dark rounded-full shadow-lg active:scale-90 transition-all"
              aria-label="Close Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div onClick={() => handleNav('home')}>
              <BrandLogo size="sm" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-10 py-12 flex flex-col items-start">
            <nav className="flex flex-col gap-6 text-right w-full">
              <a 
                href="http://obt.kilon-consulting.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-base font-black italic tracking-tighter text-right py-1 text-[#f26522] flex items-center justify-start gap-3"
              >
                <span className="w-2.5 h-2.5 bg-[#f26522] rounded-full animate-pulse"></span>
                <span>OBT</span>
              </a>

              {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`block w-full text-base font-black italic tracking-tighter text-right py-1 ${currentView === item.id ? 'text-brand-accent underline decoration-brand-accent/30 underline-offset-8' : 'text-brand-dark'}`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="h-0.5 w-10 bg-brand-accent/20 mt-1"></div>
              
              <button 
                onClick={() => handleNav('lab')}
                className="block w-full text-base font-black italic tracking-tighter text-brand-dark flex items-center justify-start gap-3 py-1"
              >
                <LabIcon className="w-5 h-5 animate-pulse text-brand-accent" />
                <span>המעבדה (Workspace)</span>
              </button>
            </nav>

            <div className="mt-12 pt-6 border-t border-brand-dark/10 w-full space-y-6 pb-32">
              {session ? (
                <div className="space-y-4">
                  <div className="bg-white/40 p-5 border-r-4 border-brand-dark shadow-sm text-right">
                    <p className="text-brand-muted font-bold text-[8px] mb-1 uppercase tracking-widest">מחובר כצוות</p>
                    <p className="text-brand-dark font-black text-sm">{isAdmin ? 'מנהל מערכת' : session.teamId}</p>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleNav('admin')} className="w-full py-3 bg-brand-accent/5 text-brand-accent border-2 border-brand-accent font-black text-sm italic shadow-md">
                      אזור עריכה ⚙️
                    </button>
                  )}
                  <button onClick={onLogout} className="block w-full text-sm font-black text-brand-muted underline decoration-1 decoration-brand-accent text-right">התנתק מהמערכת</button>
                </div>
              ) : (
                <button onClick={() => handleNav('login')} className="w-full py-4 bg-brand-dark text-white font-black text-lg shadow-[6px_6px_0px_var(--brand-accent)] active:translate-x-1 active:translate-y-1 transition-all">
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
