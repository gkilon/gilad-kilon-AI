
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;

export const isFirebaseReady = () => !!db;

const normalizeId = (id: string) => id ? id.trim().toLowerCase() : "";

// --- Workspace Management ---

export const createWorkspace = async (teamId: string, password: string) => {
  if (!db) return { success: false, error: "Database not connected" };
  const tid = normalizeId(teamId);
  try {
    const docRef = doc(db, "workspaces", tid);
    const existing = await getDoc(docRef);
    if (existing.exists()) return { success: false, error: "מרחב עבודה בשם זה כבר קיים" };
    
    await setDoc(docRef, {
      id: tid,
      password, // In a real production app we'd hash this, but for this demo/MVP it secures the session
      createdAt: Date.now()
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: "שגיאת שרת ביצירת מרחב" };
  }
};

export const loginToWorkspace = async (teamId: string, password: string) => {
  if (!db) return { success: false };
  const tid = normalizeId(teamId);
  try {
    const docRef = doc(db, "workspaces", tid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return { success: false, error: "מרחב עבודה לא נמצא" };
    if (snap.data().password !== password) return { success: false, error: "סיסמה שגויה" };
    return { success: true };
  } catch (e) {
    return { success: false, error: "שגיאת התחברות" };
  }
};

export const checkWorkspaceExists = async (teamId: string) => {
  if (!db) return false;
  const tid = normalizeId(teamId);
  const snap = await getDoc(doc(db, "workspaces", tid));
  return snap.exists();
};

// --- Data Operations (Scoped by Manager ID / Workspace) ---

export const syncToCloud = async (collectionName: string, data: any) => {
  if (!db || !data.managerId) return;
  try {
    const id = data.id || Math.random().toString(36).substr(2, 9);
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, { ...data, id, updatedAt: Date.now() }, { merge: true });
  } catch (e) {
    console.error("Cloud sync failed:", e);
  }
};

export const deleteFromCloud = async (collectionName: string, id: string) => {
  if (!db) return;
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (e) {
    console.error("Cloud delete failed:", e);
  }
};

export const fetchFromCloud = async (collectionName: string, managerId: string) => {
  if (!db) return [];
  const mid = normalizeId(managerId);
  try {
    const q = query(collection(db, collectionName), where("managerId", "==", mid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (e) {
    console.error(`Fetch error:`, e);
    return [];
  }
};

export const saveTeamPulse = async (teamId: string, data: any) => {
  if (!db) return false;
  const tid = normalizeId(teamId);
  // First verify workspace exists
  const exists = await checkWorkspaceExists(tid);
  if (!exists) return false;

  try {
    await addDoc(collection(db, "team_pulses"), {
      teamId: tid,
      ...data,
      timestamp: Date.now()
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const getTeamPulses = async (teamId: string) => {
  if (!db) return [];
  const tid = normalizeId(teamId);
  try {
    const q = query(collection(db, "team_pulses"), where("teamId", "==", tid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      .sort((a: any, b: any) => b.timestamp - a.timestamp);
  } catch (e) {
    return [];
  }
};
