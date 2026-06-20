import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WoopProject } from '../types';

interface DashboardProps {
  projects: WoopProject[];
  onToggleTask: (pid: string, tid: string) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onToggleTask, onDelete }) => {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="text-center py-40 border-4 border-brand-dark border-dashed bg-white/50 space-y-8 animate-fadeIn">
        <div className="text-8xl">🎯</div>
        <h2 className="text-4xl font-black text-brand-dark italic">מרחב השינוי ריק</h2>
        <p className="text-xl font-bold text-brand-muted italic max-w-md mx-auto">
          כאן יופיעו מהלכי השינוי האסטרטגיים שלך לאחר שתעבור את אשף ה-WOOP.
        </p>
        <button 
          onClick={() => navigate('/new-woop')}
          className="bg-brand-dark text-white px-12 py-5 font-black text-xl hover:bg-brand-accent transition-all shadow-xl active:scale-95"
        >
          התחל מהלך חדש (Wizard) ←
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex justify-between items-end border-b-4 border-brand-dark pb-8">
        <h2 className="text-5xl font-black text-brand-dark italic">ניהול שינוי (WOOP)</h2>
        <button 
          onClick={() => navigate('/new-woop')}
          className="bg-brand-dark text-white px-8 py-3 font-black text-sm uppercase tracking-widest hover:bg-brand-accent transition-all shadow-[6px_6px_0px_var(--brand-accent)]"
        >
          מהלך חדש +
        </button>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(project => (
          <div key={project.id} className="bg-white border-2 border-brand-dark shadow-[12px_12px_0px_rgba(26,26,26,0.05)] flex flex-col group hover:border-brand-accent transition-all duration-500">
            <div className="bg-brand-dark p-4 flex justify-between items-center text-white">
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-accent">Readiness: {project.readinessScore}%</span>
              <button onClick={() => onDelete(project.id)} className="opacity-30 hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg>
              </button>
            </div>
            
            <div className="p-8 flex-1 space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] italic">STRATEGIC GOAL</span>
                <h3 className="text-3xl font-black text-brand-dark italic tracking-tighter leading-tight">{project.title}</h3>
              </div>

              <div className="p-4 bg-brand-beige border-r-4 border-brand-dark italic font-bold text-sm">
                "{project.data.plan}"
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-brand-dark uppercase tracking-widest border-b border-brand-dark/10 pb-2">משימות אופרטיביות (AI Generated)</h4>
                <div className="space-y-3">
                  {project.tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => onToggleTask(project.id, task.id)}
                      className={`flex items-center gap-3 p-3 border-2 transition-all cursor-pointer ${
                        task.completed ? 'bg-brand-beige/50 border-transparent opacity-40' : 'bg-white border-brand-dark/5 hover:border-brand-accent'
                      }`}
                    >
                      <div className={`w-5 h-5 border-2 flex items-center justify-center ${task.completed ? 'bg-brand-dark border-brand-dark text-white' : 'border-brand-dark/20'}`}>
                        {task.completed && <span className="text-[10px]">✓</span>}
                      </div>
                      <span className={`text-sm font-bold italic ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-8 py-4 bg-brand-beige/30 border-t border-brand-dark/5 text-[9px] font-black uppercase tracking-widest text-brand-muted flex justify-between">
              <span>Created: {new Date(project.createdAt).toLocaleDateString('he-IL')}</span>
              <span className="text-brand-accent">
                {project.tasks.filter(t => t.completed).length}/{project.tasks.length} Done
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
