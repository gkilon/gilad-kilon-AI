
import React, { useState, useEffect } from 'react';
import { ProjectChange, WoopData, IdeaEntry, TeamSynergyPulse, StrategyTest, Task, UserSession } from './types';
import { fetchFromCloud, syncToCloud, deleteFromCloud } from './firebase';
import { suggestTasksForWoop } from './geminiService';
import Dashboard from './components/Dashboard';
import WoopWizard from './components/WoopWizard';
import Header from './components/Header';
import Landing from './components/Landing';
import IdeaManager from './components/IdeaManager';
import TeamSynergy from './components/TeamSynergy';
import ExecutiveSynergy from './components/ExecutiveSynergy';
import TaskHub from './components/TaskHub';
import About from './components/About';
import Login from './components/Login';

const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectChange[]>([]);
  const [ideas, setIdeas] = useState<IdeaEntry[]>([]);
  const [generalTasks, setGeneralTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('gk_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<'home' | 'dashboard' | 'wizard' | 'ideas' | 'synergy' | 'executive' | 'tasks' | 'about' | 'login'>('home');
  const [editingProject, setEditingProject] = useState<ProjectChange | null>(null);

  useEffect(() => {
    if (session) {
      localStorage.setItem('gk_session', JSON.stringify(session));
      loadAllData();
    } else {
      localStorage.removeItem('gk_session');
    }
  }, [session]);

  const loadAllData = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const managerId = session.teamId;
      const p = await fetchFromCloud('projects', managerId);
      const i = await fetchFromCloud('ideas', managerId);
      const t = await fetchFromCloud('general_tasks', managerId);
      
      setProjects(p as ProjectChange[]);
      setIdeas(i as IdeaEntry[]);
      setGeneralTasks(t as Task[]);
    } catch (e) {
      console.error("Failed to load cloud data", e);
    }
    setLoading(false);
  };

  const handleLogin = (teamId: string, isManager: boolean) => {
    setSession({ teamId, isManager });
    setView(isManager ? 'dashboard' : 'synergy');
  };

  const handleLogout = () => {
    setSession(null);
    setView('home');
  };

  const handleSaveWoop = async (data: WoopData) => {
    if (!session) return;
    setLoading(true);
    const id = editingProject?.id || Math.random().toString(36).substr(2, 9);
    
    // AI Task Suggestion
    const suggestedTaskTexts = await suggestTasksForWoop(data);
    const aiTasks: Task[] = suggestedTaskTexts.map(text => ({
      id: Math.random().toString(36).substr(2, 5),
      text,
      completed: false,
      createdAt: Date.now()
    }));

    const newProject: ProjectChange = {
      id,
      title: data.wish.split('\n')[0].substring(0, 40),
      createdAt: editingProject?.createdAt || Date.now(),
      woop: data,
      tasks: aiTasks,
      readinessScore: 8
    };
    
    setProjects(prev => editingProject ? prev.map(p => p.id === id ? newProject : p) : [newProject, ...prev]);
    await syncToCloud('projects', { ...newProject, managerId: session.teamId });
    setLoading(false);
    setView('dashboard');
  };

  const toggleTask = async (projectId: string, taskId: string) => {
    if (!session) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const updatedTasks = project.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const updatedProject = { ...project, tasks: updatedTasks };
    
    setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
    await syncToCloud('projects', { ...updatedProject, managerId: session.teamId });
  };

  const renderView = () => {
    if (loading) return <div className="py-40 text-center animate-pulse text-cyan-brand font-black text-2xl uppercase italic tracking-widest">סנכרון אסטרטגי מול הענן של גלעד...</div>;

    if (!session && (view !== 'home' && view !== 'about' && view !== 'login')) {
      return <Login onLogin={handleLogin} />;
    }

    switch(view) {
      case 'login': return <Login onLogin={handleLogin} />;
      case 'home': return <Landing onEnterTool={(v) => setView(v as any)} />;
      case 'dashboard': return <Dashboard projects={projects} onNew={() => { setEditingProject(null); setView('wizard'); }} onDelete={id => deleteFromCloud('projects', id)} onToggleTask={toggleTask} />;
      case 'wizard': return <WoopWizard onCancel={() => setView('dashboard')} onSave={handleSaveWoop} initialData={editingProject?.woop} />;
      case 'ideas': return <IdeaManager ideas={ideas} projects={projects} onSave={i => { setIdeas([i, ...ideas]); syncToCloud('ideas', {...i, managerId: session?.teamId}); }} />;
      case 'synergy': return <TeamSynergy history={[]} onSave={() => {}} />;
      case 'executive': return <ExecutiveSynergy history={[]} onSave={() => {}} />;
      case 'tasks': return <TaskHub tasks={generalTasks} onUpdate={t => { setGeneralTasks(t); t.forEach(task => syncToCloud('general_tasks', {...task, managerId: session?.teamId})) }} />;
      case 'about': return <About />;
      default: return <Landing onEnterTool={(v) => setView(v as any)} />;
    }
  };

  return (
    <div className="min-h-screen app-frame" dir="rtl">
      <Header onNavigate={(v) => setView(v as any)} currentView={view} />
      
      {session && (
        <div className="max-w-7xl mx-auto px-6 pt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
           <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Workspace: {session.teamId}</span>
           </div>
           <button onClick={handleLogout} className="hover:text-red-400 transition-colors">Logout [X]</button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
