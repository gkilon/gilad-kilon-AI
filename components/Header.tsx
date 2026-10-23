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

  const productItems = [
    { slug: 'obt', label: 'תהליך OBT להתפתחות אישית' },
    { slug: 'feedback', label: 'משוב שמייצר התפתחות' },
    { slug: 'communication-styles', label: 'סדנת סגנונות תקשורת' },
    { slug: 'system-and-relationships', label: 'מערכת ויחסים: סדנת שותפויות' },
    { slug: 'negotiation-to-partnership', label: 'ממשא ומתן לבניית שותפויות' },
    { slug: 'obt-capsule', label: 'קפסולת OBT' },
    { slug: 'system-and-relationships-lecture', label: 'בין מערכת ליחסים' },
    { slug: 'technology-and-relationships', label: 'כשהטכנולוגיה משתגעת, מישהו צריך להישאר שפוי' }
  ];
  const handleProducts = (slug?: string) => {
    setIsMenuOpen(false);
    setProductsMenuOpen(false);
    navigate(slug ? '/products/' + slug : '/products');
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
          <div className="relative" onMouseEnter={() => setProductsMenuOpen(true)} onMouseLeave={() => setProductsMenuOpen(false)}>
            <button onClick={() => setProductsMenuOpen(v => !v)} aria-expanded={productsMenuOpen} className={`${linkClass} flex items-center gap-2 ${currentView.startsWith('products') ? 'text-brand-dark' : 'text-brand-muted hover:text-brand-dark'}`}>מוצרים וסדנאות <span aria-hidden="true">⌄</span></button>
            {productsMenuOpen && <div className="absolute top-full right-0 pt-3 w-80 z-[1001]"><div className="bg-white border border-brand-dark/10 shadow-lg py-2">
              <button onClick={() => handleProducts()} className="block w-full text-right px-5 py-3 text-sm font-bold hover:bg-brand-beige">כל המוצרים והסדנאות</button>
              <div className="border-t border-brand-dark/10 my-1" />
              {productItems.map(item => <button key={item.slug} onClick={() => handleProducts(item.slug)} className="block w-full text-right px-5 py-2.5 text-sm hover:bg-brand-beige">{item.label}</button>)}
            </div></div>}
          </div>
          <button onClick={() => handleNav('lab')} className={`px-4 py-2 border text-sm font-semibold transition-colors ${isLabView ? 'border-brand-accent text-brand-accent bg-white' : 'border-brand-dark/20 hover:border-brand-dark'}`}>המעבדה</button>
        </nav>
        <div className="flex items-center gap-3">
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
          <div className="w-full flex flex-col items-center gap-4">
            <button onClick={() => setProductsMenuOpen(v => !v)} className="text-xl font-bold" aria-expanded={productsMenuOpen}>מוצרים וסדנאות <span aria-hidden="true">⌄</span></button>
            {productsMenuOpen && <div className="w-full max-w-sm bg-white border border-brand-dark/10 py-2">
              <button onClick={() => handleProducts()} className="block w-full text-right px-5 py-3 text-sm font-bold hover:bg-brand-beige">כל המוצרים והסדנאות</button>
              {productItems.map(item => <button key={item.slug} onClick={() => handleProducts(item.slug)} className="block w-full text-right px-5 py-2.5 text-sm hover:bg-brand-beige">{item.label}</button>)}
            </div>}
          </div>
          <button onClick={() => handleNav('lab')} className="text-xl font-bold border border-brand-dark/20 px-6 py-3">המעבדה</button>
          {!session && <button onClick={() => handleNav('login')} className="text-brand-muted">כניסה</button>}
        </nav>
        <div className="px-6 py-8 text-center border-t border-brand-dark/10"><a href="https://wa.me/972526417512" target="_blank" rel="noopener noreferrer" className="inline-block bg-brand-dark text-white px-7 py-3 font-bold">נדבר</a></div>
      </motion.div>}
    </AnimatePresence>
  </>;
};

export default Header;
