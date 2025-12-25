
import React, { useState } from 'react';
import { Article } from '../types';

interface ArticlesPageProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ articles, onSelectArticle }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getArticleUrl = (articleId: string) => {
    return `${window.location.origin}${window.location.pathname}?view=article_detail&articleId=${articleId}`;
  };

  const handleShare = (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    const url = getArticleUrl(article.id);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const shareSocial = (e: React.MouseEvent, platform: 'fb' | 'in', article: Article) => {
    e.stopPropagation();
    const url = encodeURIComponent(getArticleUrl(article.id));
    let shareUrl = '';
    
    if (platform === 'fb') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

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
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-2">{article.date}</span>
                  
                  {/* Social Share Group */}
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => shareSocial(e, 'fb', article)}
                      className="p-1.5 border border-brand-dark/10 hover:bg-[#1877F2] hover:text-white transition-all text-brand-muted"
                      title="Share on Facebook"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => shareSocial(e, 'in', article)}
                      className="p-1.5 border border-brand-dark/10 hover:bg-[#0A66C2] hover:text-white transition-all text-brand-muted"
                      title="Share on LinkedIn"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleShare(e, article)}
                      className="p-1.5 border border-brand-dark/10 hover:bg-brand-dark hover:text-white transition-all text-brand-muted"
                      title="Copy Link"
                    >
                      {copiedId === article.id ? (
                        <span className="text-[7px] font-black text-brand-accent">COPIED</span>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
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
