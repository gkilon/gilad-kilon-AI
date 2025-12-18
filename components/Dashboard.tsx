
import React from 'react';
import { ProjectChange } from '../types';

interface DashboardProps {
  projects: ProjectChange[];
  onNew: () => void;
  onDelete: (id: string) => void;
  onToggleTask: (projectId: string, taskId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onNew, onDelete, onToggleTask }) => {
  return (
    <div className="space-y-10 animate-fadeIn pt-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white leading-tight uppercase tracking-tighter">ניהול השינוי</h2>
          <p className="text-slate-400 mt-2 text-lg">מעקב אחר יוזמות אסטרטגיות והוצאה לפועל של מהלכי שינוי מבוססי WOOP.</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-transparent hover:bg-cyan-brand text-cyan-brand hover:text-slate-950 px-10 py-4 rounded-2xl font-black transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 border-2 border-cyan-brand/30 hover:border-cyan-brand shadow-xl hover:shadow-cyan-brand/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          הגדר מהלך שינוי (WOOP)
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7 glass-card rounded-[3rem] p-12 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-8">
            <div className="bg-slate-900/50 w-24 h-24 rounded-3xl flex items-center justify-center shadow-inner">
              <span className="text-5xl">🎯</span>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-white">סביבת העבודה שלך מוכנה</h3>
              <p className="text-slate-400 max-w-md mx-auto text-xl leading-relaxed">
                כאן יופיעו תוכניות העבודה שלך. כרגע אין מהלכים פעילים בצוות. 
                <br/>
                <span className="text-cyan-brand font-bold">הגיע הזמן להפוך רצון למציאות.</span>
              </p>
            </div>
            <button 
              onClick={onNew}
              className="px-16 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-2xl hover:bg-cyan-brand transition-all shadow-2xl active:scale-95"
            >
              צור את הפרויקט הראשון
            </button>
          </div>

          <div className="lg:col-span-5 glass-card rounded-[3rem] p-10 bg-cyan-brand/5 border-cyan-brand/20 space-y-8">
            <h4 className="text-xs font-black text-cyan-brand uppercase tracking-[0.4em]">Why WOOP?</h4>
            <div className="space-y-6">
              {[
                { l: 'W', t: 'Wish', d: 'מגדירים מה באמת רוצים להשיג.' },
                { l: 'O', t: 'Outcome', d: 'מדמיינים את תחושת ההצלחה.' },
                { l: 'O', t: 'Obstacle', d: 'מזהים את החסם הפנימי האמיתי.' },
                { l: 'P', t: 'Plan', d: 'בונים תגובה אוטומטית למכשול.' }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <span className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-cyan-brand font-black text-xl border border-cyan-brand/20 shadow-lg">{step.l}</span>
                  <div>
                    <p className="text-white font-black text-lg">{step.t}</p>
                    <p className="text-slate-400 text-sm font-medium">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-cyan-brand/10 text-[11px] text-cyan-brand/60 font-medium italic">
              "ה-AI של גלעד ילווה אותך בניסוח ובניית משימות אופרטיביות אוטומטית."
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="glass-card rounded-[2.5rem] overflow-hidden group hover:border-cyan-brand/30 transition-all duration-500 flex flex-col h-full shadow-2xl">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-cyan-brand uppercase tracking-widest mb-1">STRATEGIC INITIATIVE</span>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-brand transition-colors line-clamp-1">{project.title}</h3>
                  </div>
                  <button onClick={() => onDelete(project.id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 100-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">היעד האסטרטגי</p>
                      <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed font-medium italic">"{project.woop.wish}"</p>
                   </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-2 mb-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">AI Suggested Tasks:</p>
                    <span className="text-[9px] bg-cyan-brand/10 text-cyan-brand px-2 py-0.5 rounded-full font-black">READY</span>
                  </div>
                  {project.tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => onToggleTask(project.id, task.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 cursor-pointer transition-all ${task.completed ? 'opacity-40 bg-slate-900/20' : 'bg-slate-900/50 hover:bg-slate-800 hover:scale-[1.02]'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-cyan-brand border-cyan-brand text-slate-950' : 'border-slate-700'}`}>
                        {task.completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900/80 px-8 py-4 flex justify-between items-center text-[10px] text-slate-500 font-bold border-t border-white/5">
                <span>Created: {new Date(project.createdAt).toLocaleDateString('he-IL')}</span>
                <div className="flex items-center gap-2">
                   <span className="text-cyan-brand font-black">
                     {project.tasks.filter(t => t.completed).length} / {project.tasks.length} משימות הושלמו
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
