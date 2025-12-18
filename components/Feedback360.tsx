
import React, { useState } from 'react';
import { analyze360Feedback } from '../geminiService';

const Feedback360: React.FC = () => {
  const [self, setSelf] = useState('');
  const [peers, setPeers] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAddPeer = () => setPeers([...peers, '']);
  
  const handleRun = async () => {
    setLoading(true);
    const res = await analyze360Feedback(self, peers.filter(p => p.trim()));
    setAnalysis(res);
    setLoading(false);
  };

  if (analysis) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn">
        <div className="text-center relative py-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-rose-500/5 blur-[100px] -z-10"></div>
          <span className="text-rose-400 font-black uppercase tracking-[0.5em] text-[10px] drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">Synthesis Report Complete</span>
          <h2 className="text-7xl font-black text-white mt-4 tracking-tighter italic">THE 360 <span className="text-rose-500">TRUTH</span></h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[3rem] border-rose-500/20 bg-rose-500/5 space-y-8 relative overflow-hidden group">
            <h4 className="text-sm font-black text-rose-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              Blind Spots
            </h4>
            <div className="space-y-6">
              {analysis.blindSpots.map((b: string, i: number) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-rose-500 font-black text-xl">/</span>
                  <p className="text-slate-200 font-medium text-lg leading-snug">{b}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border-cyan-brand/20 bg-cyan-brand/5 space-y-8 relative overflow-hidden group">
            <h4 className="text-sm font-black text-cyan-brand uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-cyan-brand rounded-full"></span>
              Superpowers
            </h4>
            <div className="space-y-6">
              {analysis.superpowers.map((s: string, i: number) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-cyan-brand font-black text-xl">★</span>
                  <p className="text-slate-200 font-medium text-lg leading-snug">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-12 rounded-[4rem] border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-inner">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Integrated Action Plan</h4>
              <p className="text-3xl md:text-4xl font-black text-white leading-tight italic">
                "{analysis.actionPlan}"
              </p>
            </div>
          </div>
        </div>

        <button onClick={() => setAnalysis(null)} className="w-full py-10 text-slate-600 font-black uppercase tracking-[0.5em] hover:text-white transition-all">
          Start New Synthesis Session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-rose-400 font-black uppercase tracking-[0.4em] text-xs drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">Objective Perception Engine</span>
        <h2 className="text-6xl font-black text-white tracking-tighter uppercase">Feedback 360 AI</h2>
        <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">מעבדת סינתזה למשוב ניהולי: הפיכת קולות מגוונים לתמונת מצב מדויקת.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest italic pr-4">Internal Voice / משוב עצמי</h3>
          <div className="glass-card p-8 rounded-[3rem] border-rose-500/10 focus-within:border-rose-500/40 transition-all relative overflow-hidden shadow-2xl">
            <textarea 
              className="w-full bg-transparent border-none text-xl text-slate-200 min-h-[300px] focus:ring-0 outline-none resize-none leading-relaxed placeholder-slate-700"
              placeholder="איך אתה תופס את הביצועים שלך?"
              value={self}
              onChange={e => setSelf(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-cyan-brand uppercase tracking-widest italic pr-4">Environmental Echo / משוב סביבה</h3>
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {peers.map((peer, i) => (
              <div key={i} className="glass-card p-6 rounded-[2rem] border-white/5 focus-within:border-cyan-brand/30 transition-all group shadow-xl">
                <textarea 
                  className="w-full bg-transparent border-none text-base text-slate-300 min-h-[100px] focus:ring-0 outline-none resize-none placeholder-slate-800"
                  placeholder={`משוב ממקור ${i+1}...`}
                  value={peer}
                  onChange={e => {
                    const newPeers = [...peers];
                    newPeers[i] = e.target.value;
                    setPeers(newPeers);
                  }}
                />
              </div>
            ))}
            <button 
              onClick={handleAddPeer} 
              className="w-full py-6 border-2 border-dashed border-white/5 rounded-[2rem] text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-cyan-brand/30 hover:text-cyan-brand transition-all"
            >
              + Add Feedback Source
            </button>
          </div>
        </div>
      </div>

      <div className="pt-10 flex flex-col items-center">
        <button 
          disabled={!self || peers.filter(p => p.trim()).length < 1 || loading}
          onClick={handleRun}
          className="w-full max-w-3xl bg-white text-slate-950 py-10 rounded-[3rem] font-black text-4xl hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_50px_rgba(0,0,0,0.5)] disabled:opacity-20 flex flex-col items-center gap-2 group relative overflow-hidden"
        >
          {loading && <div className="scan-line"></div>}
          <span className="relative z-10">{loading ? "Processing..." : "סנתז דוח 360"}</span>
        </button>
      </div>
    </div>
  );
};

export default Feedback360;
