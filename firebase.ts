
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";

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

// פונקציית עזר לנורמליזציה של מזהים
const normalizeId = (id: string) => id.trim().toLowerCase();

const saveLocal = (key: string, data: any) => {
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push(data);
  localStorage.setItem(key, JSON.stringify(existing));
};

const getLocal = (key: string) => {
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const syncToCloud = async (collectionName: string, data: any) => {
  if (!db) {
    saveLocal(`local_${collectionName}`, { ...data, updatedAt: Date.now() });
    return;
  }
  try {
    const docRef = doc(collection(db, collectionName), data.id || Math.random().toString(36).substr(2, 9));
    await setDoc(docRef, { ...data, updatedAt: Date.now() }, { merge: true });
  } catch (e) {
    console.error("Cloud sync failed", e);
    saveLocal(`local_${collectionName}`, data);
  }
};

// Added deleteFromCloud to fix the "Module './firebase' has no exported member 'deleteFromCloud'" error in App.tsx
export const deleteFromCloud = async (collectionName: string, id: string) => {
  if (!db) {
    const localKey = `local_${collectionName}`;
    const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
    const updated = existing.filter((item: any) => item.id !== id);
    localStorage.setItem(localKey, JSON.stringify(updated));
    return;
  }
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (e) {
    console.error("Cloud delete failed", e);
  }
};

export const fetchFromCloud = async (collectionName: string, managerId: string) => {
  const mid = normalizeId(managerId);
  const localData = getLocal(`local_${collectionName}`);
  if (!db) return localData;
  try {
    const q = query(
      collection(db, collectionName),
      where("managerId", "==", mid)
    );
    const querySnapshot = await getDocs(q);
    const cloudData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const combined = [...cloudData, ...localData];
    return combined.sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } catch (e) {
    console.error("Fetch error:", e);
    return localData;
  }
};

export const saveTeamPulse = async (teamId: string, data: any) => {
  const tid = normalizeId(teamId);
  const pulseData = {
    teamId: tid,
    ...data,
    timestamp: Date.now()
  };
  
  saveLocal(`pulses_${tid}`, pulseData);

  if (!db) return true;
  
  try {
    await addDoc(collection(db, "team_pulses"), pulseData);
    return true;
  } catch (e) {
    console.error("Cloud save failed", e);
    return true; 
  }
};

export const getTeamPulses = async (teamId: string) => {
  const tid = normalizeId(teamId);
  const localData = getLocal(`pulses_${tid}`);
  if (!db) return localData.sort((a: any, b: any) => b.timestamp - a.timestamp);
  
  try {
    const q = query(
      collection(db, "team_pulses"),
      where("teamId", "==", tid)
    );
    const querySnapshot = await getDocs(q);
    const cloudResults = querySnapshot.docs.map(doc => doc.data());
    
    // שילוב וניקוי כפילויות מבוסס זמן
    const combined = [...cloudResults, ...localData];
    const unique = Array.from(new Map(combined.map(item => [item.timestamp, item])).values());
    
    return unique.sort((a: any, b: any) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error("Firestore error:", e);
    return localData.sort((a: any, b: any) => b.timestamp - a.timestamp);
  }
};
