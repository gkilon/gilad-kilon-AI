
import React, { useState, useEffect } from 'react';
import { ProjectChange, IdeaEntry, Task, UserSession, Article, ViewType, WoopData } from './types';
import { fetchFromCloud, isFirebaseReady, getSystemConfig, syncToCloud, deleteFromCloud } from './firebase';
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
import Feedback360 from './components/Feedback360';
import CommunicationDNA from './components/CommunicationDNA';
import TheLab from './components/TheLab';
import ToolTeaser from './components/ToolTeaser';
import ClientsPage from './components/ClientsPage';
import BrandAssets from './components/BrandAssets';
import ArticlesPage from './components/ArticlesPage';
import ArticleDetail from './components/ArticleDetail';

const FloatingWhatsApp: React.FC = () => (
  <a 
    href="https://wa.me/972526417512" 
    target="_blank" 
    rel="noopener noreferrer"
    className="fixed bottom-8 left-8 z-[100] group flex items-center gap-4"
  >
    <div className="bg-white border-2 border-brand-dark px-4 py-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 shadow-lg pointer-events-none">
      <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest whitespace-nowrap">Chat on WhatsApp</span>
    </div>
    <div className="w-16 h-16 bg-brand-accent border-2 border-brand-dark flex items-center justify-center shadow-[6px_6px_0px_#1a1a1a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#1a1a1a] transition-all active:scale-95">
      <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.89 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.743-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
      </svg>
    </div>
  </a>
);

const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectChange[]>([]);
  const [ideas, setIdeas] = useState<IdeaEntry[]>([]);
  const [generalTasks, setGeneralTasks] = useState<Task[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('gk_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<ViewType>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'synergy' && params.get('teamId')) return 'synergy';
    return 'home';
  });

  const dbReady = isFirebaseReady();

  useEffect(() => {
    getSystemConfig().then(config => {
      setArticles(config.articles || []);
    });
    
    if (session) {
      localStorage.setItem('gk_session', JSON.stringify(session));
      if (dbReady) loadAllData();
    } else {
      localStorage.removeItem('gk_session');
    }
  }, [session, dbReady]);

  const loadAllData = async () => {
    if (!session || !dbReady) return;
    setLoading(true);
    try {
      const [p, i, t] = await Promise.all([
        fetchFromCloud('projects', session.teamId),
        fetchFromCloud('ideas', session.teamId),
        fetchFromCloud('general_tasks', session.teamId)
      ]);
      setProjects(p as ProjectChange[]);
      setIdeas(i as IdeaEntry[]);
      const teamTasksDoc = t.find(doc => doc.id === 'main_list');
      if (teamTasksDoc && (teamTasksDoc as any).tasks) {
        setGeneralTasks((teamTasksDoc as any).tasks);
      } else {
        setGeneralTasks(t as any as Task[]);
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleSaveWoop = async (woop: WoopData, suggestedTasks: string[]) => {
    if (!session) return;
    const newProject: ProjectChange = {
      id: Math.random().toString(36).substr(2, 9),
      title: woop.wish,
      createdAt: Date.now(),
      woop,
      tasks: suggestedTasks.map(t => ({ id: Math.random().toString(36).substr(2, 9), text: t, completed: false, createdAt: Date.now() })),
      readinessScore: 85,
      managerId: session.teamId
    } as any;
    
    setProjects([newProject, ...projects]);
    if (dbReady) await syncToCloud('projects', newProject);
    setView('dashboard');
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("למחוק את מהלך השינוי?")) return;
    setProjects(projects.filter(p => p.id !== id));
    if (dbReady) await deleteFromCloud('projects', id);
  };

  const handleToggleWoopTask = async (projectId: string, taskId: string) => {
    const newProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) };
      }
      return p;
    });
    setProjects(newProjects);
    const updated = newProjects.find(p => p.id === projectId);
    if (dbReady && updated) await syncToCloud('projects', updated);
  };

  const renderView = () => {
    if (loading) return <div className="py-40 text-center text-brand-accent font-black animate-pulse text-4xl">טוען נתונים...</div>;
    const backToLab = () => setView('lab');

    switch(view) {
      case 'login': return <Login onLogin={(tid, isM, isA) => { setSession({teamId: tid, isManager: isM}); if (isA) setView('admin'); else setView('home'); }} />;
      case 'home': return <Landing onEnterTool={(v) => setView(v as ViewType)} />;
      case 'lab': return <TheLab onEnterTool={(v) => setView(v as ViewType)} onBack={() => setView('home')} isLoggedIn={!!session} />;
      case 'dashboard': return <Dashboard projects={projects} onNew={() => setView('wizard')} onDelete={handleDeleteProject} onToggleTask={handleToggleWoopTask} onBack={backToLab} />;
      case 'wizard': return <WoopWizard onCancel={() => setView('dashboard')} onSave={handleSaveWoop} />;
      case 'ideas': return <IdeaManager ideas={ideas} projects={projects} onSave={(i) => { setIdeas([i, ...ideas]); if (dbReady && session) syncToCloud('ideas', {...i, managerId: session.teamId}); }} onBack={backToLab} />;
      case 'synergy': return <TeamSynergy session={session} onBack={backToLab} />;
      case 'executive': return <ExecutiveSynergy session={session} onBack={backToLab} />;
      case 'tasks': return <TaskHub tasks={generalTasks} onUpdate={(t) => { setGeneralTasks(t); if (session && dbReady) syncToCloud('general_tasks', {id: 'main_list', managerId: session.teamId, tasks: t}); }} onBack={backToLab} />;
      case 'feedback360': return <Feedback360 onBack={backToLab} />;
      case 'communication': return <CommunicationDNA onBack={backToLab} />;
      case 'about': return <About />;
      case 'clients': return <ClientsPage />;
      case 'admin': return <AdminPanel onBack={() => setView('home')} onGoToAssets={() => setView('brand_assets')} />;
      case 'brand_assets': return <BrandAssets onBack={() => setView('admin')} />;
      case 'articles': return <ArticlesPage articles={articles} onSelectArticle={(a) => { setSelectedArticle(a); setView('article_detail'); }} />;
      case 'article_detail': return selectedArticle ? <ArticleDetail article={selectedArticle} onBack={() => setView('articles')} /> : <ArticlesPage articles={articles} onSelectArticle={(a) => { setSelectedArticle(a); setView('article_detail'); }} />;
      default: return <Landing onEnterTool={(v) => setView(v as ViewType)} />;
    }
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <Header onNavigate={(v) => { setSelectedArticle(null); setView(v as ViewType); }} currentView={view} session={session} onLogout={() => setSession(null)} />
      <main className="w-full mx-auto">{renderView()}</main>
      <FloatingWhatsApp />
    </div>
  );
};

export default App;
