
import React, { useEffect, useState } from 'react';
import { Article } from '../types';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Dynamic SEO update
    const originalTitle = document.title;
    document.title = `${article.title} | גלעד קילון`;
    
    // Attempt to update Meta Tags (Best effort for dynamic bots)
    const updateMeta = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) || 
                    document.querySelector(`meta[name="${property}"]`);
      if (element) {
        element.setAttribute('content', content);
      }
    };

    updateMeta('og:title', article.title);
    updateMeta('og:description', article.subtitle || article.content?.substring(0, 150) || '');
    updateMeta('description', article.subtitle || article.content?.substring(0, 150) || '');

    return () => {
      document.title = originalTitle;
    };
  }, [article]);

  const getArticleUrl = () => {
    return `${window.location.origin}${window.location.pathname}?view=article_detail&articleId=${article.id}`;
  };

  const handleExternalLink = () => {
    if (article.link) {
      window.open(article.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    const url = getArticleUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareSocial = (platform: 'fb' | 'in') => {
    const url = encodeURIComponent(getArticleUrl());
    let shareUrl = '';
    
    if (platform === 'fb') {
      // For FB, adding the quote/title to the share URL helps context
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(article.title)}`;
    } else {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const ShareBar = () => (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-2">שתף:</span>
      <button 
        onClick={() => shareSocial('fb')}
        className="w-10 h-10 flex items-center justify-center border-2 border-brand-dark hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all text-brand-dark"
        title="Share on Facebook"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>
      <button 
        onClick={() => shareSocial('in')}
        className="w-10 h-10 flex items-center justify-center border-2 border-brand-dark hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white transition-all text-brand-dark"
        title="Share on LinkedIn"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </button>
      <button 
        onClick={handleShare}
        className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 font-black text-[10px] uppercase tracking-widest hover:bg-brand-accent transition-all shadow-[4px_4px_0px_#1a1a1a]"
      >
        <span>{copied ? "COPIED!" : "העתק קישור"}</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-24 animate-fadeIn space-y-12 pb-48 text-right px-6" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-brand-muted font-black text-sm uppercase tracking-widest hover:text-brand-dark transition-all group w-full md:w-auto"
        >
          <span>חזרה לכל המאמרים</span>
          <span className="text-xl group-hover:translate-x-1 transition-transform">←</span>
        </button>

        <ShareBar />
      </div>

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

        <footer className="mt-24 pt-10 border-t-2 border-brand-dark/10 flex flex-col items-center gap-10">
          <div className="h-2 w-24 bg-brand-accent"></div>
          
          <div className="space-y-4 text-center">
            <p className="text-brand-dark font-black text-sm uppercase tracking-widest">נהנית מהקריאה? שתף עם אחרים:</p>
            <div className="flex justify-center">
              <ShareBar />
            </div>
          </div>

          <p className="text-brand-muted font-black text-xs uppercase tracking-[0.4em]">Simple • Deep • Real</p>
        </footer>
      </article>
    </div>
  );
};

export default ArticleDetail;
