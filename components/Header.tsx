
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
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
      <header className="px-6 py-4 sticky top-0 z-[1000] bg-brand-beige/95 backdrop-blur-md border-b border-brand-dark/5 w-full transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LEFT: Branding/Logo */}
          <div className="cursor-pointer shrink-0" onClick={() => handleNav('home')}>
            <BrandLogo size="sm" />
          </div>

          {/* CENTER: Main Navigation */}
          <nav className="hidden xl:flex items-center justify-center gap-10 flex-1 px-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap border-b-2 ${currentView === item.id ? 'border-brand-accent text-brand-dark' : 'border-transparent text-brand-muted hover:text-brand-dark'}`}
              >
                {item.label}
              </button>
            ))}

            <div className="w-px h-4 bg-brand-dark/10 mx-2"></div>

            <button
              onClick={() => handleNav('lab')}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2 border border-transparent hover:border-brand-dark/10 ${isLabView ? 'text-brand-accent' : 'text-brand-dark'}`}
            >
              <LabIcon className="w-4 h-4" />
              <span>Workspace</span>
            </button>
          </nav>

          {/* RIGHT: Auth & Actions */}
          <div className="flex items-center gap-4">
            {/* OBT Link (Desktop) */}
            <a
              href="http://obt.kilon-consulting.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex border border-[#f26522]/30 text-[#f26522] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#f26522] hover:text-white transition-all items-center gap-2 shadow-sm hover:shadow-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f26522] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f26522]"></span>
              </span>
              <span>OBT Platform</span>
            </a>

            {session ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <button
                    onClick={() => handleNav('admin')}
                    className="text-brand-dark hover:text-brand-accent transition-colors"
                  >
                    ⚙️
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="text-[10px] font-bold text-brand-muted hover:text-red-500 uppercase tracking-widest transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="hidden lg:block px-5 py-2 border border-brand-dark text-brand-dark text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-dark hover:text-white transition-all"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="xl:hidden p-2 text-brand-dark hover:bg-brand-dark/5 transition-colors"
              aria-label="Open Menu"
            >
              <div className="space-y-1.5 w-6">
                <span className="block h-0.5 w-full bg-brand-dark"></span>
                <span className="block h-0.5 w-2/3 bg-brand-dark ml-auto"></span>
                <span className="block h-0.5 w-full bg-brand-dark"></span>
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Full Screen Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-brand-beige z-[99999] xl:hidden flex flex-col h-[100dvh] w-full overflow-hidden animate-fadeIn">
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-dark/5">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-brand-dark hover:bg-brand-dark/5 transition-colors"
              aria-label="Close Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div onClick={() => handleNav('home')}>
              <BrandLogo size="sm" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-12 flex flex-col items-center justify-center text-center space-y-8">
            <nav className="flex flex-col gap-8 w-full">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`text-2xl font-light tracking-tight ${currentView === item.id ? 'text-brand-dark font-bold' : 'text-brand-muted hover:text-brand-dark'}`}
                >
                  {item.label}
                </button>
              ))}

              <div className="w-12 h-px bg-brand-dark/10 mx-auto my-4"></div>

              <button
                onClick={() => handleNav('lab')}
                className="text-xl font-light text-brand-dark flex items-center justify-center gap-3"
              >
                <LabIcon className="w-5 h-5 text-brand-accent" />
                <span>The Lab Workspace</span>
              </button>

              <a
                href="http://obt.kilon-consulting.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold uppercase tracking-widest text-[#f26522] mt-4"
              >
                OBT Platform
              </a>
            </nav>

            <div className="mt-auto pt-12 w-full space-y-6">
              {session ? (
                <div className="space-y-4">
                  <p className="text-brand-dark font-bold text-sm tracking-widest uppercase">{isAdmin ? 'Admin' : session.teamId}</p>
                  <button onClick={onLogout} className="text-sm text-brand-muted underline decoration-1 underline-offset-4">Sign Out</button>
                </div>
              ) : (
                <button onClick={() => handleNav('login')} className="w-full max-w-xs py-4 border border-brand-dark text-brand-dark font-bold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all">
                  Login Area
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
