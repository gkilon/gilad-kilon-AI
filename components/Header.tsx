
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
    { id: 'clients', label: 'לקוחות ושותפים' },
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
      <header className="px-4 md:px-12 py-3 md:py-4 sticky top-0 z-[1000] bg-brand-beige/95 backdrop-blur-xl border-b border-brand-dark/10 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LEFT: Branding/Logo */}
          <div className="cursor-pointer shrink-0" onClick={() => handleNav('home')}>
            <BrandLogo size="sm" />
          </div>

          {/* CENTER: Main Navigation */}
          <nav className="hidden xl:flex items-center justify-center gap-8 flex-1 px-8">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => handleNav(item.id)} 
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-b-2 ${currentView === item.id ? 'border-brand-accent text-brand-dark' : 'border-transparent text-brand-muted hover:text-brand-dark hover:border-brand-dark/20'}`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="w-px h-6 bg-brand-dark/10 mx-2"></div>

            <button 
              onClick={() => handleNav('lab')} 
              className={`px-5 py-2 rounded-none border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 whitespace-nowrap ${isLabView ? 'bg-brand-dark text-white border-brand-dark' : 'text-brand-dark border-brand-dark/20 hover:border-brand-dark hover:bg-brand-dark/5'}`}
            >
              <LabIcon className="w-3.5 h-3.5" />
              <span>המעבדה (Workspace)</span>
            </button>
          </nav>

          {/* RIGHT: Auth & Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* OBT Link (Desktop) */}
            <a 
              href="http://obt.kilon-consulting.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex bg-[#f26522] text-white px-3 md:px-4 py-2 font-black text-[9px] uppercase tracking-widest shadow-md hover:bg-brand-dark transition-all whitespace-nowrap items-center gap-2"
            >
              <span>OBT</span>
              <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
            </a>

            {session ? (
              <div className="flex items-center gap-2 md:gap-3">
                {isAdmin && (
                  <button 
                    onClick={() => handleNav('admin')}
                    className="flex items-center gap-2 px-3 py-2 bg-brand-gold text-white font-black text-[9px] uppercase tracking-widest hover:bg-brand-dark transition-all shadow-sm border border-white/20"
                  >
                    <span>אזור עריכה</span>
                    <span className="hidden sm:inline">⚙️</span>
                  </button>
                )}
                <button 
                  onClick={onLogout} 
                  className="text-[9px] font-black text-brand-muted hover:text-red-600 uppercase tracking-widest transition-colors px-2 py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleNav('login')} 
                className="hidden lg:block px-6 py-2 bg-brand-dark text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-accent transition-all shadow-md"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="xl:hidden h-10 w-10 flex items-center justify-center text-brand-dark bg-white border-2 border-brand-dark/10 shadow-sm"
              aria-label="Open Menu"
            >
              <div className="w-5 h-3.5 flex flex-col justify-between items-end">
                <span className="h-0.5 bg-brand-dark w-5"></span>
                <span className="h-0.5 bg-brand-dark w-3"></span>
                <span className="h-0.5 bg-brand-dark w-5"></span>
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Full Screen Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-lg z-[99999] xl:hidden flex flex-col h-[100dvh] w-full overflow-hidden animate-fadeIn">
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
                  className={`block w-full text-lg font-black italic tracking-tighter text-right py-1 ${currentView === item.id ? 'text-brand-accent underline decoration-brand-accent/30 underline-offset-8' : 'text-brand-dark'}`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="h-px w-full bg-brand-dark/10 my-2"></div>
              
              <button 
                onClick={() => handleNav('lab')}
                className="block w-full text-lg font-black italic tracking-tighter text-brand-dark flex items-center justify-start gap-3 py-1"
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
                    <button onClick={() => handleNav('admin')} className="w-full py-3 bg-brand-gold text-white font-black text-sm italic shadow-md">
                      ניהול מערכת ⚙️
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
