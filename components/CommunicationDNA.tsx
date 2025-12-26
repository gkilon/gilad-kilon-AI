
import React, { useState, useEffect } from 'react';
import { getSystemConfig } from '../firebase';

const CommunicationDNA: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dnaUrl, setDnaUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    getSystemConfig().then(config => {
      if (config.communicationDnaUrl) {
        setDnaUrl(config.communicationDnaUrl);
      } else {
        // Fallback to the specific URL provided
        setDnaUrl("https://hilarious-kashata-9aafa2.netlify.app/");
      }
    }).catch(err => {
      console.error("Config load failed, using fallback URL");
      setDnaUrl("https://hilarious-kashata-9aafa2.netlify.app/");
    });
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-fadeIn">
      
      {/* סרגל ניווט עליון פנימי */}
      <div className="bg-white border-b-2 border-brand-dark px-6 py-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-accent text-white flex items-center justify-center rounded-none font-black text-lg">🧬</div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-brand-dark italic leading-none">DNA תקשורת</h2>
            <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mt-1">Strategic Communication Diagnostic</p>
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

      {/* אזור האבחון המוטמע - המחיצה */}
      <div className="flex-1 relative bg-brand-beige overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-beige z-20">
            {/* DNA-like animation */}
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-brand-accent rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-4 border-4 border-brand-dark rounded-full animate-spin border-t-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🧬</div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-black text-brand-dark italic">מפענח DNA תקשורתי...</p>
              <p className="text-xs font-bold text-brand-muted uppercase tracking-widest">Diagnostic Environment Ready</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-30 p-10 text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h3 className="text-3xl font-black text-brand-dark mb-4">{error}</h3>
            <p className="text-brand-muted max-w-md font-bold italic">נא לוודא שהכתובת הוגדרה כראוי בלוח הבקרה.</p>
            {onBack && <button onClick={onBack} className="mt-8 px-10 py-4 bg-brand-dark text-white font-black">חזרה</button>}
          </div>
        )}
        
        {dnaUrl && !error && (
          <iframe 
            src={dnaUrl}
            className="w-full h-full border-none shadow-inner"
            title="Communication DNA Diagnostic"
            onLoad={() => setIsLoading(false)}
            allow="camera;microphone;geolocation"
          />
        )}
      </div>

      {/* פוטר קטן */}
      <div className="bg-brand-dark text-white/40 py-2 px-6 text-[9px] font-black uppercase tracking-[0.4em] text-center no-print">
        Communication DNA Module • Clinical Diagnostic Interface • Gilad Kilon © 2025
      </div>
    </div>
  );
};

export default CommunicationDNA;
