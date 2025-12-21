
import React from 'react';
import { ProjectChange } from '../types';
import { Icons } from './Landing';

interface DashboardProps {
  projects: ProjectChange[];
  onNew: () => void;
  onDelete: (id: string) => void;
  onToggleTask: (projectId: string, taskId: string) => void;
  onBack?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onNew, onDelete, onToggleTask, onBack }) => {
  return (
    <div className="space-y-12 animate-fadeIn pt-28 text-right max-w-7xl mx-auto px-6 pb-32">
      
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

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b-4 border-brand-dark pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-end">
             <span className="text-[11px] font-black text-brand-accent uppercase tracking-[0.4em]">Strategic Change Portfolio</span>
             <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-brand-dark tracking-tighter italic uppercase leading-none">ניהול השינוי</h2>
          <p className="text-brand-muted text-2xl font-bold italic">מרכז הבקרה למהלכים האסטרטגיים שלך מבוססי מודל WOOP.</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-brand-dark text-white px-12 py-6 rounded-none font-black text-xl hover:bg-brand-accent transition-all shadow-[12px_12px_0px_#5a7d9a] active:scale-95 flex items-center justify-center gap-4 border-4 border-brand-dark"
        >
          <span>הגדר מהלך חדש</span>
          <span className="text-2xl">➕</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="grid lg:grid-cols-12 gap-12 items-stretch pt-12">
          <div className="lg:col-span-7 studio-card p-16 border-brand-dark/20 bg-white/50 border-dashed flex flex-col items-center justify-center text-center space-y-10">
            <div className="bg-brand-beige w-32 h-32 border-4 border-brand-dark flex items-center justify-center shadow-[10px_10px_0px_#1a1a1a] p-8 text-brand-dark">
              <Icons.WOOP />
            </div>
            <div className="space-y-6">
              <h3 className="text-4xl font-black text-brand-dark italic">מרחב השינוי ריק</h3>
              <p className="text-brand-muted max-w-md mx-auto text-xl font-medium leading-relaxed">
                כאן יופיעו מהלכי השינוי שלך לאחר שתעבור את אשף ה-WOOP המלווה ב-AI.
              </p>
            </div>
            <button 
              onClick={onNew}
              className="px-16 py-7 bg-brand-dark text-white rounded-none font-black text-2xl hover:bg-brand-accent transition-all shadow-2xl active:scale-95"
            >
              התחל פרויקט שינוי ראשון
            </button>
          </div>

          <div className="lg:col-span-5 studio-card p-12 bg-brand-beige/40 border-brand-dark/10 space-y-10">
            <h4 className="text-[12px] font-black text-brand-dark uppercase tracking-[0.5em] italic">The WOOP Logic</h4>
            <div className="space-y-8">
              {[
                { i: '🏠', t: 'Context', d: 'התמונה הגדולה והצורך הארגוני.' },
                { i: '❤️', t: 'Wish', d: 'המשאלה הבוערת והיעד הספציפי.' },
                { i: '✨', t: 'Outcome', d: 'איך נראית ההצלחה במציאות?' },
                { i: '🧱', t: 'Obstacle', d: 'החסם הפנימי שמפריע לביצוע.' },
                { i: '🚀', t: 'Plan', d: 'תוכנית תגובה אוטומטית למכשול.' }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{step.i}</span>
                  <div>
                    <p className="text-brand-dark font-black text-xl italic">{step.t}</p>
                    <p className="text-brand-muted text-sm font-bold">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 pt-12">
          {projects.map((project) => (
            <div key={project.id} className="studio-card border-brand-dark group hover:border-brand-accent transition-all duration-500 flex flex-col h-full shadow-[12px_12px_0px_rgba(26,26,26,0.05)] bg-white overflow-hidden">
              {/* Card Header with Progress */}
              <div className="bg-brand-dark p-6 text-white flex justify-between items-center">
                 <div className="flex flex-col">
                   <span className="text-[9px] font-black text-brand-accent uppercase tracking-widest mb-1 italic">READINESS SCORE</span>
                   <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-accent" style={{width: `${project.readinessScore || 75}%`}}></div>
                      </div>
                      <span className="text-xs font-black">{project.readinessScore || 75}%</span>
                   </div>
                 </div>
                 <button onClick={() => onDelete(project.id)} className="text-white/30 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 100-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                 </button>
              </div>

              <div className="p-10 flex-1">
                <div className="mb-8">
                  <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.5em] mb-2 block italic">STRATEGIC GOAL</span>
                  <h3 className="text-3xl font-black text-brand-dark tracking-tighter leading-none">{project.title}</h3>
                </div>

                <div className="space-y-6 mb-10">
                   <div className="p-6 bg-brand-beige border-r-8 border-brand-dark">
                      <p className="text-sm text-brand-muted font-bold mb-2 uppercase tracking-widest">Core Wish</p>
                      <p className="text-xl text-brand-dark font-black italic">"{project.woop.wish}"</p>
                   </div>
                   
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Obstacle & Plan (AI Synthesis)</p>
                      <p className="text-sm font-medium leading-relaxed bg-brand-accent/5 p-4 border border-brand-accent/10">
                        כאשר יופיע החסם של <span className="font-bold">"{project.woop.obstacle}"</span>, התגובה האוטומטית תהיה <span className="font-bold">"{project.woop.plan}"</span>.
                      </p>
                   </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[11px] font-black text-brand-dark uppercase tracking-widest">משימות אופרטיביות (AI Generated)</p>
                  </div>
                  {project.tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => onToggleTask(project.id, task.id)}
                      className={`flex items-center gap-4 p-4 border-2 transition-all ${task.completed ? 'opacity-30 border-transparent bg-brand-beige' : 'bg-white border-brand-dark/10 hover:border-brand-accent cursor-pointer'}`}
                    >
                      <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-brand-dark border-brand-dark text-white' : 'border-brand-dark/20'}`}>
                        {task.completed && <span className="text-[10px] font-black">✓</span>}
                      </div>
                      <span className={`text-sm font-bold italic ${task.completed ? 'line-through' : 'text-brand-dark'}`}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-brand-beige px-10 py-4 flex justify-between items-center text-[9px] text-brand-muted font-black uppercase tracking-widest">
                <span>Updated: {new Date(project.createdAt).toLocaleDateString('he-IL')}</span>
                <span className="text-brand-accent">
                   {project.tasks.filter(t => t.completed).length} / {project.tasks.length} משימות בוצעו
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
