import React, { useEffect } from 'react';
import { Article } from '../types';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

  const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.subtitle || article.content?.substring(0, 100) || 'מאמר מקצועי מאת גלעד קילון',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('הקישור הועתק ללוח!');
    }
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
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white text-xs font-black uppercase tracking-widest hover:bg-brand-touch transition-all rounded-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>שתף מאמר</span>
            </button>
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