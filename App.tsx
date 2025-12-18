
import React, { useState, useEffect } from 'react';
import { ProjectChange, WoopData, IdeaEntry, TeamSynergyPulse, StrategyTest, Task } from './types';
import { fetchFromCloud, syncToCloud, deleteFromCloud } from './firebase';
import Dashboard from './components/Dashboard';
import WoopWizard from './components/WoopWizard';
import Header from './components/Header';
import Landing from './components/Landing';
import IdeaManager from './components/IdeaManager';
import TeamSynergy from './components/TeamSynergy';
import ExecutiveSynergy from './components/ExecutiveSynergy';
import TaskHub from './components/TaskHub';
import About from './components/About';

const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectChange[]>([]);
  const [ideas, setIdeas] = useState<IdeaEntry[]>([]);
  const [synergyHistory, setSynergyHistory] = useState<TeamSynergyPulse[]>([]);
  const [executiveHistory, setExecutiveHistory] = useState<StrategyTest[]>([]);
  const [generalTasks, setGeneralTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState<'home' | 'dashboard' | 'wizard' | 'ideas' | 'synergy' | 'executive' | 'tasks' | 'about'>('home');
  const [editingProject, setEditingProject] = useState<ProjectChange | null>(null);

  const managerId = "gilad_default_team"; // בייצור אפשר להוציא מ-Auth

  useEffect(() => {
    // טעינה ראשונית מהענן
    const loadAllData = async () => {
      setLoading(true);
      try {
        const p = await fetchFromCloud('projects', managerId);
        const i = await fetchFromCloud('ideas', managerId);
        const t = await fetchFromCloud('general_tasks', managerId);
        
        if (p.length) setProjects(p as ProjectChange[]);
        if (i.length) setIdeas(i as IdeaEntry[]);
        if (t.length) setGeneralTasks(t as Task[]);
      } catch (e) {
        console.error("Failed to load cloud data, falling back to local storage", e);
        // Fallback ל-local storage אם אין חיבור לענן
        const lp = localStorage.getItem('gk_projects');
        if (lp) setProjects(JSON.parse(lp));
      }
      setLoading(false);
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'survey') {
      setView('synergy');
    }

    loadAllData();
  }, []);

  // שמירה לענן בכל שינוי
  const handleSaveWoop = async (data: WoopData) => {
    const id = editingProject?.id || Math.random().toString(36).substr(2, 9);
    const newProject: ProjectChange = {
      id,
      title: data.wish.split('\n')[0].substring(0, 40),
      createdAt: editingProject?.createdAt || Date.now(),
      woop: data,
      tasks: editingProject?.tasks || [
        { id: Math.random().toString(36).substr(2, 5), text: `מימוש שלב הפעולה: ${data.plan.substring(0, 30)}...`, completed: false, createdAt: Date.now() }
      ],
      readinessScore: 8
    };
    
    // עדכון סטייט מקומי
    if (editingProject) setProjects(projects.map(p => p.id === id ? newProject : p));
    else setProjects([newProject, ...projects]);
    
    // סנכרון לענן
    await syncToCloud('projects', { ...newProject, managerId });
    setView('dashboard');
  };

  const handleDeleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    await deleteFromCloud('projects', id);
  };

  const handleToggleTask = async (pid: string, tid: string) => {
    const updatedProjects = projects.map(p => {
      if (p.id === pid) {
        const updatedTasks = p.tasks.map(t => t.id === tid ? {...t, completed: !t.completed} : t);
        const updatedProj = {...p, tasks: updatedTasks};
        syncToCloud('projects', { ...updatedProj, managerId });
        return updatedProj;
      }
      return p;
    });
    setProjects(updatedProjects);
  };

  const handleSaveIdea = async (idea: IdeaEntry) => {
    setIdeas([idea, ...ideas]);
    await syncToCloud('ideas', { ...idea, managerId });
  };

  const handleUpdateGeneralTasks = async (newTasks: Task[]) => {
    setGeneralTasks(newTasks);
    // לצורך פשטות נסנכרן את כל המערך (אפשר גם אחד אחד)
    for (const t of newTasks) {
      await syncToCloud('general_tasks', { ...t, managerId });
    }
  };

  const renderView = () => {
    if (loading) return <div className="py-40 text-center animate-pulse text-cyan-brand font-black">טוען נתונים מהענן...</div>;

    switch(view) {
      case 'home': return <Landing onEnterTool={(v, url) => url ? window.open(url, '_blank') : setView(v as any)} />;
      case 'dashboard': return <Dashboard projects={projects} onNew={() => { setEditingProject(null); setView('wizard'); }} onDelete={handleDeleteProject} onToggleTask={handleToggleTask} />;
      case 'wizard': return <WoopWizard onCancel={() => setView('dashboard')} onSave={handleSaveWoop} initialData={editingProject?.woop} />;
      case 'ideas': return <IdeaManager ideas={ideas} projects={projects} onSave={handleSaveIdea} />;
      case 'synergy': return <TeamSynergy history={synergyHistory} onSave={p => setSynergyHistory([p, ...synergyHistory])} />;
      case 'executive': return <ExecutiveSynergy history={executiveHistory} onSave={s => setExecutiveHistory([s, ...executiveHistory])} />;
      case 'tasks': return <TaskHub tasks={generalTasks} onUpdate={handleUpdateGeneralTasks} />;
      case 'about': return <About />;
      default: return <Landing onEnterTool={(v) => setView(v as any)} />;
    }
  };

  return (
    <div className="min-h-screen selection:bg-cyan-brand/30 app-frame" dir="rtl">
      <Header onNavigate={(v) => {
        if (v === 'communication') window.open('https://hilarious-kashata-9aafa2.netlify.app/', '_blank');
        else if (v === 'feedback360') window.open('https://ubiquitous-nougat-41808d.netlify.app/', '_blank');
        else setView(v as any);
      }} currentView={view} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {view !== 'home' && (
          <button onClick={() => setView('home')} className="mb-6 group flex items-center gap-2 text-slate-500 hover:text-cyan-brand transition-all font-bold text-xs uppercase tracking-widest">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Hub
          </button>
        )}
        {renderView()}
      </main>
    </div>
  );
};

export default App;
