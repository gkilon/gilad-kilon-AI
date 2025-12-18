
import React, { useState } from 'react';
import { Task } from '../types';

interface TaskHubProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
}

const TaskHub: React.FC<TaskHubProps> = ({ tasks, onUpdate }) => {
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
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20">
      <div className="text-center space-y-4">
        <span className="text-emerald-400 font-black uppercase tracking-[0.4em] text-xs drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">Operational Center</span>
        <h2 className="text-6xl font-black text-white tracking-tighter uppercase">משימות שוטפות</h2>
        <p className="text-slate-400 text-xl font-medium">ניהול הביצוע היומיומי של הצוות והארגון.</p>
      </div>

      <div className="glass-card rounded-[3rem] p-8 md:p-12 border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.05)]">
        <div className="flex gap-4">
          <input 
            type="text" 
            className="flex-1 bg-slate-950/50 border border-white/5 rounded-2xl px-8 py-6 text-xl text-white outline-none focus:border-emerald-500 transition-all"
            placeholder="מה המשימה הבאה?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
          />
          <button 
            onClick={addTask}
            className="bg-white text-slate-950 px-10 rounded-2xl font-black text-lg hover:bg-emerald-500 hover:text-white transition-all"
          >
            הוסף
          </button>
        </div>

        <div className="mt-12 space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-10 opacity-30 italic text-slate-500">
              אין משימות פעילות כרגע...
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${task.completed ? 'bg-slate-900/20 border-white/5 opacity-50' : 'bg-slate-950/50 border-white/10 hover:border-emerald-500/30'}`}>
                <div className="flex items-center gap-6 cursor-pointer flex-1" onClick={() => toggleTask(task.id)}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-slate-900' : 'border-slate-700'}`}>
                    {task.completed && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`text-xl font-medium ${task.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>{task.text}</span>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-slate-600 hover:text-red-500 transition-colors px-4">
                  מחק
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskHub;
