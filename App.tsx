
import React, { useState, useEffect } from 'react';
import { ProjectChange, WoopData, IdeaEntry, Task, UserSession } from './types';
import { fetchFromCloud, syncToCloud, deleteFromCloud, isFirebaseReady } from './firebase';
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

  const dbReady = isFirebaseReady();

  // מנגנון כניסה ישירה לצוות דרך URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const teamParam = params.get('team');
    
    if (teamParam && !session) {
      setSession({ teamId: teamParam.toLowerCase(), isManager: false });
      setView('synergy');
      // ננקה את ה-URL למראה נקי אחרי הכניסה
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (session) {
      localStorage.setItem('gk_session', JSON.stringify(session));
      if (dbReady) {
        loadAllData();
      }
    } else {
      localStorage.removeItem('gk_session');
    }
  }, [session, dbReady]);

  const loadAllData = async () => {
    if (!session || !dbReady || !session.isManager) return;
    setLoading(true);
    try {
      const managerId = session.teamId;
      const [p, i, t] = await Promise.all([
        fetchFromCloud('projects', managerId),
        fetchFromCloud('ideas', managerId),
        fetchFromCloud('general_tasks', managerId)
      ]);
      
      setProjects(p as ProjectChange[]);
      setIdeas(i as IdeaEntry[]);
      setGeneralTasks(t as Task[]);
    } catch (e) {
      console.error("Cloud load failed:", e);
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
    setProjects([]);
    setIdeas([]);
    setGeneralTasks([]);
  };

  const handleSaveWoop = async (data: WoopData) => {
    if (!session || !dbReady) return;
    setLoading(true);
    const id = editingProject?.id || Math.random().toString(36).substr(2, 9);
    
    try {
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
      
      await syncToCloud('projects', { ...newProject, managerId: session.teamId });
      setProjects(prev => editingProject ? prev.map(p => p.id === id ? newProject : p) : [newProject, ...prev]);
      setView('dashboard');
    } catch (e) {
      alert("שגיאת סנכרון: הנתונים לא נשמרו בענן");
    }
    setLoading(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (!session || !dbReady) return;
    try {
      await deleteFromCloud('projects', id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert("מחיקה נכשלה");
    }
  };

  const toggleTask = async (projectId: string, taskId: string) => {
    if (!session || !dbReady) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const updatedTasks = project.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const updatedProject = { ...project, tasks: updatedTasks };
    
    try {
      await syncToCloud('projects', { ...updatedProject, managerId: session.teamId });
      setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
    } catch (e) {}
  };

  const renderView = () => {
    if (loading) return (
      <div className="py-40 text-center space-y-8 animate-fadeIn">
        <div className="w-16 h-16 border-4 border-cyan-brand border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="text-cyan-brand font-black text-2xl uppercase italic tracking-widest">טוען נתונים מהענן...</div>
      </div>
    );

    if (!session && (view !== 'home' && view !== 'about' && view !== 'login')) {
      return <Login onLogin={handleLogin} />;
    }

    switch(view) {
      case 'login': return <Login onLogin={handleLogin} />;
      case 'home': return <Landing onEnterTool={(v) => setView(v as any)} />;
      case 'dashboard': return <Dashboard projects={projects} onNew={() => { setEditingProject(null); setView('wizard'); }} onDelete={handleDeleteProject} onToggleTask={toggleTask} />;
      case 'wizard': return <WoopWizard onCancel={() => setView('dashboard')} onSave={handleSaveWoop} initialData={editingProject?.woop} />;
      case 'ideas': return <IdeaManager ideas={ideas} projects={projects} onSave={i => { setIdeas([i, ...ideas]); syncToCloud('ideas', {...i, managerId: session?.teamId}); }} />;
      case 'synergy': return <TeamSynergy session={session} />;
      case 'executive': return <ExecutiveSynergy history={[]} onSave={() => {}} />;
      case 'tasks': return <TaskHub tasks={generalTasks} onUpdate={t => { setGeneralTasks(t); t.forEach(task => syncToCloud('general_tasks', {...task, managerId: session?.teamId})) }} />;
      case 'about': return <About />;
      default: return <Landing onEnterTool={(v) => setView(v as any)} />;
    }
  };

  return (
    <div className="min-h-screen app-frame" dir="rtl">
      <Header onNavigate={(v) => setView(v as any)} currentView={view} />
      
      <div className="max-w-7xl mx-auto px-6 pt-4 flex justify-between items-center">
        {session ? (
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2 text-emerald-400">
               <span className={`w-2 h-2 rounded-full ${dbReady ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
               <span>{dbReady ? 'מחובר ומסונכרן' : 'שגיאת תקשורת'}</span>
            </div>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">מרחב: {session.teamId}</span>
            <button onClick={handleLogout} className="text-red-400/60 hover:text-red-400 transition-colors mr-2">התנתקות [X]</button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <span className={`w-1.5 h-1.5 rounded-full ${dbReady ? 'bg-cyan-brand' : 'bg-red-500'}`}></span>
            <span>מצב מערכת: {dbReady ? 'פעיל' : 'לא מחובר'}</span>
          </div>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
