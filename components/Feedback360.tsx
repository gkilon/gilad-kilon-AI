
import React, { useState, useEffect } from 'react';
import { getSystemConfig } from '../firebase';

const Feedback360: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackUrl, setFeedbackUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    getSystemConfig().then(config => {
      // Prioritize the URL from config, but ensure it's not empty
      if (config.feedback360Url) {
        setFeedbackUrl(config.feedback360Url);
      } else {
        // Fallback to the specific Netlify URL requested
        setFeedbackUrl("https://ubiquitous-nougat-41808d.netlify.app/");
      }
    }).catch(err => {
      console.error("Config load failed, using fallback URL");
      setFeedbackUrl("https://ubiquitous-nougat-41808d.netlify.app/");
    });
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-fadeIn">
      
      {/* סרגל ניווט עליון פנימי - מעוגן למערכת המקורית */}
      <div className="bg-white border-b-2 border-brand-dark px-6 py-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-dark text-white flex items-center justify-center rounded-none font-black text-lg">360</div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-brand-dark italic leading-none">שאלון 360 למנהלים</h2>
            <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mt-1">Strategic Feedback Integration</p>
          </div>
        </div>

        {onBack && (
          <button 
            onClick={onBack} 
            className="flex items-center gap-3 bg-brand-beige border-2 border-brand-dark px-6 py-2 text-brand-dark font-black text-xs uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all shadow-[4px_4px_0px_#1a1a1a] active:translate-x-0.5 active:translate-y-0.5"
          >
            <span>חזרה למעבדה</span>
            <span className="text-lg">←</span>
          </button>
        )}
      </div>

      {/* אזור השאלון המוטמע - המחיצה */}
      <div className="flex-1 relative bg-brand-beige overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-beige z-20">
            <div className="w-16 h-16 border-4 border-brand-dark border-t-brand-accent rounded-full animate-spin mb-6"></div>
            <div className="text-center space-y-2">
              <p className="text-xl font-black text-brand-dark italic">פותח מרחב משוב מאובטח...</p>
              <p className="text-xs font-bold text-brand-muted uppercase tracking-widest">Powered by Gilad Kilon Consulting</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-30 p-10 text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h3 className="text-3xl font-black text-brand-dark mb-4">{error}</h3>
            <p className="text-brand-muted max-w-md font-bold italic">נא לוודא שהכתובת הוגדרה כראוי בלוח הבקרה של המנהל.</p>
            {onBack && <button onClick={onBack} className="mt-8 px-10 py-4 bg-brand-dark text-white font-black">חזרה</button>}
          </div>
        )}
        
        {feedbackUrl && !error && (
          <iframe 
            src={feedbackUrl}
            className="w-full h-full border-none"
            title="Gilad Kilon 360 Questionnaire"
            onLoad={() => setIsLoading(false)}
            allow="camera;microphone;geolocation"
          />
        )}
      </div>

      {/* פוטר קטן לשמירה על הקשר המותג */}
      <div className="bg-brand-dark text-white/40 py-2 px-6 text-[9px] font-black uppercase tracking-[0.4em] text-center no-print">
        The Laboratory • Strategic Diagnostic Module • Gilad Kilon © 2025
      </div>
    </div>
  );
};

export default Feedback360;
