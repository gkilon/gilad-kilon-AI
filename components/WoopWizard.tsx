
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WoopData, WoopStep, AiFeedback } from '../types';
import { getCollaborativeFeedback } from '../geminiService';

interface WoopWizardProps {
  onCancel: () => void;
  onSave: (data: WoopData) => void;
  initialData?: WoopData;
}

const steps = [
  { id: WoopStep.CONTEXT, title: 'Context', label: 'הקשר ואסטרטגיה', desc: 'מהי התמונה הגדולה ולמה זה חשוב עכשיו?', color: 'slate' },
  { id: WoopStep.WISH, title: 'Goal', label: 'המשאלה הניהולית', desc: 'מהו היעד הספציפי שאתה שואף אליו?', color: 'cyan' },
  { id: WoopStep.OUTCOME, title: 'Vision', label: 'התוצאה הרצויה', desc: 'איך נראית ההצלחה במציאות?', color: 'blue' },
  { id: WoopStep.OBSTACLE, title: 'Barrier', label: 'זיהוי החסם', desc: 'מהו הדבר האמיתי שעוצר אותך מלפעול?', color: 'amber' },
  { id: WoopStep.PLAN, title: 'Response', label: 'תוכנית תגובה', desc: 'איך תפעל ברגע האמת כשהחסם יופיע?', color: 'emerald' }
];

