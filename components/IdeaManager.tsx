
import React, { useState, useRef, useEffect } from 'react';
import { IdeaEntry, ProjectChange } from '../types';
import { processIdea } from '../geminiService';

const IdeaManager: React.FC<{ 
  ideas: IdeaEntry[], 
  projects: ProjectChange[], 
  onSave: (i: IdeaEntry) => void 
}> = ({ ideas, projects, onSave }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerInterval = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordDuration(0);
      timerInterval.current = window.setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert("יש לאשר גישה למיקרופון.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      if (timerInterval.current) clearInterval(timerInterval.current);
      setIsRecording(false);
    }
  };

  const handleProcess = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    const analysis = await processIdea(content, projects, isRecording);
    const newEntry: IdeaEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: Date.now(),
      rawContent: content,
      type: isRecording ? 'voice' : 'text',
      analysis
    };
    onSave(newEntry);
    setContent('');
    setIsAnalyzing(false);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProjectTitle = (id?: string) => {
    return projects.find(p => p.id === id)?.title || "פרויקט לא ידוע";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-20">
      <div className="text-center space-y-4">
        <span className="text-blue-400 font-black uppercase tracking-[0.5em] text-xs drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">Creative Contextual Mapping</span>
        <h2 className="text-7xl font-black text-white uppercase tracking-tighter">Idea Forge</h2>
        <p className="text-slate-400 text-xl font-medium">מעבדת הרעיונות של גלעד: הקלטה, עיבוד וחיבור חכם לפרויקטים.</p>
      </div>

      <div className="glass-card rounded-[4rem] p-10 md:p-16 space-y-12 border-blue-500/20 shadow-[0_0_100px_rgba(59,130,246,0.1)] relative">
        <div className="relative group">
          <textarea 
            className="w-full h-56 bg-transparent border-none focus:ring-0 text-3xl text-slate-200 placeholder-slate-800 resize-none leading-relaxed font-medium"
            placeholder="יש לך רעיון מבריק? הקלד אותו כאן..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <button 
            onMouseDown={startRecording} onMouseUp={stopRecording}
            className={`w-full md:w-auto px-12 py-8 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-blue-400 border border-blue-500/30 hover:bg-slate-800'}`}
          >
            {isRecording ? `🔴 ${formatTime(recordDuration)} מקליט...` : "🎙️ הקלט רעיון"}
          </button>

          <button 
            disabled={!content.trim() || isAnalyzing} onClick={handleProcess}
            className="flex-1 w-full bg-white text-slate-950 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-blue-500 hover:text-white transition-all shadow-2xl disabled:opacity-10"
          >
            {isAnalyzing ? "מנתח ומחבר להקשר..." : "עבד ושייך לפרויקט רלוונטי ←"}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ideas.map(idea => (
          <div key={idea.id} className="glass-card rounded-[3rem] p-10 border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col h-full">
            {idea.analysis?.matchedProjectId && (
              <div className="absolute top-0 left-0 right-0 bg-blue-500/10 border-b border-blue-500/20 px-10 py-3">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Matched: {getProjectTitle(idea.analysis.matchedProjectId)}</span>
              </div>
            )}
            <div className={`mt-6 ${idea.analysis?.matchedProjectId ? 'pt-4' : ''}`}>
               <h3 className="text-2xl font-black text-white mb-4 italic leading-tight">{idea.analysis?.title || 'רעיון חדש'}</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">"{idea.analysis?.summary || idea.rawContent}"</p>
               {idea.analysis?.matchingExplanation && (
                <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-[11px] text-slate-300 italic mb-4 leading-relaxed">
                  <span className="block font-black text-blue-400 uppercase mb-1">Context Link:</span>
                  {idea.analysis.matchingExplanation}
                </div>
               )}
            </div>
            <div className="mt-auto pt-6 border-t border-white/5">
              <div className="flex gap-2 flex-wrap">
                {idea.analysis?.nextSteps.map((s, i) => (
                  <span key={i} className="text-[10px] font-bold text-slate-500 bg-white/5 px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeaManager;
