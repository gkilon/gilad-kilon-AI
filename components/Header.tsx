import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo } from './Landing';
import { UserSession, ViewType } from '../types';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onNavigate: (view: ViewType) => void;
  currentView: string;
  session: UserSession | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, session, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
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

  const productGroups = [
    { title: 'ייעוץ ותהליכים', href: '/products/processes', description: 'פיתוח מנהלים, צוותים, ממשקים ושינוי' },
    { title: 'סדנאות והרצאות', href: '/products/workshops', description: 'מפגשים ממוקדים סביב אתגרים מקצועיים' }
  ];


  const isLabView = currentView === 'lab' || ['dashboard', 'executive', 'synergy', 'ideas', 'communication', 'feedback360', 'tasks', 'wizard'].includes(currentView);
  const linkClass = 'text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent';

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
          <div className="relative" onMouseEnter={() => setProductsMenuOpen(true)} onMouseLeave={() => setProductsMenuOpen(false)}>
            <button onClick={() => setProductsMenuOpen(v => !v)} aria-expanded={productsMenuOpen} className={`${linkClass} flex items-center gap-2 ${currentView.startsWith('products') ? 'text-brand-dark' : 'text-brand-muted hover:text-brand-dark'}`}>איך אפשר לעבוד יחד <span aria-hidden="true">⌄</span></button>
            {productsMenuOpen && <div className="absolute top-full right-0 pt-3 w-80 z-[1001]"><div className="bg-white border border-brand-dark/10 shadow-lg py-2">
              {productGroups.map(group => <button key={group.title} onClick={() => { setIsMenuOpen(false); setProductsMenuOpen(false); navigate(group.href); window.scrollTo(0, 0); }} className="block w-full text-right px-5 py-3 hover:bg-brand-beige"><span className="block text-sm font-bold">{group.title}</span><span className="block mt-1 text-xs text-brand-muted">{group.description}</span></button>)}
            </div></div>}
          </div>
          <button onClick={() => handleNav('lab')} className={`text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent ${isLabView ? 'text-brand-accent underline underline-offset-8' : 'text-brand-muted hover:text-brand-dark'}`}>המעבדה</button>
          <button onClick={() => { navigate('/contact'); window.scrollTo(0, 0); }} className="px-5 py-2.5 bg-brand-dark text-white text-sm font-semibold hover:bg-brand-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent">בואו נדבר</button>
        </nav>
        <div className="flex items-center gap-3">
          {session?.isAdmin ? <div className="flex items-center gap-3">
            {isAdmin && <button onClick={() => handleNav('admin')} className="text-brand-dark" aria-label="ניהול">⚙️</button>}
            <button onClick={onLogout} className="text-xs font-bold text-brand-muted hover:text-brand-dark">יציאה</button>
          </div> : null}
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
        <nav className="flex-1 flex flex-col items-center justify-start gap-7 px-6 py-8 overflow-y-auto">
          {navItems.map(item => <button key={item.id} onClick={() => handleNav(item.id)} className={`text-2xl ${currentView === item.id ? 'font-bold' : 'font-light text-brand-muted'}`}>{item.label}</button>)}
          <div className="w-full flex flex-col items-center gap-4">
            <button onClick={() => setProductsMenuOpen(v => !v)} className="text-xl font-bold" aria-expanded={productsMenuOpen}>איך אפשר לעבוד יחד <span aria-hidden="true">⌄</span></button>
            {productsMenuOpen && <div className="w-full max-w-sm bg-brand-paper border border-brand-dark/10 py-2 max-h-[45vh] overflow-y-auto">
              {productGroups.map(group => <button key={group.title} onClick={() => { setIsMenuOpen(false); setProductsMenuOpen(false); navigate(group.href); window.scrollTo(0, 0); }} className="block w-full text-right px-5 py-3 hover:bg-brand-beige"><span className="block text-sm font-bold">{group.title}</span><span className="block mt-1 text-xs text-brand-muted">{group.description}</span></button>)}
            </div>}
          </div>
          <button onClick={() => handleNav('lab')} className="text-xl font-bold px-6 py-3 underline underline-offset-8 decoration-brand-accent">המעבדה</button>
          <button onClick={() => { navigate('/contact'); setIsMenuOpen(false); window.scrollTo(0, 0); }} className="text-xl font-bold bg-brand-dark text-white px-6 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent">בואו נדבר</button>

        </nav>
        <div className="px-6 py-8 text-center border-t border-brand-dark/10"><p className="text-sm text-brand-muted">WhatsApp זמין גם דרך הכפתור הירוק באתר.</p></div>
      </motion.div>}
    </AnimatePresence>
  </>;
};

export default Header;
