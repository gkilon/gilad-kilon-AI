
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WoopData, WoopStep, AiFeedback } from '../types';
import { getCollaborativeFeedback } from '../geminiService';

interface WoopWizardProps {
  onCancel: () => void;
  onSave: (data: WoopData) => void;
  initialData?: WoopData;
}

const steps = [
  { id: WoopStep.CONTEXT, title: 'Context', label: 'הקשר ואסטרטגיה', desc: 'מהי התמונה הגדולה ולמה זה חשוב עכשיו?', color: 'brand-dark', icon: '🏠' },
  { id: WoopStep.WISH, title: 'Goal', label: 'המשאלה הניהולית', desc: 'מהו היעד הספציפי שאתה שואף אליו?', color: 'brand-accent', icon: '❤️' },
  { id: WoopStep.OUTCOME, title: 'Vision', label: 'התוצאה הרצויה', desc: 'איך נראית ההצלחה במציאות?', color: 'brand-accent', icon: '✨' },
  { id: WoopStep.OBSTACLE, title: 'Barrier', label: 'זיהוי החסם', desc: 'מהו הדבר האמיתי שעוצר אותך מלפעול?', color: 'brand-muted', icon: '🧱' },
  { id: WoopStep.PLAN, title: 'Response', label: 'תוכנית תגובה', desc: 'איך תפעל ברגע האמת כשהחסם יופיע?', color: 'brand-dark', icon: '🚀' }
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
    <div className="max-w-6xl mx-auto py-12 px-6 animate-fadeIn text-right">
      {/* Dynamic Breadcrumbs with Icons */}
      <div className="flex items-center justify-between mb-16 px-4">
        <div className="flex items-center gap-4">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center justify-center w-10 h-10 border-2 transition-all duration-500 ${
                i === currentStepIdx ? 'bg-brand-dark text-white border-brand-dark scale-125' : i < currentStepIdx ? 'bg-brand-beige border-brand-dark text-brand-dark' : 'bg-white border-brand-dark/10 text-brand-muted opacity-30'
              }`}>
                <span className="text-sm font-black">{s.icon}</span>
              </div>
              {i < steps.length - 1 && <div className="w-6 h-px bg-brand-dark/10" />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">WOOP PROCESS</span>
          <span className="text-brand-dark font-black text-2xl italic">{currentStep.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Editor Area */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4 justify-end">
              <div className="text-right">
                <h2 className="text-5xl font-black text-brand-dark leading-tight mb-2">{currentStep.label}</h2>
                <p className="text-brand-muted text-xl font-medium italic">{currentStep.desc}</p>
              </div>
              <div className="text-6xl">{currentStep.icon}</div>
            </div>
            
            <div className="relative">
               <textarea
                autoFocus
                className="w-full h-[350px] p-10 studio-card border-brand-dark focus:border-brand-accent outline-none text-2xl font-medium placeholder-brand-dark/10 leading-relaxed resize-none text-brand-dark text-right bg-white"
                placeholder="שתף את המחשבות שלך כאן..."
                value={currentVal}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <div className="absolute bottom-6 right-8 flex items-center gap-2">
                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Studio Editor</span>
                <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-4">
            <button onClick={handleBack} className="text-lg font-bold text-brand-muted hover:text-brand-dark transition-all py-2">
              {currentStepIdx === 0 ? 'ביטול וחזרה' : 'חזרה'}
            </button>
            <button 
              onClick={handleNext}
              disabled={!currentVal.trim()}
              className="bg-brand-dark text-white px-14 py-6 font-black text-xl shadow-[8px_8px_0px_#2563eb] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all active:scale-95 disabled:opacity-10"
            >
              {currentStepIdx === steps.length - 1 ? 'צור תוכנית עבודה' : 'המשך לשלב הבא'}
            </button>
          </div>
        </div>

        {/* AI Assistant Area */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="studio-card p-10 border-brand-dark bg-brand-beige shadow-[12px_12px_0px_#1a1a1a] flex flex-col min-h-[500px] relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10 justify-end">
              <div className="text-right">
                <h4 className="font-black text-2xl text-brand-dark">סוכן AI אסטרטגי</h4>
                <p className="text-[10px] text-brand-accent font-black uppercase tracking-widest mt-1">GK CO-PILOT</p>
              </div>
              <div className="w-14 h-14 bg-white border-2 border-brand-dark flex items-center justify-center">
                <span className="text-2xl">🪄</span>
              </div>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 opacity-40">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-brand-dark">ANALYZING STRATEGY...</p>
                </div>
              ) : feedback ? (
                <div className="space-y-8 animate-fadeIn text-right">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-brand-muted uppercase tracking-widest">תובנה ניהולית:</h5>
                    <p className="text-xl text-brand-dark leading-relaxed font-bold italic border-r-4 border-brand-accent pr-6">
                      "{feedback.analysis}"
                    </p>
                  </div>

                  {!confirmed && (
                    <div className="space-y-6">
                      <div className="bg-white p-8 border-2 border-brand-dark shadow-[6px_6px_0px_rgba(26,26,26,0.1)]">
                        <h5 className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-4">הצעה לדיוק הניסוח (Home & Passion):</h5>
                        <p className="text-lg font-medium text-brand-dark leading-relaxed mb-8">
                          {feedback.refinedText}
                        </p>
                        <button 
                          onClick={handleAdoptRefined}
                          className="w-full bg-brand-dark text-white font-black py-4 hover:bg-brand-accent transition-all flex items-center justify-center gap-3"
                        >
                          אמץ את הניסוח המקצועי
                        </button>
                      </div>

                      <div className="p-6 border-r-4 border-brand-accent bg-white/50 italic">
                        <h5 className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">שאלה למחשבה:</h5>
                        <p className="text-lg font-bold text-brand-dark leading-tight">
                          {feedback.clarifyingQuestion}
                        </p>
                      </div>
                    </div>
                  )}

                  {confirmed && (
                    <div className="bg-white p-10 border-2 border-brand-dark flex flex-col items-center text-center gap-6 animate-fadeIn">
                      <div className="text-5xl">✅</div>
                      <div>
                        <h6 className="text-2xl font-black text-brand-dark mb-2">השלב דויק בהצלחה</h6>
                        <p className="text-brand-muted font-medium italic">הניסוח המקצועי עודכן במערכת.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-30">
                  <div className="text-6xl mb-8">✍️</div>
                  <h6 className="text-2xl font-bold text-brand-dark mb-4">אני מקשיב ומנתח...</h6>
                  <p className="text-lg font-medium">תתחיל לכתוב, ואני אעזור לך להפוך את המשאלה לתוכנית עבודה מיוצבת (Home) ומלאת תשוקה (Passion).</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-brand-dark/5 flex justify-between items-center text-[10px] font-black text-brand-muted tracking-widest">
              <span>GK AI AGENT v2</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand-accent rounded-full"></div>
                <span>CONNECTED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WoopWizard;
