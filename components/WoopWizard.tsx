
import React, { useState, useEffect, useCallback } from 'react';
import { WoopStep, WoopData, AiFeedback } from '../types';
import { getWoopFeedback, generateTasksFromWoop } from '../geminiService';

interface WoopWizardProps {
  onSave: (data: WoopData, tasks: string[], score: number) => void;
  onCancel: () => void;
}

const steps = [
  { id: WoopStep.WISH, label: 'משאלה (Wish)', desc: 'מהו היעד הניהולי או האישי שאתה רוצה להשיג?' },
  { id: WoopStep.OUTCOME, label: 'תוצאה (Outcome)', desc: 'איך תיראה ההצלחה? מה התועלת המרכזית עבורך?' },
  { id: WoopStep.OBSTACLE, label: 'מכשול (Obstacle)', desc: 'מהו הדבר הפנימי (מחשבה, רגש, הרגל) שעוצר אותך?' },
  { id: WoopStep.PLAN, label: 'תוכנית (Plan)', desc: 'אם המכשול יופיע, אז אני אפעל בדרך של...' }
];

const WoopWizard: React.FC<WoopWizardProps> = ({ onSave, onCancel }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [data, setData] = useState<WoopData>({ wish: '', outcome: '', obstacle: '', plan: '' });
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const currentStep = steps[currentStepIdx];
  const currentVal = data[currentStep.id.toLowerCase() as keyof WoopData];

  const fetchFeedback = useCallback(async () => {
    if (currentVal.length < 5) return;
    setLoading(true);
    try {
      const res = await getWoopFeedback(currentStep.id, data);
      setFeedback(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentStep.id, currentVal, data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentVal) fetchFeedback();
    }, 1500);
    return () => clearTimeout(timer);
  }, [currentVal, fetchFeedback]);

  const handleNext = async () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setFeedback(null);
    } else {
      setIsFinalizing(true);
      try {
        const tasks = await generateTasksFromWoop(data);
        onSave(data, tasks, feedback?.score || 85);
      } catch (e) {
        onSave(data, ["להתחיל ביישום התוכנית"], 85);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-12">
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 flex items-center justify-center border-2 font-black transition-all ${
              i === currentStepIdx ? 'bg-brand-dark text-white border-brand-dark scale-110' :
              i < currentStepIdx ? 'bg-brand-accent border-brand-accent text-white' : 'border-brand-dark/10 opacity-30'
            }`}>
              {i + 1}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{s.id}</span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-7 space-y-8">
          <div className="bg-white border-2 border-brand-dark p-8 shadow-[10px_10px_0px_#1a1a1a]">
            <h3 className="text-3xl font-black italic mb-2">{currentStep.label}</h3>
            <p className="text-brand-muted font-bold mb-6 italic">{currentStep.desc}</p>
            <textarea 
              autoFocus
              className="w-full h-48 bg-brand-beige/20 border-2 border-brand-dark p-6 text-xl font-bold outline-none focus:border-brand-accent transition-all resize-none"
              value={currentVal}
              onChange={(e) => setData({...data, [currentStep.id.toLowerCase()]: e.target.value})}
              placeholder="כתוב כאן..."
            />
            <div className="flex justify-between mt-8">
              <button onClick={onCancel} className="text-brand-muted font-black text-xs uppercase tracking-widest hover:text-red-500">ביטול</button>
              <button 
                onClick={handleNext}
                disabled={!currentVal.trim() || isFinalizing}
                className="bg-brand-dark text-white px-10 py-4 font-black text-lg hover:bg-brand-accent transition-all shadow-xl disabled:opacity-20"
              >
                {isFinalizing ? "מעבד נתונים..." : currentStepIdx === steps.length - 1 ? "סיום וגזירת משימות ←" : "המשך ←"}
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="bg-brand-navy text-white p-8 border-2 border-brand-dark shadow-[8px_8px_0px_#b8926a] min-h-[400px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-brand-accent rounded-full animate-pulse"></div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">AI Strategy Agent</h4>
            </div>

            <div className="flex-1 space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full opacity-40">
                  <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Analyzing Thought Depth...</p>
                </div>
              ) : feedback ? (
                <div className="animate-fadeIn space-y-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-[10px] font-black opacity-50">READY SCORE:</span>
                    <span className="text-2xl font-black text-brand-gold">{feedback.score}%</span>
                  </div>
                  <p className="italic font-medium leading-relaxed">"{feedback.analysis}"</p>
                  
                  <div className="bg-white/5 p-4 border-r-4 border-brand-gold">
                    <p className="text-[10px] font-black text-brand-gold uppercase mb-2">Refined Version:</p>
                    <p className="text-sm font-bold opacity-80">{feedback.refinedText}</p>
                  </div>

                  <div className="pt-4">
                    <p className="text-[10px] font-black opacity-50 uppercase mb-1">שאלה למחשבה:</p>
                    <p className="text-xs font-bold italic">{feedback.clarifyingQuestion}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
                  <span className="text-6xl mb-4">🪄</span>
                  <p className="font-bold italic">התחל לכתוב כדי לקבל ניתוח אסטרטגי מהסוכן.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WoopWizard;
