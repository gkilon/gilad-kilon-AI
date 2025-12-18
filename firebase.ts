
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
  getDoc,
  Firestore
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// וודא שהקונפיגורציה קיימת לפני האתחול
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

const app = isConfigValid ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;

export const isFirebaseReady = () => !!db;

const normalizeId = (id: string) => id ? id.trim().toLowerCase() : "";

/**
 * פונקציה לבדיקת תקינות מסד הנתונים לפני פעולה
 */
const ensureDb = (): Firestore => {
  if (!db) throw new Error("Firebase is not initialized. Check your environment variables.");
  return db;
};

// --- Workspace Management (Pure Firestore) ---

export const createWorkspace = async (teamId: string, password: string) => {
  const tid = normalizeId(teamId);
  const database = ensureDb();
  
  try {
    const docRef = doc(database, "workspaces", tid);
    const existing = await getDoc(docRef);
    if (existing.exists()) return { success: false, error: "מרחב עבודה בשם זה כבר קיים במערכת" };
    
    await setDoc(docRef, { 
      id: tid, 
      password, 
      createdAt: Date.now(),
      status: 'active'
    });
    return { success: true };
  } catch (e: any) {
    console.error("Firestore Error:", e);
    return { success: false, error: `שגיאת תקשורת: ${e.message}` };
  }
};

export const loginToWorkspace = async (teamId: string, password: string) => {
  const tid = normalizeId(teamId);
  const database = ensureDb();

  try {
    const docRef = doc(database, "workspaces", tid);
    const snap = await getDoc(docRef);
    
    if (!snap.exists()) return { success: false, error: "מרחב עבודה לא נמצא" };
    
    if (snap.data().password === password) {
      return { success: true };
    }
    return { success: false, error: "סיסמה שגויה" };
  } catch (e: any) {
    return { success: false, error: "בעיית גישה למסד הנתונים" };
  }
};

export const checkWorkspaceExists = async (teamId: string) => {
  const tid = normalizeId(teamId);
  if (!db) return false;
  try {
    const snap = await getDoc(doc(db, "workspaces", tid));
    return snap.exists();
  } catch (e) {
    return false;
  }
};

// --- Data Operations (Strict Firestore) ---

export const syncToCloud = async (collectionName: string, data: any) => {
  const database = ensureDb();
  if (!data.managerId) throw new Error("managerId (teamId) is required for syncing data");

  const id = data.id || Math.random().toString(36).substr(2, 9);
  const dataToSave = { ...data, id, updatedAt: Date.now() };

  try {
    await setDoc(doc(database, collectionName, id), dataToSave, { merge: true });
  } catch (e) {
    console.error(`Sync error for ${collectionName}:`, e);
    throw e;
  }
};

export const fetchFromCloud = async (collectionName: string, managerId: string) => {
  const database = ensureDb();
  const mid = normalizeId(managerId);

  try {
    const q = query(collection(database, collectionName), where("managerId", "==", mid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (e) {
    console.error(`Fetch error for ${collectionName}:`, e);
    return [];
  }
};

export const deleteFromCloud = async (collectionName: string, id: string) => {
  const database = ensureDb();
  try {
    await deleteDoc(doc(database, collectionName, id));
  } catch (e) {
    console.error("Firebase delete error", e);
    throw e;
  }
};

export const saveTeamPulse = async (teamId: string, data: any) => {
  const database = ensureDb();
  const tid = normalizeId(teamId);
  
  // וידוא קיום מרחב לפני כתיבה
  const exists = await checkWorkspaceExists(tid);
  if (!exists) throw new Error("Workspace does not exist");

  const pulseData = { 
    teamId: tid, 
    ...data, 
    timestamp: Date.now() 
  };

  try {
    await addDoc(collection(database, "team_pulses"), pulseData);
    return true;
  } catch (e) {
    console.error("Pulse save error:", e);
    return false;
  }
};

export const getTeamPulses = async (teamId: string) => {
  const database = ensureDb();
  const tid = normalizeId(teamId);
  
  try {
    const q = query(collection(database, "team_pulses"), where("teamId", "==", tid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      .sort((a: any, b: any) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error("Fetch pulses error:", e);
    return [];
  }
};
