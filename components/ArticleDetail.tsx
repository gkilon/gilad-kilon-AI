import React, { useEffect } from 'react';
import { Article } from '../types';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

  const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Update meta tags for article sharing
    const updateMetaTags = () => {
      // Update title
      document.title = article.title;
      
      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      const description = article.subtitle || article.content?.substring(0, 160) || 'מאמר מקצועי מאת גלעד קילון - ייעוץ ארגוני ופיתוח מנהלים';
      metaDescription.setAttribute('content', description);
      
      // Update Open Graph tags
      const updateOgTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };
      
      updateOgTag('og:title', article.title);
      updateOgTag('og:description', description);
      updateOgTag('og:url', window.location.href);
      updateOgTag('og:image', 'https://kilon.org/profile.jpg');
      updateOgTag('og:type', 'article');
      
      // Update Twitter card tags
      const updateTwitterTag = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };
      
      updateTwitterTag('twitter:title', article.title);
      updateTwitterTag('twitter:description', description);
      updateTwitterTag('twitter:image', 'https://kilon.org/profile.jpg');
      updateTwitterTag('twitter:card', 'summary_large_image');
    };
    
    updateMetaTags();
    
    // Cleanup function to restore original meta tags when leaving
    return () => {
      document.title = 'גלעד קילון | ייעוץ ארגוני, פיתוח מנהלים וצוותי הנהלה';
      
      const originalDescription = 'גלעד קילון - ייעוץ ארגוני ופיתוח מנהלים. מומחה בליווי צוותי הנהלה, פיתוח צוותים, עבודת ממשקים ובניית שותפויות לשיפור התקשורת הבין-אישית והצמיחה העסקית.';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
      
      // Reset OG tags
      const resetOgTag = (property: string, content: string) => {
        const tag = document.querySelector(`meta[property="${property}"]`);
        if (tag) tag.setAttribute('content', content);
      };
      
      resetOgTag('og:title', 'גלעד קילון | ייעוץ ארגוני, פיתוח מנהלים וצוותי הנהלה');
      resetOgTag('og:description', originalDescription);
      resetOgTag('og:url', 'https://kilon-consulting.com/');
    };
  }, [article]);

  return (
    <div className="max-w-4xl mx-auto py-12 md:py-24 animate-fadeIn space-y-12 pb-48 text-right px-6" dir="rtl">
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleFacebookShare}
                className="flex items-center gap-2 px-3 py-2 bg-[#1877F2] text-white text-xs font-black uppercase tracking-widest hover:bg-[#0e5a9e] transition-all rounded-md"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="hidden sm:inline">Facebook</span>
              </button>
              <button
                onClick={handleLinkedInShare}
                className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2] text-white text-xs font-black uppercase tracking-widest hover:bg-[#004182] transition-all rounded-md"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="hidden sm:inline">LinkedIn</span>
              </button>
            </div>
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

        <div className="prose prose-xl max-w-none">
          <div className="text-xl md:text-2xl text-brand-dark leading-[1.8] font-medium whitespace-pre-wrap italic">
            {article.content || "התוכן בתהליך עדכון..."}
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;