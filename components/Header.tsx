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

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, session, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isAdmin = session?.teamId === 'admin';
  const navItems: { id: ViewType; label: string }[] = [
    { id: 'home', label: 'ראשי' },
    { id: 'about', label: 'מי אני' },
    { id: 'clients', label: 'ניסיון ולקוחות' },
    { id: 'articles', label: 'תוכן מקצועי' },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: ViewType) => {
    onNavigate(id);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const isLabView = currentView === 'lab' || ['dashboard', 'executive', 'synergy', 'ideas', 'communication', 'feedback360', 'tasks', 'wizard'].includes(currentView);
  const linkClass = 'text-sm font-semibold transition-colors';

  return <>
    <motion.header className={`sticky top-0 z-[1000] w-full border-b backdrop-blur-md ${isScrolled ? 'py-2 bg-brand-beige/95 border-brand-dark/10 shadow-sm' : 'py-4 bg-brand-beige/90 border-brand-dark/5'}`}
      animate={{ paddingTop: isScrolled ? 8 : 16, paddingBottom: isScrolled ? 8 : 16 }} transition={{ duration: 0.25 }}>
      <div className="max-w-7xl mx-auto px-2 md:px-6 flex items-center justify-between gap-6">
        <button onClick={() => handleNav('home')} className="shrink-0" aria-label="לעמוד הראשי"><BrandLogo size="sm" /></button>
        <nav className="hidden lg:flex items-center gap-6 xl:gap-9">
          {navItems.map(item => <button key={item.id} onClick={() => handleNav(item.id)}
            className={`${linkClass} ${currentView === item.id ? 'text-brand-dark' : 'text-brand-muted hover:text-brand-dark'}`}>
            {item.label}{currentView === item.id && <span className="block h-0.5 bg-brand-accent mt-1" />}
          </button>)}
          <button onClick={() => handleNav('lab')} className={`px-4 py-2 border text-sm font-semibold transition-colors ${isLabView ? 'border-brand-accent text-brand-accent bg-white' : 'border-brand-dark/20 hover:border-brand-dark'}`}>כלים מקצועיים</button>
        </nav>
        <div className="flex items-center gap-3">
          <a href="https://obt.kilon-consulting.com/" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex text-xs font-bold text-brand-accent border border-brand-accent/30 px-3 py-2 hover:bg-brand-accent hover:text-white transition-colors">OBT</a>
          {session ? <div className="flex items-center gap-3">
            {isAdmin && <button onClick={() => handleNav('admin')} className="text-brand-dark" aria-label="ניהול">⚙️</button>}
            <button onClick={onLogout} className="text-xs font-bold text-brand-muted hover:text-brand-dark">יציאה</button>
          </div> : <button onClick={() => handleNav('login')} className="hidden md:block text-xs font-bold text-brand-muted hover:text-brand-dark">כניסה</button>}
          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2" aria-label="פתיחת תפריט">
            <div className="space-y-1.5 w-6"><span className="block h-0.5 w-full bg-brand-dark" /><span className="block h-0.5 w-2/3 bg-brand-dark mr-auto" /><span className="block h-0.5 w-full bg-brand-dark" /></div>
          </button>
        </div>
      </div>
    </motion.header>
    <AnimatePresence>
      {isMenuOpen && <motion.div className="fixed inset-0 z-[99999] bg-brand-beige flex flex-col lg:hidden" initial={{ opacity: 0, y: '5%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '5%' }} transition={{ duration: 0.2 }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-dark/10">
          <BrandLogo size="sm" /><button onClick={() => setIsMenuOpen(false)} className="p-2 text-2xl" aria-label="סגירת תפריט">×</button>
        </div>
        <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
          {navItems.map(item => <button key={item.id} onClick={() => handleNav(item.id)} className={`text-2xl ${currentView === item.id ? 'font-bold' : 'font-light text-brand-muted'}`}>{item.label}</button>)}
          <button onClick={() => handleNav('lab')} className="text-xl font-bold border border-brand-dark/20 px-6 py-3">כלים מקצועיים</button>
          <a href="https://obt.kilon-consulting.com/" target="_blank" rel="noopener noreferrer" className="text-brand-accent font-bold">תהליך OBT</a>
          {!session && <button onClick={() => handleNav('login')} className="text-brand-muted">כניסה</button>}
        </nav>
        <div className="px-6 py-8 text-center border-t border-brand-dark/10"><a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="inline-block bg-brand-dark text-white px-7 py-3 font-bold">נדבר</a></div>
      </motion.div>}
    </AnimatePresence>
  </>;
};

export default Header;
