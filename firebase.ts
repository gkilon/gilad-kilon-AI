// Standard modular import for initializeApp from firebase/app
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
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
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined" && firebaseConfig.projectId !== "undefined";
const app = isConfigValid ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

const subscribeToAdminAuth = (callback: (isAdmin: boolean) => void) => {
  if (!auth) { callback(false); return () => {}; }
  return onAuthStateChanged(auth, async (user) => {
    if (!user) { callback(false); return; }
    try {
      const token = await user.getIdTokenResult();
      callback(token.claims.admin === true);
    } catch {
      callback(false);
    }
  });
};

const signOutAdmin = async () => {
  if (auth) await signOut(auth);
};

const signInAdmin = async (email: string, password: string) => {
  if (!auth) return { success: false, error: "Firebase לא מוגדר" };
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const token = await credential.user.getIdTokenResult(true);
    if (token.claims.admin !== true) {
      await signOut(auth);
      return { success: false, error: "לחשבון זה אין הרשאת מנהל" };
    }
    return { success: true, uid: credential.user.uid };
  } catch {
    return { success: false, error: "פרטי התחברות שגויים או שחשבון המנהל לא הוגדר" };
  }
};

const isFirebaseReady = () => !!db;

const normalizeId = (id: string) => id ? id.trim().toLowerCase() : "";

// Removed localStorage fallback - using Firebase only

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
    communicationDnaUrl: "https://communication.kilon-consulting.com/",
    metrics: DEFAULT_METRICS,
    articles: [],
    clients: [],
    collaborations: []
  };

  if (!db) {
    console.error('Firebase not configured');
    return defaultConfig;
  }

  const docRef = doc(db, "system", "config");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const data = snap.data();
    return {
      masterCode: data.masterCode || "GILAD2025",
      feedback360Url: data.feedback360Url || "https://ubiquitous-nougat-41808d.netlify.app/",
      communicationDnaUrl: data.communicationDnaUrl || "https://communication.kilon-consulting.com/",
      metrics: (data.metrics && data.metrics.length > 0) ? data.metrics : DEFAULT_METRICS,
      articles: data.articles || [],
      clients: data.clients || [],
      collaborations: data.collaborations || []
    };
  }
  return defaultConfig;
};

const updateSystemConfig = async (config: any) => {
  if (!db || !auth || !auth.currentUser) {
    throw new Error('נדרשת התחברות מנהל כדי לשמור שינויים');
  }

  // Defense in depth: the UI route is not an authorization boundary.
  // Firestore Security Rules must independently enforce the admin claim too.
  const token = await auth.currentUser.getIdTokenResult(true);
  if (token.claims.admin !== true) {
    throw new Error('אין הרשאת מנהל לשמירת שינויים');
  }

  await setDoc(doc(db, "system", "config"), config, { merge: true });
};

const createWorkspace = async (teamId: string, password: string) => {
  const tid = normalizeId(teamId);
  if (!db) {
    console.error('Firebase not configured');
    return { success: false, error: "Firebase not configured" };
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
    console.error('Firebase not configured');
    return { success: false, error: "Firebase not configured" };
  }
  const docRef = doc(db, "workspaces", tid);
  const snap = await getDoc(docRef);
  if (snap.exists() && snap.data().password === password) return { success: true };
  return { success: false, error: "פרטים שגויים" };
};

const checkWorkspaceExists = async (teamId: string) => {
  const tid = normalizeId(teamId);
  if (!db) {
    console.error('Firebase not configured');
    return false;
  }
  const snap = await getDoc(doc(db, "workspaces", tid));
  return snap.exists();
};

const syncToCloud = async (collectionName: string, data: any) => {
  if (!db) {
    console.error('Firebase not configured');
    return;
  }
  const id = data.id || Math.random().toString(36).substr(2, 9);
  await setDoc(doc(db, collectionName, id), { ...data, id, updatedAt: Date.now() }, { merge: true });
};

const fetchFromCloud = async (collectionName: string, managerId: string) => {
  const mid = normalizeId(managerId);
  if (!db) {
    console.error('Firebase not configured');
    return [];
  }
  const q = query(collection(db, collectionName), where("managerId", "==", mid));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

const deleteFromCloud = async (collectionName: string, id: string) => {
  if (!db) {
    console.error('Firebase not configured');
    return;
  }
  await deleteDoc(doc(db, collectionName, id));
};

const saveTeamPulse = async (teamId: string, data: any) => {
  const tid = normalizeId(teamId);
  if (!db) {
    console.error('Firebase not configured');
    return false;
  }
  await addDoc(collection(db, "team_pulses"), { teamId: tid, ...data, timestamp: Date.now() });
  return true;
};

const getTeamPulses = async (teamId: string) => {
  const tid = normalizeId(teamId);
  if (!db) {
    console.error('Firebase not configured');
    return [];
  }
  const q = query(collection(db, "team_pulses"), where("teamId", "==", tid));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data()).sort((a: any, b: any) => b.timestamp - a.timestamp);
};

export {
  db,
  auth,
  signInAdmin,
  signOutAdmin,
  subscribeToAdminAuth,
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