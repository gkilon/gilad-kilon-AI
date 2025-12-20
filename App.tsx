
import React, { useState, useEffect } from 'react';
import { ProjectChange, IdeaEntry, Task, UserSession, Article } from './types';
import { fetchFromCloud, isFirebaseReady, getSystemConfig } from './firebase';
import Dashboard from './components/Dashboard';
import WoopWizard from './components/WoopWizard';
import Header from './components/Header';
import Landing, { ArticleCard } from './components/Landing';
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

type ViewType = 'home' | 'lab' | 'dashboard' | 'wizard' | 'ideas' | 'synergy' | 'executive' | 'tasks' | 'about' | 'clients' | 'login' | 'communication' | 'feedback360' | 'admin' | 'articles' | 'article_detail';

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
  const [loginMessage, setLoginMessage] = useState<string>('');
  
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('gk_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<ViewType>('home');
  const dbReady = isFirebaseReady();

  const defaultArticles: Article[] = [
    {
      id: 'market-vs-strategy-2024',
      title: 'קניות בשוק או אסטרטגיה?',
      subtitle: 'כמה מחשבות על עובדים תפקידים וסדר כאוטי',
      category: 'אסטרטגיה וניהול',
      date: '2024',
      content: `"איטלקי אמיתי לא בא לשוק עם רשימת קניות" סיפר לי פעם מכר איטלקי.\n\nלמה?\nכי הוא לא יודע איזה סחורה הוא יפגוש ביום נתון. הוא בא לשוק מסתכל על הסחורה ולפי חומרי הגלם האיכותיים שיש באותו יום הוא בונה את התפריט. \n\nמקסים, אה? \nקצת בלאגן קצת שכונה אבל יש פה משהו יפה ורומנטי בזה. \nואולי גם פרקטי לארגונים דווקא היום...\n\nהעולם המתוכנן והתכליתי שלנו עובד הפוך. יש כבר מסורת שלמה של רעיונות וסיפורים שמבססים את עקרון התכנון מהסוף להתחלה-תגיד לאן אתה רוצה להגיע, ולפי זה תחליט באיזו דרך ללכת. סה"כ הגיוני ונכון.\n\nבאחת החברות שליוויתי בשנים האחרונות היתה תופעה מרתקת - כפוגשים מועמד טוב קודם כל מביאים אותו אח"כ מוצאים מה לעשות איתו. \nזה הגיע לרמת כאוס אבל היה לי ברור שאי אפשר ולא נכון להפסיק את זה לחלוטין אלא קצת לתחום את זה. \nמה ההיגיון המארגן? היגיון השוק באיטליה. יש סחורה טובה אני לוקח. אח"כ נראה מה בדיוק לעשות עם זה ויש מצב שנצטרך ללמוד תוך כדי תנועה. \n\nאולי עכשיו זה זמן טוב לקחת משהו מההיגיון הזה גם לארגונים אחרים. \nלייצר טיפה יותר תנועה וטיפה וגמישות מבנית ותפקודית שתאפשר לנו לזוז קצת אחרת. \n\nהיום בהרבה מאוד מקרים עולם הגיוס שבוי בתוך הקונספט הזה (שלא הוא בנה) וצריך להתאים אנשים לתפקידים ספציפיים עם כישורים ספציפיים עם ניסיון ספציפי בתעשייה ספציפית (ולפעמים עם עוד רזולוציות). תשאלו את הג'וניורים... \nאז מחפשים בפינצטה מועמדים שיתאימו בדיוק לתפקיד ומשקיעים המון משאבים פיזיים ומנטליים עד שמוצאים\nופתאום אין...אז עובדים יותר קשה? אז מה עושים? \nאולי אולי לפעמים במקומות מסוימים אפשר קצת להתחיל לפתוח את היום בשוק ולא בספר מתכונים.\nזה לא עניין טכני וזו לא סוגיה של גיוס. זה מתחיל מאסטרטגיה.\nועכשיו זה זמן מצוין להסתכל עליה מחדש`
    },
    {
      id: 'senior-leadership-2025',
      title: 'מחשבות על פיתוח ניהולי לבכירים',
      category: 'פיתוח מנהיגות',
      date: '2025',
      content: `באחת הסדנאות שהיו לי החודש עם קבוצת מנהלים בכירים, מישהו העלה שאלה פשוטה לכאורה:\n“איך אני יודע מתי אני חלק מהקבוצה, ומתי אני פשוט הולך לאיבוד בתוכה?”\n\nהשאלה הזו נראתה בהתחלה מובנת מאליה. כאילו שאלה בסיסית– הרי לכולנו חשוב להשתייך, וגם להיות חלק ממשהו גדול יותר.\nאבל אז התחיל לעלות משהו נוסף:\nמתי הרצון להשתלב ולשמור על הרמוניה גורם לנו לוותר קצת על עצמנו והופך מעקרון מאזן לעקרון מעכב?\nומתי הרצון להתבלט ולהוביל גורם לנו להתרחק מהאחרים והאם בכלל אפשר לשלב שניהול בכיר ובדידות באים יחד באותה חבילה?\n\nהשאלות האלו לוקחות אותנו ללב העשייה הניהולית. ככל שעולים בהיררכיה, המתח הזה – בין השייכות לבידול – הופך למרכיב מרכזי בתפקוד.\nולא , אין פה פתרון פשוט.\nאי אפשר “לפתור” את המתח הזה.\nאבל אפשר להכיר בו, להבין אותו, וללמוד לעבוד איתו.\nאפשר להכיר את עצמנו טוב יותר ולהבין אילו ״כפתורים״ נלחצים לנו ובאילו סיטואציות זה קורה ואיך כל אדם מנהל אחרת את המתח הזה.\n\nמבחינתי, זו הדגמה מצויינת ללב של תהליך פיתוח מנהלים בכירים. זה לא עניין של כלים, שיטות או טכניקות. מה שמביא לקפיצת מדרגה זה עיסוק בשאלות מהותיות שמחברות בין עומק לפרקטיקה.\n\nכי בסוף, מנהיגות בכירה היא לא על “להשתייך” או “להתבלט”.\nהיא על לדעת מתי כל אחד מהכוחות האלה משרת אותך – ומתי הם תוקעים אותך.`
    }
  ];

  useEffect(() => {
    getSystemConfig().then(config => {
      const dbArticles = config.articles || [];
      setArticles(dbArticles.length > 0 ? dbArticles : defaultArticles);
    });
    
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

  const navigateToView = (targetView: ViewType) => {
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    if (loading) return <div className="py-40 text-center text-brand-accent font-black animate-pulse text-4xl">טוען נתונים...</div>;

    const protectedViews: ViewType[] = ['dashboard', 'wizard', 'ideas', 'executive', 'tasks', 'synergy', 'communication', 'feedback360'];
    if (!session && protectedViews.includes(view)) {
      return <ToolTeaser toolId={view} onLogin={() => setView('login')} />;
    }

    const backToLab = () => navigateToView('lab');

    switch(view) {
      case 'login': return <Login onLogin={handleLogin} message={loginMessage} />;
      case 'home': return <Landing onEnterTool={(v) => navigateToView(v as ViewType)} />;
      case 'lab': return <TheLab onEnterTool={(v) => navigateToView(v as ViewType)} isLoggedIn={!!session} />;
      case 'admin': return <AdminPanel onBack={() => setView('home')} />;
      case 'dashboard': return <Dashboard projects={projects} onNew={() => setView('wizard')} onDelete={() => {}} onToggleTask={() => {}} onBack={backToLab} />;
      case 'wizard': return <WoopWizard onCancel={() => setView('dashboard')} onSave={() => setView('dashboard')} />;
      case 'ideas': return <IdeaManager ideas={ideas} projects={projects} onSave={() => {}} onBack={backToLab} />;
      case 'synergy': return <TeamSynergy session={session} onBack={backToLab} />;
      case 'executive': return <ExecutiveSynergy session={session} onBack={backToLab} />;
      case 'tasks': return <TaskHub tasks={generalTasks} onUpdate={() => {}} onBack={backToLab} />;
      case 'feedback360': return <Feedback360 onBack={backToLab} />;
      case 'communication': return <CommunicationDNA onBack={backToLab} />;
      case 'about': return <About />;
      case 'clients': return <ClientsPage />;
      case 'article_detail': 
        if (!selectedArticle) { setView('articles'); return null; }
        return (
          <div className="max-w-4xl mx-auto py-24 md:py-32 px-6 animate-fadeIn text-right">
            <button onClick={() => setView('articles')} className="text-brand-muted font-black text-xs uppercase tracking-widest border-b-2 border-brand-dark mb-16 hover:text-brand-dark transition-all">← חזרה למאמרים</button>
            <div className="space-y-12">
               <div className="space-y-6">
                  <span className="text-[12px] font-black text-brand-accent uppercase tracking-[0.4em]">{selectedArticle.category}</span>
                  <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none">{selectedArticle.title}</h1>
                  {selectedArticle.subtitle && <p className="text-2xl md:text-3xl text-brand-muted font-bold italic">{selectedArticle.subtitle}</p>}
                  <div className="h-2 w-32 bg-brand-dark"></div>
               </div>
               <div className="text-2xl md:text-3xl text-brand-dark leading-relaxed font-medium whitespace-pre-line border-r-8 border-brand-beige pr-10">
                  {selectedArticle.content}
               </div>
               <div className="pt-20 border-t border-brand-dark/10">
                  <p className="text-sm font-black text-brand-muted uppercase tracking-widest">{selectedArticle.date} • Gilad Kilon Focus</p>
               </div>
            </div>
          </div>
        );
      case 'articles': return (
        <div className="max-w-5xl mx-auto py-32 px-6 space-y-24">
          <div className="space-y-6 text-right">
            <span className="text-[12px] font-black text-brand-accent uppercase tracking-[0.5em]">KNOWLEDGE HUB</span>
            <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none">חומרים<br/>מקצועיים.</h2>
            <div className="h-3 w-40 bg-brand-dark"></div>
          </div>

          <div className="flex flex-col">
            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                title={article.title} 
                subtitle={article.subtitle}
                category={article.category} 
                date={article.date} 
                onClick={() => {
                  setSelectedArticle(article);
                  setView('article_detail');
                }}
              />
            ))}
          </div>
        </div>
      );
      default: return <Landing onEnterTool={(v) => navigateToView(v as ViewType)} />;
    }
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <Header onNavigate={(v) => navigateToView(v as ViewType)} currentView={view} session={session} onLogout={() => setSession(null)} />
      <main className="w-full mx-auto">{renderView()}</main>
      <FloatingWhatsApp />
    </div>
  );
};

export default App;
