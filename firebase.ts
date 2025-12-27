// Re-ordered and formatted imports to resolve potential module resolution issues with initializeApp
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  deleteDoc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined" && firebaseConfig.projectId !== "undefined";
const app = isConfigValid ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;

const isFirebaseReady = () => !!db;

const normalizeId = (id: string) => id ? id.trim().toLowerCase() : "";

const getLocal = (key: string) => JSON.parse(localStorage.getItem(`gk_mock_${key}`) || "[]");
const setLocal = (key: string, data: any) => localStorage.setItem(`gk_mock_${key}`, JSON.stringify(data));

const DEFAULT_METRICS = [
  { key: 'ownership', label: 'Ownership על היעדים', icon: '🎯' },
  { key: 'roleClarity', label: 'בהירות בתחומי אחריות', icon: '📋' },
  { key: 'routines', label: 'שגרות וסדר יום', icon: '🔄' },
  { key: 'trust', label: 'אמון וכבוד הדדי', icon: '✨' },
  { key: 'commitment', label: 'רמת מחויבות לצוות', icon: '🤝' },
  { key: 'openComm', label: 'תקשורת פתוחה וכנה', icon: '🗣️' }
];

const getSystemConfig = async () => {
  const defaultConfig = { 
    masterCode: "GILAD2025", 
    feedback360Url: "https://ubiquitous-nougat-41808d.netlify.app/",
    communicationDnaUrl: "https://hilarious-kashata-9aafa2.netlify.app/",
    metrics: DEFAULT_METRICS,
    articles: [],
    clients: [],
    collaborations: []
  };

  if (!db) {
    const local = localStorage.getItem('gk_mock_system_config');
    if (local) return { ...defaultConfig, ...JSON.parse(local) };
    return defaultConfig;
  }

  const docRef = doc(db, "system", "config");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    return {
      masterCode: data.masterCode || "GILAD2025",
      feedback360Url: data.feedback360Url || "https://ubiquitous-nougat-41808d.netlify.app/",
      communicationDnaUrl: data.communicationDnaUrl || "https://hilarious-kashata-9aafa2.netlify.app/",
      metrics: (data.metrics && data.metrics.length > 0) ? data.metrics : DEFAULT_METRICS,
      articles: data.articles || [],
      clients: data.clients || [],
      collaborations: data.collaborations || []
    };
  }
  return defaultConfig;
};

const updateSystemConfig = async (config: any) => {
  if (!db) {
    localStorage.setItem('gk_mock_system_config', JSON.stringify(config));
    return;
  }
  await setDoc(doc(db, "system", "config"), config, { merge: true });
};

const createWorkspace = async (teamId: string, password: string) => {
  const tid = normalizeId(teamId);
  if (!db) {
    const workspaces = getLocal('workspaces');
    if (workspaces.find((w: any) => w.id === tid)) return { success: false, error: "מרחב כבר קיים" };
    setLocal('workspaces', [...workspaces, { id: tid, password, createdAt: Date.now() }]);
    return { success: true };
  }
  const docRef = doc(db, "workspaces", tid);
  const existing = await getDoc(docRef);
  if (existing.exists()) return { success: false, error: "מרחב כבר קיים" };
  await setDoc(docRef, { id: tid, password, createdAt: Date.now() });
  return { success: true };
};

const loginToWorkspace = async (teamId: string, password: string) => {
  const tid = normalizeId(teamId);
  if (!db) {
    const workspaces = getLocal('workspaces');
    const ws = workspaces.find((w: any) => w.id === tid && w.password === password);
    if (ws) return { success: true };
    return { success: false, error: "פרטים שגויים" };
  }
  const docRef = doc(db, "workspaces", tid);
  const snap = await getDoc(docRef);
  if (snap.exists() && snap.data().password === password) return { success: true };
  return { success: false, error: "פרטים שגויים" };
};

const checkWorkspaceExists = async (teamId: string) => {
  const tid = normalizeId(teamId);
  if (!db) {
    const workspaces = getLocal('workspaces');
    return workspaces.some((w: any) => w.id === tid);
  }
  const snap = await getDoc(doc(db, "workspaces", tid));
  return snap.exists();
};

const syncToCloud = async (collectionName: string, data: any) => {
  if (!db) {
    const list = getLocal(collectionName);
    const id = data.id || Math.random().toString(36).substr(2, 9);
    const index = list.findIndex((item: any) => item.id === id);
    const newItem = { ...data, id, updatedAt: Date.now() };
    if (index > -1) list[index] = newItem;
    else list.push(newItem);
    setLocal(collectionName, list);
    return;
  }
  const id = data.id || Math.random().toString(36).substr(2, 9);
  await setDoc(doc(db, collectionName, id), { ...data, id, updatedAt: Date.now() }, { merge: true });
};

const fetchFromCloud = async (collectionName: string, managerId: string) => {
  const mid = normalizeId(managerId);
  if (!db) {
    const list = getLocal(collectionName);
    return list.filter((item: any) => normalizeId(item.managerId) === mid);
  }
  const q = query(collection(db, collectionName), where("managerId", "==", mid));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

const deleteFromCloud = async (collectionName: string, id: string) => {
  if (!db) {
    const list = getLocal(collectionName);
    setLocal(collectionName, list.filter((item: any) => item.id !== id));
    return;
  }
  await deleteDoc(doc(db, collectionName, id));
};

const saveTeamPulse = async (teamId: string, data: any) => {
  const tid = normalizeId(teamId);
  if (!db) {
    const pulses = getLocal('team_pulses');
    pulses.push({ teamId: tid, ...data, timestamp: Date.now() });
    setLocal('team_pulses', pulses);
    return true;
  }
  await addDoc(collection(db, "team_pulses"), { teamId: tid, ...data, timestamp: Date.now() });
  return true;
};

const getTeamPulses = async (teamId: string) => {
  const tid = normalizeId(teamId);
  if (!db) {
    const pulses = getLocal('team_pulses');
    return pulses.filter((p: any) => normalizeId(p.teamId) === tid).sort((a: any, b: any) => b.timestamp - a.timestamp);
  }
  const q = query(collection(db, "team_pulses"), where("teamId", "==", tid));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data()).sort((a: any, b: any) => b.timestamp - a.timestamp);
};

export {
  db,
  isFirebaseReady,
  DEFAULT_METRICS,
  getSystemConfig,
  updateSystemConfig,
  createWorkspace,
  loginToWorkspace,
  checkWorkspaceExists,
  syncToCloud,
  fetchFromCloud,
  deleteFromCloud,
  saveTeamPulse,
  getTeamPulses
};