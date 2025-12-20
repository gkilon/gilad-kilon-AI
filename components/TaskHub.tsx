
import React, { useState } from 'react';
import { Task } from '../types';

interface TaskHubProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
  onBack?: () => void;
}

const TaskHub: React.FC<TaskHubProps> = ({ tasks, onUpdate, onBack }) => {
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text: newTask,
      completed: false,
      createdAt: Date.now()
    };
    onUpdate([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    onUpdate(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    onUpdate(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pt-28 pb-20 px-6">
      
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
        <span className="text-brand-accent font-black uppercase tracking-[0.4em] text-xs drop-shadow-[0_0_10px_rgba(37,99,235,0.2)] italic">Operational Center</span>
        <h2 className="text-6xl font-black text-brand-dark tracking-tighter uppercase italic">משימות שוטפות</h2>
        <p className="text-brand-muted text-xl font-medium">ניהול הביצוע היומיומי של הצוות והארגון.</p>
      </div>

      <div className="studio-card p-8 md:p-12 border-brand-dark bg-white shadow-[12px_12px_0px_rgba(26,26,26,0.05)]">
        <div className="flex gap-4">
          <input 
            type="text" 
            className="flex-1 bg-brand-beige/20 border-2 border-brand-dark px-8 py-6 text-xl text-brand-dark outline-none focus:border-brand-accent transition-all font-bold text-right"
            placeholder="מה המשימה הבאה?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button 
            onClick={addTask}
            className="bg-brand-dark text-white px-10 rounded-none font-black text-lg hover:bg-brand-accent transition-all"
          >
            הוסף
          </button>
        </div>

        <div className="mt-12 space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-10 opacity-30 italic text-brand-muted">
              אין משימות פעילות כרגע...
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`flex items-center justify-between p-6 border-2 transition-all ${task.completed ? 'bg-brand-beige border-transparent opacity-50' : 'bg-white border-brand-dark/10 hover:border-brand-accent'}`}>
                <div className="flex items-center gap-6 cursor-pointer flex-1 justify-end" onClick={() => toggleTask(task.id)}>
                  <span className={`text-xl font-bold italic ${task.completed ? 'line-through text-brand-muted' : 'text-brand-dark'}`}>{task.text}</span>
                  <div className={`w-8 h-8 border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-brand-dark border-brand-dark text-white' : 'border-brand-dark/20'}`}>
                    {task.completed && <span className="text-xs font-black">✓</span>}
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-brand-muted hover:text-red-500 transition-colors px-4 font-black text-xs uppercase tracking-widest">מחק</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskHub;
