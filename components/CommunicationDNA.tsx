
import React from 'react';

const CommunicationDNA: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-32 animate-fadeIn text-center space-y-12 px-6">
      
      {onBack && (
        <div className="text-right mb-8">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-brand-accent font-black text-sm uppercase tracking-widest hover:text-brand-dark transition-all group"
          >
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            <span>חזרה לתפריט המעבדה</span>
          </button>
        </div>
      )}

      <div className="space-y-6">
        <div className="inline-block border-2 border-brand-dark px-6 py-2 mb-4">
           <span className="text-[12px] font-black uppercase tracking-[0.4em]">Diagnostic Experience</span>
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-brand-dark tracking-tighter uppercase italic">Communication DNA</h2>
        <p className="text-brand-muted text-xl md:text-2xl font-medium max-w-2xl mx-auto italic">
          "להבין את השפה הפנימית שלנו כדי לתקשר טוב יותר עם העולם."
        </p>
      </div>

      <div className="studio-card p-12 md:p-20 border-brand-dark bg-white shadow-[12px_12px_0px_#1a1a1a] space-y-10">
        <div className="text-8xl">🧬</div>
        <div className="space-y-4">
           <p className="text-2xl text-brand-dark font-bold leading-relaxed">אבחון סגנונות תקשורת והנעה</p>
           <p className="text-brand-muted font-medium italic">האבחון המקצועי מופעל באתר הייעודי של גלעד קילון.</p>
        </div>
        <div className="pt-6">
          <a 
            href="https://hilarious-kashata-9aafa2.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-brand-dark text-white px-16 py-7 font-black text-2xl hover:bg-brand-accent transition-all shadow-xl active:scale-95"
          >
            פתח אבחון DNA חיצוני ←
          </a>
        </div>
      </div>

      <div className="pt-10 border-t border-brand-dark/10">
        <p className="text-brand-muted text-[11px] font-black uppercase tracking-[0.4em] italic">Strategic Diagnostic Suite • Gilad Kilon</p>
      </div>
    </div>
  );
};

export default CommunicationDNA;
