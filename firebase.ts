
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

// מנגנון שמירה מקומית כגיבוי (Fallback)
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
    console.error("Cloud sync failed, using local", e);
    saveLocal(`local_${collectionName}`, data);
  }
};

export const deleteFromCloud = async (collectionName: string, id: string) => {
  if (!db) return;
  await deleteDoc(doc(db, collectionName, id));
};

export const fetchFromCloud = async (collectionName: string, managerId: string) => {
  const localData = getLocal(`local_${collectionName}`);
  if (!db) return localData;
  try {
    const q = query(
      collection(db, collectionName),
      where("managerId", "==", managerId)
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
  const pulseData = {
    teamId,
    ...data,
    timestamp: Date.now()
  };
  
  // תמיד נשמור מקומית ליתר ביטחון
  saveLocal(`pulses_${teamId}`, pulseData);

  if (!db) return true; // החזרת true כדי שהממשק ימשיך כרגיל
  
  try {
    await addDoc(collection(db, "team_pulses"), pulseData);
    return true;
  } catch (e) {
    console.error("Cloud save failed, but saved locally", e);
    return true; // נחזיר אמת כי שמרנו מקומית
  }
};

export const getTeamPulses = async (teamId: string) => {
  const localData = getLocal(`pulses_${teamId}`);
  if (!db) return localData.sort((a: any, b: any) => b.timestamp - a.timestamp);
  
  try {
    const q = query(
      collection(db, "team_pulses"),
      where("teamId", "==", teamId)
    );
    const querySnapshot = await getDocs(q);
    const cloudResults = querySnapshot.docs.map(doc => doc.data());
    const combined = [...cloudResults, ...localData];
    // הסרת כפילויות אם קיימות (לפי timestamp)
    const unique = Array.from(new Map(combined.map(item => [item.timestamp, item])).values());
    return unique.sort((a: any, b: any) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error("Firestore error, showing local data only:", e);
    return localData.sort((a: any, b: any) => b.timestamp - a.timestamp);
  }
};
