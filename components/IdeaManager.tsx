
import React, { useState, useRef, useEffect } from 'react';
import { IdeaEntry, ProjectChange } from '../types';
import { processIdea } from '../geminiService';

const IdeaManager: React.FC<{ 
  ideas: IdeaEntry[], 
  projects: ProjectChange[], 
  onSave: (i: IdeaEntry) => void,
  onBack?: () => void
}> = ({ ideas, projects, onSave, onBack }) => {
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
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pt-28 pb-20 px-6">
      
      {onBack && (
        <div className="mb-8">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-brand-accent font-black text-sm uppercase tracking-widest hover:text-brand-dark transition-all group"
          >
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            <span>חזרה לתפריט המעבדה</span>
          </button>
        </div>
      )}

      <div className="text-center space-y-4">
        <span className="text-brand-accent font-black uppercase tracking-[0.5em] text-xs drop-shadow-[0_0_12px_rgba(37,99,235,0.2)]">Creative Contextual Mapping</span>
        <h2 className="text-7xl font-black text-brand-dark uppercase tracking-tighter italic">Idea Forge</h2>
        <p className="text-brand-muted text-xl font-medium">מעבדת הרעיונות של גלעד: הקלטה, עיבוד וחיבור חכם לפרויקטים.</p>
      </div>

      <div className="studio-card rounded-none p-10 md:p-16 space-y-12 border-brand-dark bg-white shadow-[16px_16px_0px_rgba(26,26,26,0.05)] relative">
        <div className="relative group">
          <textarea 
            className="w-full h-56 bg-transparent border-none focus:ring-0 text-3xl text-brand-dark placeholder-brand-dark/10 resize-none leading-relaxed font-medium text-right outline-none"
            placeholder="יש לך רעיון מבריק? הקלד אותו כאן..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <button 
            onMouseDown={startRecording} onMouseUp={stopRecording}
            className={`w-full md:w-auto px-12 py-8 rounded-none font-black text-xl flex items-center justify-center gap-4 transition-all border-4 ${isRecording ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-white text-brand-dark border-brand-dark hover:bg-brand-dark hover:text-white'}`}
          >
            {isRecording ? `🔴 ${formatTime(recordDuration)} מקליט...` : "🎙️ הקלט רעיון"}
          </button>

          <button 
            disabled={!content.trim() || isAnalyzing} onClick={handleProcess}
            className="flex-1 w-full bg-brand-dark text-white py-8 rounded-none font-black text-2xl hover:bg-brand-accent transition-all shadow-2xl disabled:opacity-10"
          >
            {isAnalyzing ? "מנתח ומחבר להקשר..." : "עבד ושייך לפרויקט רלוונטי ←"}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ideas.map(idea => (
          <div key={idea.id} className="studio-card p-10 border-brand-dark bg-white hover:border-brand-accent transition-all group relative overflow-hidden flex flex-col h-full shadow-[8px_8px_0px_rgba(26,26,26,0.05)]">
            {idea.analysis?.matchedProjectId && (
              <div className="absolute top-0 left-0 right-0 bg-brand-accent/10 border-b border-brand-accent/20 px-10 py-3 text-right">
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest italic">Matched: {getProjectTitle(idea.analysis.matchedProjectId)}</span>
              </div>
            )}
            <div className={`mt-6 text-right ${idea.analysis?.matchedProjectId ? 'pt-4' : ''}`}>
               <h3 className="text-2xl font-black text-brand-dark mb-4 italic leading-tight">{idea.analysis?.title || 'רעיון חדש'}</h3>
               <p className="text-brand-muted text-sm leading-relaxed mb-6 italic">"{idea.analysis?.summary || idea.rawContent}"</p>
               {idea.analysis?.matchingExplanation && (
                <div className="p-5 bg-brand-beige/50 border-r-4 border-brand-accent text-[11px] text-brand-dark italic mb-4 leading-relaxed">
                  <span className="block font-black text-brand-accent uppercase mb-1">Context Link:</span>
                  {idea.analysis.matchingExplanation}
                </div>
               )}
            </div>
            <div className="mt-auto pt-6 border-t border-brand-dark/5 flex gap-2 flex-wrap justify-end">
                {idea.analysis?.nextSteps.map((s, i) => (
                  <span key={i} className="text-[10px] font-bold text-brand-muted bg-brand-beige px-3 py-1 rounded-none border border-brand-dark/10">{s}</span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeaManager;
