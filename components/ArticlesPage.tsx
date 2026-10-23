import React from 'react';
import { Article } from '../types';

interface ArticlesPageProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ articles, onSelectArticle }) => {
  return (
    <div className="min-h-screen bg-brand-beige text-brand-dark" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-12 md:space-y-16 text-right">
        <section className="max-w-4xl space-y-6 border-r-4 border-brand-touch pr-6 md:pr-8">
          <div>
            <span className="text-xs font-bold text-brand-accent block mb-4">מאמרים ותוכן</span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
              חומרים מקצועיים.
            </h1>
          </div>
          <p className="text-lg md:text-2xl text-brand-muted max-w-3xl leading-relaxed">
            תובנות, כלים ומחשבות על ניהול, אסטרטגיה ואנשים.
          </p>
        </section>

        {articles.length === 0 ? (
          <div className="p-32 text-center border border-dashed border-brand-dark/10 opacity-40 font-light bg-white">
            המאמרים בטעינה...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map(article => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="p-6 md:p-8 bg-brand-paper border border-brand-dark/10 hover:border-brand-accent flex flex-col h-full cursor-pointer group transition-colors relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-1 h-0 group-hover:h-full bg-brand-touch transition-all duration-500"></div>

                <div className="flex justify-between items-start mb-8">
                  <span className="text-xs font-bold text-brand-accent bg-brand-sage/25 px-3 py-1">
                    {article.category}
                  </span>
                  <span className="text-xs text-brand-muted">{article.date}</span>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-brand-dark leading-tight group-hover:text-brand-accent transition-colors">
                    {article.title}
                  </h3>
                  {article.subtitle && (
                    <p className="text-brand-muted leading-relaxed">{article.subtitle}</p>
                  )}
                </div>

                <div className="pt-6 border-t border-brand-dark/5 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-bold text-brand-dark">לקריאת המאמר</span>
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