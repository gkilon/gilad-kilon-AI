
import React, { useState, useEffect } from 'react';
import { ProjectChange, IdeaEntry, Task, UserSession } from './types';
import { fetchFromCloud, isFirebaseReady } from './firebase';
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
import AdminPanel from './components/AdminPanel';

type ViewType = 'home' | 'dashboard' | 'wizard' | 'ideas' | 'synergy' | 'executive' | 'tasks' | 'about' | 'login' | 'communication' | 'feedback360' | 'admin';

const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectChange[]>([]);
  const [ideas, setIdeas] = useState<IdeaEntry[]>([]);
  const [generalTasks, setGeneralTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string>('');
  
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('gk_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<ViewType>('home');
  const dbReady = isFirebaseReady();

  useEffect(() => {
    if (session) {
      localStorage.setItem('gk_session', JSON.stringify(session));
      if (dbReady) loadAllData();
    } else {
      localStorage.removeItem('gk_session');
    }
  }, [session, dbReady]);

  const loadAllData = async () => {
    if (!session || !dbReady || !session.isManager) return;
    setLoading(true);
    try {
      const [p, i, t] = await Promise.all([
        fetchFromCloud('projects', session.teamId),
        fetchFromCloud('ideas', session.teamId),
        fetchFromCloud('general_tasks', session.teamId)
      ]);
      setProjects(p as ProjectChange[]);
      setIdeas(i as IdeaEntry[]);
      setGeneralTasks(t as Task[]);
    } catch (e) {}
    setLoading(false);
  };

  const handleLogin = (teamId: string, isManager: boolean, isAdmin: boolean = false) => {
    setSession({ teamId, isManager });
    if (isAdmin) setView('admin');
    else setView('home');
  };

  const navigateWithAuth = (targetView: ViewType) => {
    if (targetView === 'communication') {
      window.open('https://hilarious-kashata-9aafa2.netlify.app/', '_blank');
      return;
    }
    if (targetView === 'feedback360') {
      window.open('https://ubiquitous-nougat-41808d.netlify.app/', '_blank');
      return;
    }

    const protectedViews: ViewType[] = ['dashboard', 'wizard', 'ideas', 'executive', 'tasks', 'synergy', 'admin'];
    if (!session && protectedViews.includes(targetView)) {
      setLoginMessage('יש להתחבר למערכת');
      setView('login');
      return;
    }

    setView(targetView);
  };

  const renderView = () => {
    if (loading) return <div className="py-40 text-center text-cyan-brand font-black animate-pulse">טוען נתונים...</div>;
    switch(view) {
      case 'login': return <Login onLogin={handleLogin} message={loginMessage} />;
      case 'home': return <Landing onEnterTool={(v) => navigateWithAuth(v as ViewType)} />;
      case 'admin': return <AdminPanel onBack={() => setView('home')} />;
      case 'dashboard': return <Dashboard projects={projects} onNew={() => navigateWithAuth('wizard')} onDelete={() => {}} onToggleTask={() => {}} />;
      case 'wizard': return <WoopWizard onCancel={() => setView('dashboard')} onSave={() => setView('dashboard')} />;
      case 'ideas': return <IdeaManager ideas={ideas} projects={projects} onSave={() => {}} />;
      case 'synergy': return <TeamSynergy session={session} />;
      case 'executive': return <ExecutiveSynergy session={session} />;
      case 'tasks': return <TaskHub tasks={generalTasks} onUpdate={() => {}} />;
      case 'about': return <About />;
      default: return <Landing onEnterTool={(v) => navigateWithAuth(v as ViewType)} />;
    }
  };

  return (
    <div className="min-h-screen app-frame" dir="rtl">
      <Header onNavigate={(v) => navigateWithAuth(v as ViewType)} currentView={view} session={session} onLogout={() => setSession(null)} />
      <main className="max-w-7xl mx-auto px-6 py-8">{renderView()}</main>
    </div>
  );
};

export default App;
