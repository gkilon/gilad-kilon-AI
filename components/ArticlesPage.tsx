import React from 'react';
import { Article } from '../types';

interface ArticlesPageProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ articles, onSelectArticle }) => {
  return (
    <div className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto py-24 px-6 space-y-32 pb-48 text-right">
        <section className="text-center space-y-8 animate-fadeIn">
          <div className="inline-block border-b-2 border-brand-accent pb-4">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.4em] block mb-2">Knowledge Base</span>
            <h1 className="text-5xl md:text-8xl font-black text-brand-dark tracking-tighter italic uppercase leading-none">
              חומרים מקצועיים.
            </h1>
          </div>
          <p className="text-xl md:text-3xl text-brand-muted max-w-2xl mx-auto font-light leading-relaxed">
            "תובנות, כלים ומחשבות על ניהול, אסטרטגיה ואנשים."
          </p>
        </section>

        {articles.length === 0 ? (
          <div className="p-32 text-center border border-dashed border-brand-dark/10 opacity-40 font-light bg-white">
            המאמרים בטעינה...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map(article => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="arch-card p-10 bg-white border border-brand-dark/10 hover:border-brand-accent flex flex-col h-full cursor-pointer group transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-1 h-0 group-hover:h-full bg-brand-accent transition-all duration-500"></div>

                <div className="flex justify-between items-start mb-8">
                  <span className="text-[9px] font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/5 px-2 py-1 border border-brand-accent/10">
                    {article.category}
                  </span>
                  <span className="text-[10px] font-mono text-brand-muted/50 uppercase tracking-widest">{article.date}</span>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  <h3 className="text-2xl font-black text-brand-dark leading-tight group-hover:text-brand-accent transition-colors">
                    {article.title}
                  </h3>
                  {article.subtitle && (
                    <p className="text-brand-muted font-light leading-relaxed">{article.subtitle}</p>
                  )}
                </div>

                <div className="pt-6 border-t border-brand-dark/5 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark">לקריאת המאמר</span>
                  <span className="text-xl group-hover:translate-x-[-5px] transition-transform">←</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;