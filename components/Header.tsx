
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const isAdmin = session?.teamId === 'admin';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      <motion.header
        className={`px-6 sticky top-0 z-[1000] backdrop-blur-md border-b w-full ${
          isScrolled
            ? 'py-2 bg-gradient-to-r from-brand-beige/95 via-white/90 to-brand-beige/95 border-brand-accent/20 shadow-sm'
            : 'py-4 bg-gradient-to-r from-brand-beige/90 via-white/85 to-brand-beige/90 border-brand-accent/10'
        }`}
        animate={{ paddingTop: isScrolled ? 8 : 16, paddingBottom: isScrolled ? 8 : 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LEFT: Branding/Logo */}
          <div className="cursor-pointer shrink-0" onClick={() => handleNav('home')}>
            <BrandLogo size="sm" />
          </div>

          {/* CENTER: Main Navigation */}
          <nav className="hidden xl:flex items-center justify-center gap-10 flex-1 px-8">
            {navItems.map(item => (
              <motion.button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative text-[11px] font-bold uppercase tracking-[0.15em] transition-colors whitespace-nowrap pb-1 ${
                  currentView === item.id ? 'text-brand-dark' : 'text-brand-muted hover:text-brand-dark'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
                {currentView === item.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}

            <div className="w-px h-4 bg-brand-dark/10 mx-2"></div>

            <motion.button
              onClick={() => handleNav('lab')}
              className={`px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-3 border-2 ${isLabView ? 'bg-gradient-to-r from-brand-accent to-brand-touch text-white border-brand-accent shadow-lg shadow-brand-accent/30' : 'bg-gradient-to-r from-brand-dark to-brand-navy text-white border-brand-dark hover:from-brand-accent hover:to-brand-touch hover:border-brand-accent shadow-lg'} rounded-lg`}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.5 }}
              >
                <LabIcon className="w-5 h-5" />
              </motion.div>
              <span>Workspace</span>
              <motion.div
                className="w-2 h-2 bg-brand-gold rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          </nav>

          {/* RIGHT: Auth & Actions */}
          <div className="flex items-center gap-4">
            {/* OBT Link (Desktop) */}
            <motion.a
              href="https://obt.kilon-consulting.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex border border-[#f26522]/30 text-[#f26522] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#f26522] hover:text-white transition-all items-center gap-2 shadow-sm hover:shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span 
                className="relative flex h-2 w-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f26522] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f26522]"></span>
              </motion.span>
              <span>OBT Platform</span>
            </motion.a>

            {session ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <motion.button
                    onClick={() => handleNav('admin')}
                    className="text-brand-dark hover:text-brand-accent transition-colors"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    ⚙️
                  </motion.button>
                )}
                <motion.button
                  onClick={onLogout}
                  className="text-[10px] font-bold text-brand-muted hover:text-brand-accent uppercase tracking-widest transition-colors"
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => handleNav('login')}
                className="hidden lg:block px-5 py-2 border border-brand-accent text-brand-accent text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-accent hover:text-white transition-all"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Login
              </motion.button>
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
      </motion.header>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-brand-beige z-[99999] xl:hidden flex flex-col h-[100dvh] w-full overflow-hidden"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
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
              {navItems.map((item, idx) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.06 }}
                  onClick={() => handleNav(item.id)}
                  className={`text-2xl font-light tracking-tight ${currentView === item.id ? 'text-brand-dark font-bold' : 'text-brand-muted hover:text-brand-dark'}`}
                >
                  {item.label}
                </motion.button>
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
                href="https://obt.kilon-consulting.com/"
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
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};

export default Header;
