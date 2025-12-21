
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WoopData, WoopStep, AiFeedback } from '../types';
import { getCollaborativeFeedback, suggestTasksForWoop } from '../geminiService';
import { Icons } from './Landing';

interface WoopWizardProps {
  onCancel: () => void;
  onSave: (data: WoopData, tasks: string[]) => void;
  initialData?: WoopData;
}

const steps = [
  { id: WoopStep.CONTEXT, title: 'Context', label: 'הקשר ואסטרטגיה', desc: 'מהי התמונה הגדולה ולמה השינוי הזה חשוב עכשיו?', icon: '🏠' },
  { id: WoopStep.WISH, title: 'Wish', label: 'המשאלה הניהולית', desc: 'מהו היעד הספציפי והמרגש שאתה שואף אליו?', icon: '❤️' },
  { id: WoopStep.OUTCOME, title: 'Outcome', label: 'התוצאה הרצויה', desc: 'איך תיראה ההצלחה? מה התועלת המרכזית?', icon: '✨' },
  { id: WoopStep.OBSTACLE, title: 'Obstacle', label: 'זיהוי החסם', desc: 'מהו הדבר הפנימי (מחשבה/רגש) שעוצר אותך?', icon: '🧱' },
  { id: WoopStep.PLAN, title: 'Plan', label: 'תוכנית תגובה', desc: 'אם החסם יופיע, אז אני אפעל בדרך של...', icon: '🚀' }
];

