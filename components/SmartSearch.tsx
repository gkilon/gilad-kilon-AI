import React, { useState } from 'react';
import { searchSolutions } from '../geminiService';

const renderStructure = (structure: any): string => {
  if (typeof structure === 'string') return structure;
  if (Array.isArray(structure)) return structure.join('\n');
  if (typeof structure === 'object') return Object.entries(structure).map(([k, v]) => `${k}: ${v}`).join('\n');
  return String(structure);
};

export const SmartSearch: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ recommendedTool: string, reasoning: string, structure: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const presets = ["סנכרון הנהלה חדשה", "שיפור עבודת ממשקים", "פיתוח צוות טכנאים וחוקרים"];

  const handleSearch = async (text?: string) => {
    const val = text || input;
    if (!val.trim()) return;
    setLoading(true);
    setResult(null);
    setError(false);
    try {
      const res = await searchSolutions(val);
      if (res && res.recommendedTool) setResult(res);
      else throw new Error("Invalid response");
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-32 px-6 animate-slideUp">
      <div className="bg-white border border-brand-dark/10 shadow-2xl p-12 md:p-16 space-y-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] pointer-events-none"></div>
        <div className="relative z-10 text-right space-y-2">
          <span className="text-[10px] font-bold text-brand-touch uppercase tracking-[0.3em] block mb-2">Solution Architect</span>
          <h3 className="text-3xl md:text-4xl font-light text-brand-dark tracking-tight">מה אתה מחפש?</h3>
          <p className="text-brand-muted font-light text-sm mt-2">תאר במילים שלך את האתגר, ואתאים לך את התהליך המדויק.</p>
        </div>
        <div className="relative z-10">
          <div className="flex bg-brand-beige/50 border border-brand-dark/10 p-2 items-center transition-colors focus-within:border-brand-dark/30 focus-within:bg-white">
            <button onClick={() => handleSearch()} disabled={loading || !input.trim()} className="px-6 py-3 bg-brand-touch text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'מנתח...' : 'חפש פתרון'}
            </button>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="לדוגמה: יש לי קונפליקטים בהנהלה..." className="flex-1 bg-transparent border-none outline-none px-4 text-right text-brand-dark font-medium placeholder:text-brand-muted/40" onKeyPress={e => e.key === 'Enter' && handleSearch()} />
          </div>
          <div className="flex flex-wrap justify-end gap-2 mt-4">
            {presets.map((p, i) => (<button key={i} onClick={() => { setInput(p); handleSearch(p); }} className="text-[10px] text-brand-muted hover:text-brand-dark border border-transparent hover:border-brand-dark/10 px-3 py-1 transition-all rounded-full bg-brand-beige/30">{p}</button>))}
          </div>
        </div>
        {error && <div className="relative z-10 p-4 border border-red-500/20 bg-red-50 text-red-700 text-right text-sm">אירעה שגיאה. ייתכן שיש עומס על השרת, אנא נסה שוב.</div>}
        {result && (
          <div className="relative z-10 pt-8 border-t border-brand-dark/5 animate-fadeIn space-y-8 text-right">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold block mb-1">הפתרון המומלץ עבורך:</span>
              <h4 className="text-2xl font-bold text-brand-dark">{result.recommendedTool}</h4>
            </div>
            <div className="bg-brand-beige/30 p-6 border-r-4 border-brand-accent">
              <span className="text-[10px] uppercase tracking-widest text-brand-touch font-bold block mb-2">למה זה מתאים לך?</span>
              <p className="text-brand-dark/80 font-light leading-relaxed">{result.reasoning}</p>
            </div>
            <div className="bg-white border border-brand-dark/10 p-6 shadow-sm">
              <span className="text-[10px] uppercase tracking-widest text-brand-touch font-bold block mb-2">מבנה הפתרון והשלבים:</span>
              <p className="text-brand-dark/80 font-light leading-relaxed whitespace-pre-line">{renderStructure(result.structure)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** Dark-themed variant — used in the prominent section on the Landing page */
export const SmartSearchDark: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ recommendedTool: string, reasoning: string, structure: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const presets = ["סנכרון הנהלה חדשה", "שיפור עבודת ממשקים", "קונפליקטים בצוות הנהלה"];

  const handleSearch = async (text?: string) => {
    const val = text || input;
    if (!val.trim()) return;
    setLoading(true);
    setResult(null);
    setError(false);
    try {
      const res = await searchSolutions(val);
      if (res && res.recommendedTool) setResult(res);
      else throw new Error("Invalid response");
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-slideUp text-right" dir="rtl">
      {/* Search bar */}
      <div className="flex border border-white/10 bg-white/5 backdrop-blur-sm p-2 items-center focus-within:border-brand-touch/50 transition-colors">
        <button
          onClick={() => handleSearch()}
          disabled={loading || !input.trim()}
          className="px-6 py-4 bg-brand-touch text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? '⟳ מנתח...' : 'גזור לי פתרון ←'}
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="מה האתגר שלך? כתוב בחופשיות..."
          className="flex-1 bg-transparent border-none outline-none px-5 text-right text-white font-medium text-lg placeholder:text-white/20"
          onKeyPress={e => e.key === 'Enter' && handleSearch()}
          dir="rtl"
        />
      </div>

      {/* Preset chips */}
      <div className="flex flex-wrap justify-end gap-2 mt-4">
        {presets.map((p, i) => (
          <button key={i} onClick={() => { setInput(p); handleSearch(p); }}
            className="text-[10px] text-white/40 hover:text-brand-touch border border-white/10 hover:border-brand-touch/30 px-4 py-1.5 transition-all">
            {p}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 text-white/50 text-sm">
            <span className="animate-spin text-brand-touch text-xl">⟳</span>
            <span>מנתח את האתגר שלך...</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 border border-red-500/20 bg-red-500/5 text-red-400 text-right text-sm">
          אירעה שגיאה. אנא נסה שוב.
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8 animate-fadeIn space-y-4 text-right">
          {/* Recommended tool */}
          <div className="border border-white/10 bg-white/5 p-6">
            <span className="text-[9px] uppercase tracking-widest text-brand-touch font-bold block mb-2">הפתרון המומלץ עבורך</span>
            <h4 className="text-2xl font-black text-white">{result.recommendedTool}</h4>
          </div>
          {/* Reasoning */}
          <div className="border-r-2 border-brand-touch pr-5 py-2">
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold block mb-1">למה זה מתאים?</span>
            <p className="text-white/70 font-light leading-relaxed text-sm">{result.reasoning}</p>
          </div>
          {/* Structure */}
          <div className="border border-white/10 bg-brand-dark/60 p-5">
            <span className="text-[9px] uppercase tracking-widest text-brand-touch font-bold block mb-2">מבנה הפתרון</span>
            <p className="text-white/60 font-light leading-relaxed text-sm whitespace-pre-line">{renderStructure(result.structure)}</p>
          </div>
        </div>
      )}
    </div>
  );
};
