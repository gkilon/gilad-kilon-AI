
import React from 'react';
import { Article } from '../types';

interface ArticlesPageProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ articles, onSelectArticle }) => {
  return (
    <div className="max-w-6xl mx-auto py-24 animate-fadeIn space-y-16 pb-48 text-right px-6" dir="rtl">
      <section className="text-center space-y-8">
        <div className="inline-block border-2 border-brand-dark p-8 shadow-[8px_8px_0px_#1a1a1a] bg-white">
          <h1 className="text-5xl md:text-8xl font-black text-brand-dark tracking-tighter italic uppercase leading-none">
            חומרים מקצועיים.
          </h1>
        </div>
        <p className="text-xl md:text-3xl text-brand-muted max-w-2xl mx-auto font-medium leading-relaxed italic">
          "תובנות, כלים ומחשבות על ניהול, אסטרטגיה ואנשים."
        </p>
      </section>

      {articles.length === 0 ? (
        <div className="studio-card p-32 text-center border-dashed border-brand-dark/20 opacity-30 italic bg-white/50">
           המאמרים בטעינה או שטרם נוספו חומרים...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {articles.map(article => (
            <div 
              key={article.id} 
              onClick={() => onSelectArticle(article)}
              className="studio-card p-10 bg-white border-brand-dark hover:border-brand-accent transition-all group cursor-pointer flex flex-col h-full shadow-[10px_10px_0px_rgba(26,26,26,0.05)]"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest bg-brand-accent/5 px-3 py-1 border border-brand-accent/10">
                  {article.category}
                </span>
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{article.date}</span>
              </div>
              
              <div className="flex-1 space-y-4 mb-8">
                <h3 className="text-3xl font-black text-brand-dark italic leading-tight group-hover:text-brand-accent transition-colors">
                  {article.title}
                </h3>
                {article.subtitle && (
                  <p className="text-brand-muted font-bold italic leading-relaxed">{article.subtitle}</p>
                )}
              </div>

              <div className="pt-6 border-t border-brand-dark/5 flex justify-between items-center">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-dark">לקריאת המאמר</span>
                <span className="text-2xl group-hover:translate-x-[-10px] transition-transform">←</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
