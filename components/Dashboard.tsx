
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
    <div className="space-y-10 animate-fadeIn pt-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white leading-tight uppercase tracking-tighter">ניהול השינוי</h2>
          <p className="text-slate-400 mt-2 text-lg">מעקב אחר יוזמות אסטרטגיות והוצאה לפועל של מהלכי שינוי.</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-cyan-brand hover:bg-cyan-400 text-slate-950 px-10 py-4 rounded-2xl font-black transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-cyan-brand/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          התחל מהלך חדש
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-32 glass-card rounded-[3rem] border-dashed border-white/10">
          <div className="bg-slate-900/50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">אין תהליכי שינוי פעילים</h3>
          <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed">
            זה הזמן להגדיר את השינוי הבא שלך. ה-AI של גלעד ילווה אותך צעד אחר צעד.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="glass-card rounded-[2.5rem] overflow-hidden group hover:border-cyan-brand/30 transition-all duration-500 flex flex-col h-full">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-cyan-brand uppercase tracking-widest mb-1">CHANGE PROJECT</span>
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
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">המטרה</p>
                      <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">{project.woop.wish}</p>
                   </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-2">משימות לביצוע:</p>
                  {project.tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => onToggleTask(project.id, task.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 cursor-pointer transition-all ${task.completed ? 'opacity-40 bg-slate-900/20' : 'bg-slate-900/50 hover:bg-slate-800'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-cyan-brand border-cyan-brand text-slate-950' : 'border-slate-700'}`}>
                        {task.completed && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-600' : 'text-slate-300'}`}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900/80 px-8 py-4 flex justify-between items-center text-[10px] text-slate-500 font-bold border-t border-white/5">
                <span>{new Date(project.createdAt).toLocaleDateString('he-IL')}</span>
                <div className="flex items-center gap-2">
                   <span className="text-cyan-brand">
                     {project.tasks.filter(t => t.completed).length} / {project.tasks.length} הושלמו
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
