
import React, { useEffect } from 'react';
import { Article } from '../types';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article]);

  const handleExternalLink = () => {
    if (article.link) {
      window.open(article.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-24 animate-fadeIn space-y-12 pb-48 text-right px-6" dir="rtl">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-brand-muted font-black text-sm uppercase tracking-widest hover:text-brand-dark transition-all group"
      >
        <span>חזרה לכל המאמרים</span>
        <span className="text-xl group-hover:translate-x-1 transition-transform">←</span>
      </button>

      <article className="studio-card p-10 md:p-20 bg-white border-brand-dark shadow-[20px_20px_0px_rgba(90,125,154,0.1)]">
        <header className="space-y-8 mb-16 border-b-2 border-brand-dark pb-12">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-brand-accent uppercase tracking-[0.3em]">{article.category}</span>
            <span className="text-xs font-black text-brand-muted uppercase tracking-[0.3em]">{article.date}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-brand-dark italic tracking-tighter leading-none">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="text-2xl md:text-3xl text-brand-muted font-bold italic leading-tight">
              {article.subtitle}
            </p>
          )}
        </header>

        {article.link ? (
          <div className="py-20 text-center space-y-10">
            <div className="text-8xl">🔗</div>
            <p className="text-2xl font-bold text-brand-dark">המאמר המלא זמין בקישור חיצוני</p>
            <button 
              onClick={handleExternalLink}
              className="bg-brand-dark text-white px-12 py-6 font-black text-xl hover:bg-brand-accent transition-all shadow-xl active:scale-95"
            >
              למעבר למאמר המלא ←
            </button>
          </div>
        ) : (
          <div className="prose prose-xl max-w-none">
            <div className="text-xl md:text-2xl text-brand-dark leading-[1.8] font-medium whitespace-pre-wrap italic">
              {article.content || "התוכן בתהליך עדכון..."}
            </div>
          </div>
        )}

        <footer className="mt-24 pt-10 border-t-2 border-brand-dark/10 flex flex-col items-center gap-6">
          <div className="h-2 w-24 bg-brand-accent"></div>
          <p className="text-brand-muted font-black text-xs uppercase tracking-[0.4em]">Simple • Deep • Real</p>
        </footer>
      </article>
    </div>
  );
};

export default ArticleDetail;
