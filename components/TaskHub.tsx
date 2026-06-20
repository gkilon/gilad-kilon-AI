
import React, { useState } from 'react';
import { Task } from '../types';
import { analyzeTaskMission } from '../geminiService';

interface TaskHubProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
  onBack?: () => void;
}

interface TaskAnalysis {
  subtasks: string[];
  priority: 'low' | 'medium' | 'high';
  managerTip: string;
  quickWin: string;
}

const TaskHub: React.FC<TaskHubProps> = ({ tasks, onUpdate, onBack }) => {
  const [taskInput, setTaskInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<TaskAnalysis | null>(null);

  const startAnalysis = async () => {
    if (!taskInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeTaskMission(taskInput);
      setCurrentAnalysis(result);
    } catch (e) {
      console.error(e);
      handleAddTaskManually();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddTaskManually = () => {
    if (!taskInput.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text: taskInput,
      completed: false,
      priority: 'medium',
      createdAt: Date.now()
    };
    onUpdate([newTask, ...tasks]);
    setTaskInput('');
    setCurrentAnalysis(null);
  };

  const handleApproveAnalysis = () => {
    if (!currentAnalysis) return;
    
    const mainTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text: taskInput,
      completed: false,
      priority: currentAnalysis.priority,
      createdAt: Date.now()
    };

    const subTasks: Task[] = currentAnalysis.subtasks.map((t, idx) => ({
      id: Math.random().toString(36).substr(2, 9),
      text: `└ ${t}`,
      completed: false,
      priority: currentAnalysis.priority,
      createdAt: Date.now() + idx + 1
    }));

    onUpdate([...subTasks, mainTask, ...tasks]);
    setTaskInput('');
    setCurrentAnalysis(null);
  };

  const toggleTask = (id: string) => {
    onUpdate(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    onUpdate(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fadeIn pt-28 pb-32 px-6 text-right">
      
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
        <span className="text-brand-accent font-black uppercase tracking-[0.4em] text-xs italic">Strategic Execution Agent</span>
        <h2 className="text-6xl font-black text-brand-dark tracking-tighter uppercase italic">ניהול משימות חכם</h2>
        <p className="text-brand-muted text-xl font-medium">הפוך כוונה לביצוע מדויק בעזרת סוכן ה-AI.</p>
      </div>

      {/* Input Section */}
      <div className="studio-card p-10 border-brand-dark bg-white shadow-[12px_12px_0px_#1a1a1a] relative overflow-hidden">
        {!currentAnalysis ? (
          <div className="space-y-8">
            <div className="space-y-2">
               <label className="text-[11px] font-black text-brand-muted uppercase tracking-widest">מה המשימה שצריך לקדם?</label>
               <input 
                 type="text" 
                 className="w-full bg-brand-beige/20 border-4 border-brand-dark px-8 py-6 text-2xl text-brand-dark outline-none focus:border-brand-accent transition-all font-bold text-right"
                 placeholder="למשל: הכנת מצגת להנהלה על רבעון 3..."
                 value={taskInput}
                 onChange={(e) => setTaskInput(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && startAnalysis()}
               />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={startAnalysis}
                disabled={isAnalyzing || !taskInput.trim()}
                className="flex-1 bg-brand-dark text-white py-6 font-black text-xl hover:bg-brand-accent transition-all shadow-xl disabled:opacity-20 flex items-center justify-center gap-3"
              >
                {isAnalyzing ? "הסוכן מנתח..." : "עבד משימה עם ה-AI 🪄"}
              </button>
              <button 
                onClick={handleAddTaskManually}
                className="px-10 border-4 border-brand-dark font-black text-xl hover:bg-brand-beige transition-all"
              >
                הוסף ישירות
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
             <div className="flex justify-between items-center border-b-2 border-brand-dark pb-6">
                <span className="bg-brand-accent text-white px-3 py-1 text-[10px] font-black uppercase italic">{currentAnalysis.priority} Priority</span>
                <h3 className="text-3xl font-black text-brand-dark italic">ניתוח הסוכן: {taskInput}</h3>
             </div>

             <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h4 className="text-[11px] font-black text-brand-accent uppercase tracking-widest italic">צעדים אופרטיביים (Backlog):</h4>
                   <ul className="space-y-3">
                      {currentAnalysis.subtasks.map((s, i) => (
                        <li key={i} className="bg-brand-beige/40 p-4 border-r-4 border-brand-dark font-bold text-lg italic">
                          {s}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="space-y-8">
                   <div className="p-8 bg-brand-dark text-white border-brand-accent border-r-8 shadow-lg">
                      <span className="text-[10px] font-black text-brand-accent uppercase mb-2 block">Manager Tip:</span>
                      <p className="text-xl font-black italic">"{currentAnalysis.managerTip}"</p>
                   </div>
                   <div className="p-6 bg-brand-beige border-2 border-brand-dark border-dashed">
                      <span className="text-[10px] font-black text-brand-muted uppercase mb-2 block">Quick Win:</span>
                      <p className="text-lg font-bold italic">{currentAnalysis.quickWin}</p>
                   </div>
                </div>
             </div>

             <div className="flex gap-4 pt-6">
                <button onClick={handleApproveAnalysis} className="flex-1 bg-brand-dark text-white py-6 font-black text-2xl hover:bg-brand-accent transition-all shadow-2xl">
                  אמץ את תוכנית הסוכן ←
                </button>
                <button onClick={() => setCurrentAnalysis(null)} className="px-10 border-4 border-brand-dark font-black text-xl hover:bg-brand-beige transition-all">
                  בטל
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-brand-dark pb-4">
           <h3 className="text-[11px] font-black text-brand-muted uppercase tracking-[0.4em]">ביצוע שוטף</h3>
           <span className="text-xs font-black text-brand-accent">{tasks.length} משימות</span>
        </div>
        
        <div className="grid gap-4">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center justify-between p-6 border-2 transition-all group ${task.completed ? 'bg-brand-beige border-transparent opacity-40' : 'bg-white border-brand-dark/10 hover:border-brand-accent'}`}
            >
              <button onClick={() => deleteTask(task.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity font-black text-[10px] uppercase">מחק</button>
              <div className="flex items-center gap-6 cursor-pointer flex-1 justify-end" onClick={() => toggleTask(task.id)}>
                <div className="text-right">
                  <span className={`text-xl font-black italic ${task.completed ? 'line-through text-brand-muted' : 'text-brand-dark'}`}>{task.text}</span>
                  {task.priority && !task.completed && (
                    <span className={`block text-[9px] font-black uppercase mt-1 ${task.priority === 'high' ? 'text-red-500' : 'text-brand-accent'}`}>
                      {task.priority} priority
                    </span>
                  )}
                </div>
                <div className={`w-10 h-10 border-4 flex items-center justify-center transition-all ${task.completed ? 'bg-brand-dark border-brand-dark text-white' : 'border-brand-dark/20'}`}>
                  {task.completed && <span className="text-sm font-black">✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskHub;