const WoopWizard: React.FC<WoopWizardProps> = ({ onCancel, onSave, initialData }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [data, setData] = useState<WoopData>(initialData || { context: '', wish: '', outcome: '', obstacle: '', plan: '' });
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const feedbackRequested = useRef<string>("");

  const currentStep = steps[currentStepIdx];
  const currentVal = data[currentStep.id.toLowerCase() as keyof WoopData];

  const fetchAiSupport = useCallback(async () => {
    if (!currentVal || currentVal.length < 10 || feedbackRequested.current === currentVal) return;
    
    feedbackRequested.current = currentVal;
    setIsAiLoading(true);
    try {
      const result = await getCollaborativeFeedback(currentStep.id, data);
      setFeedback(result);
    } catch (e) {
      console.error("AI Feedback Error:", e);
    } finally {
      setIsAiLoading(false);
    }
  }, [currentStep.id, data, currentVal]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAiSupport();
    }, 1500);
    return () => clearTimeout(timer);
  }, [currentVal, fetchAiSupport]);

  const handleInputChange = (val: string) => {
    const key = currentStep.id.toLowerCase() as keyof WoopData;
    setData(prev => ({ ...prev, [key]: val }));
  };

  const handleAdoptRefined = () => {
    if (feedback?.refinedText) {
      handleInputChange(feedback.refinedText);
      setFeedback(null);
    }
  };

  const handleNext = async () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setFeedback(null);
      feedbackRequested.current = "";
    } else {
      setIsFinalizing(true);
      try {
        const suggestedTasks = await suggestTasksForWoop(data);
        onSave(data, suggestedTasks);
      } catch (e) {
        onSave(data, ["להתחיל ביישום התוכנית", "שיחת עדכון עם הצוות"]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-fadeIn text-right pt-32">
      
      {/* Progress Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div className="flex items-center gap-3">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-12 h-12 flex items-center justify-center border-2 transition-all duration-500 ${
                i === currentStepIdx ? 'bg-brand-dark text-white border-brand-dark scale-110 shadow-lg' : 
                i < currentStepIdx ? 'bg-brand-accent border-brand-accent text-white' : 
                'bg-white border-brand-dark/10 text-brand-muted opacity-30'
              }`}>
                <span className="text-xl">{s.icon}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-1 ${i < currentStepIdx ? 'bg-brand-accent' : 'bg-brand-dark/10'}`} />}
            </div>
          ))}
        </div>
        <div className="text-right">
          <span className="text-[11px] font-black text-brand-accent uppercase tracking-[0.3em]">Phase {currentStepIdx + 1} of 5</span>
          <h2 className="text-4xl font-black text-brand-dark italic tracking-tighter">{currentStep.label}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Main Editor */}
        <div className="lg:col-span-7 space-y-8">
          <div className="studio-card p-10 border-brand-dark bg-white shadow-[12px_12px_0px_#1a1a1a]">
            <p className="text-brand-muted text-xl font-medium italic mb-6">{currentStep.desc}</p>
            <textarea
              autoFocus
              className="w-full h-[300px] bg-brand-beige/20 p-8 text-2xl font-bold text-brand-dark outline-none focus:border-brand-accent border-2 border-transparent transition-all resize-none text-right leading-relaxed"
              placeholder="כתוב כאן..."
              value={currentVal}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <div className="mt-8 flex justify-between items-center">
              <button onClick={onCancel} className="text-brand-muted font-black uppercase text-xs tracking-widest hover:text-brand-dark">ביטול</button>
              <button 
                onClick={handleNext}
                disabled={!currentVal.trim() || isFinalizing}
                className="bg-brand-dark text-white px-12 py-5 font-black text-xl hover:bg-brand-accent transition-all shadow-xl disabled:opacity-20 active:scale-95"
              >
                {isFinalizing ? "מעבד נתונים..." : currentStepIdx === steps.length - 1 ? "סיים וגזור משימות ←" : "המשך לשלב הבא ←"}
              </button>
            </div>
          </div>
        </div>

        {/* AI Sidekick */}
        <div className="lg:col-span-5">
          <div className="studio-card p-10 border-brand-dark bg-brand-beige shadow-[10px_10px_0px_rgba(90,125,154,0.2)] min-h-[500px] flex flex-col relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8 justify-end">
              <div className="text-right">
                <h4 className="font-black text-xl text-brand-dark italic">AI Strategic Co-Pilot</h4>
                <div className="flex items-center gap-2 justify-end">
                   <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Active Analysis</span>
                   <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-white border-2 border-brand-dark flex items-center justify-center text-2xl">🪄</div>
            </div>

            <div className="flex-1 space-y-8">
              {isAiLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 opacity-40">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-brand-dark rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-2.5 h-2.5 bg-brand-dark rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2.5 h-2.5 bg-brand-dark rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Deep Processing...</p>
                </div>
              ) : feedback ? (
                <div className="space-y-8 animate-fadeIn">
                  <div className="p-6 bg-white border-r-8 border-brand-accent shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black text-brand-muted uppercase">Ready Score: {feedback.score}%</span>
                       <div className="w-24 h-1.5 bg-brand-dark/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-accent transition-all duration-1000" style={{width: `${feedback.score}%`}}></div>
                       </div>
                    </div>
                    <p className="text-lg font-bold text-brand-dark leading-relaxed italic">"{feedback.analysis}"</p>
                  </div>

                  {feedback.refinedText && (
                    <div className="space-y-4">
                       <h5 className="text-[10px] font-black text-brand-accent uppercase tracking-widest">הצעה לניסוח אסטרטגי:</h5>
                       <div className="p-6 bg-brand-dark text-white italic text-lg leading-relaxed shadow-lg">
                         {feedback.refinedText}
                       </div>
                       <button 
                         onClick={handleAdoptRefined}
                         className="w-full py-3 bg-white border-2 border-brand-dark text-brand-dark font-black text-xs uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all"
                       >
                         אמץ ניסוח AI
                       </button>
                    </div>
                  )}

                  {feedback.clarifyingQuestion && (
                    <div className="p-4 border-2 border-dashed border-brand-dark/20 text-brand-muted italic text-sm">
                      <span className="block font-black text-[10px] uppercase mb-1">שאלה למחשבה:</span>
                      {feedback.clarifyingQuestion}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-20">
                  <div className="text-6xl mb-6">✍️</div>
                  <p className="text-xl font-bold">התחל לכתוב...</p>
                  <p className="text-sm">אני אנתח את המילים שלך ואעזור לך לדייק את המהלך האסטרטגי.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t border-brand-dark/5 text-[9px] font-black text-brand-muted uppercase tracking-widest flex justify-between">
              <span>GK Strategy Lab</span>
              <span>v3.0.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WoopWizard;
