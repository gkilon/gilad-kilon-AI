
import React from 'react';

const CommunicationDNA: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-32 animate-fadeIn text-center space-y-12 px-6">
      <div className="space-y-6">
        <div className="inline-block border-2 border-brand-dark px-6 py-2 mb-4">
           <span className="text-[12px] font-black uppercase tracking-[0.4em]">Diagnostic Tool</span>
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-brand-dark tracking-tighter uppercase italic">Communication DNA</h2>
        <p className="text-brand-muted text-xl md:text-2xl font-medium max-w-2xl mx-auto">
          אבחון סגנונות התקשורת מופעל בסביבת העבודה החיצונית של גלעד קילון.
        </p>
      </div>

      <div className="studio-card p-12 md:p-20 border-brand-dark bg-white shadow-[12px_12px_0px_#1a1a1a] space-y-10">
        <div className="text-8xl">🧬</div>
        <div className="space-y-4">
           <p className="text-2xl text-brand-dark font-bold leading-relaxed">אבחון סגנונות תקשורת</p>
           <p className="text-brand-muted font-medium italic">הקש על הכפתור למטה כדי להתחיל את האבחון באתר הייעודי.</p>
        </div>
        <div className="pt-6">
          <a 
            href="https://hilarious-kashata-9aafa2.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-brand-dark text-white px-16 py-7 font-black text-2xl hover:bg-brand-accent transition-all shadow-xl active:scale-95"
          >
            פתח אבחון DNA ←
          </a>
        </div>
      </div>

      <p className="text-brand-muted text-[11px] font-black uppercase tracking-[0.4em] italic">Developed by Gilad Kilon</p>
    </div>
  );
};

export default CommunicationDNA;