const WoopWizard: React.FC<WoopWizardProps> = ({ onCancel, onSave, initialData }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [data, setData] = useState<WoopData>(initialData || { context: '', wish: '', outcome: '', obstacle: '', plan: '' });
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const feedbackRequested = useRef<string>("");

  const currentStep = steps[currentStepIdx];
  const currentVal = data[currentStep.id.toLowerCase() as keyof WoopData];

  const fetchAiSupport = useCallback(async () => {
    if (currentVal.length < 15 || feedbackRequested.current === currentVal) return;
    
    feedbackRequested.current = currentVal;
    setIsAiLoading(true);
    try {
      const result = await getCollaborativeFeedback(currentStep.id, data);
      setFeedback(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  }, [currentStep.id, data, currentVal]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAiSupport();
    }, 2000);
    return () => clearTimeout(timer);
  }, [currentVal, fetchAiSupport]);

  const handleInputChange = (val: string) => {
    const key = currentStep.id.toLowerCase() as keyof WoopData;
    setData(prev => ({ ...prev, [key]: val }));
    setConfirmed(false);
  };

  const handleAdoptRefined = () => {
    if (feedback?.refinedText) {
      handleInputChange(feedback.refinedText);
      setConfirmed(true);
    }
  };

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setFeedback(null);
      setConfirmed(false);
      feedbackRequested.current = "";
    } else {
      onSave(data);
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
      setFeedback(null);
      setConfirmed(false);
      feedbackRequested.current = "";
    } else {
      onCancel();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-fadeIn">
      {/* Dynamic Breadcrumbs */}
      <div className="flex items-center justify-between mb-16 px-4">
        <div className="flex items-center gap-3">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-all duration-500 ${
                i === currentStepIdx ? 'bg-cyan-brand text-slate-950 scale-125 shadow-lg shadow-cyan-brand/20' : i < currentStepIdx ? 'bg-slate-800 text-cyan-brand border border-cyan-brand/30' : 'bg-slate-900 text-slate-600'
              }`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className="w-8 h-px bg-slate-800" />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-cyan-brand uppercase tracking-[0.2em]">Step Insight</span>
          <span className="text-white font-bold">{currentStep.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Editor Area */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-5xl font-black text-white leading-tight mb-3">{currentStep.label}</h2>
              <p className="text-slate-400 text-xl font-medium">{currentStep.desc}</p>
            </div>
            
            <div className="relative">
               <textarea
                autoFocus
                className="w-full h-[400px] p-10 rounded-[3rem] bg-slate-900/40 border border-white/5 focus:border-cyan-brand/50 focus:ring-4 focus:ring-cyan-brand/5 shadow-2xl transition-all text-2xl font-medium placeholder-slate-700 leading-relaxed resize-none text-slate-100"
                placeholder="שתף את המחשבות שלך כאן..."
                value={currentVal}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <div className="absolute bottom-10 left-10 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Editing Mode</span>
                <div className="w-1.5 h-1.5 bg-cyan-brand rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-4">
            <button onClick={handleBack} className="text-lg font-bold text-slate-500 hover:text-white transition-all py-2">
              {currentStepIdx === 0 ? 'ביטול וחזרה' : 'חזרה לשלב הקודם'}
            </button>
            <button 
              onClick={handleNext}
              disabled={!currentVal.trim()}
              className="bg-white hover:bg-cyan-brand text-slate-950 px-14 py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-10"
            >
              {currentStepIdx === steps.length - 1 ? 'סיים וייצא תוכנית' : 'המשך לשלב הבא'}
            </button>
          </div>
        </div>

        {/* AI Assistant Area */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="glass-card rounded-[3rem] p-12 flex flex-col min-h-[550px] relative overflow-hidden border-white/5 shadow-2xl">
            {/* Logo Watermark */}
            <div className="absolute top-10 right-10 flex gap-1 items-end h-8 opacity-20">
              <div className="w-2 h-4 bg-slate-700 rounded-full"></div>
              <div className="w-2 h-8 bg-cyan-brand rounded-full"></div>
            </div>

            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h4 className="font-black text-2xl text-white">העוזר האסטרטגי</h4>
                <p className="text-[10px] text-cyan-brand font-black uppercase tracking-widest mt-1">מבית גלעד קילון</p>
              </div>
            </div>

            <div className="flex-1 space-y-10 overflow-y-auto">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 opacity-40">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-cyan-brand rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-2.5 h-2.5 bg-cyan-brand rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2.5 h-2.5 bg-cyan-brand rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-brand">Deep Analysis...</p>
                </div>
              ) : feedback ? (
                <div className="space-y-10 animate-fadeIn">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">תובנה אישית:</h5>
                    <p className="text-xl text-slate-300 leading-relaxed font-medium italic border-r-4 border-cyan-brand/30 pr-6 py-2">
                      "{feedback.analysis}"
                    </p>
                  </div>

                  {!confirmed && (
                    <div className="space-y-8">
                      <div className="bg-white/[0.03] p-8 rounded-[2rem] border border-white/5 hover:border-cyan-brand/20 transition-all group">
                        <h5 className="text-[10px] font-black text-cyan-brand uppercase tracking-widest mb-4">הצעה לניסוח מורחב ודיוק המהלך:</h5>
                        <p className="text-lg font-medium text-slate-200 leading-relaxed mb-8">
                          {feedback.refinedText}
                        </p>
                        <button 
                          onClick={handleAdoptRefined}
                          className="w-full bg-cyan-brand hover:bg-cyan-400 text-slate-950 font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          אמץ את הניסוח האסטרטגי
                        </button>
                      </div>

                      <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10">
                        <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">לדיוק נוסף כדאי לחשוב:</h5>
                        <p className="text-lg font-bold text-amber-100/90 leading-tight">
                          {feedback.clarifyingQuestion}
                        </p>
                      </div>
                    </div>
                  )}

                  {confirmed && (
                    <div className="bg-cyan-brand/5 p-10 rounded-[2.5rem] border border-cyan-brand/20 flex flex-col items-center text-center gap-6 animate-fadeIn">
                      <div className="w-16 h-16 bg-cyan-brand rounded-full flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-brand/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h6 className="text-2xl font-black text-white mb-2">השלב דויק בהצלחה</h6>
                        <p className="text-slate-400">הניסוח המקצועי עודכן. אנחנו מוכנים להתקדם לשלב הבא.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-12 opacity-30">
                  <div className="w-24 h-24 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center mb-8">
                    <span className="text-4xl">✍️</span>
                  </div>
                  <h6 className="text-2xl font-bold text-white mb-4">אני מקשיב ומנתח...</h6>
                  <p className="text-lg leading-relaxed">תתחיל לכתוב את המחשבות שלך, ואני אעזור לך להפוך אותן לתוכנית עבודה מנצחת.</p>
                </div>
              )}
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-slate-700 tracking-[0.3em]">
              <span>FEEDBACK 360 CORE</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-brand rounded-full"></div>
                <span>ACTIVE SYNC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WoopWizard;
