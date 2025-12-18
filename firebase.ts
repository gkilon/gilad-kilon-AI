
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

if (!firebaseConfig.apiKey) {
  console.warn("Firebase API Key is missing. Cloud features will not work.");
}

const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;

// פונקציה לבדיקת חיבור
export const isFirebaseReady = () => !!db;

const normalizeId = (id: string) => id ? id.trim().toLowerCase() : "";

export const syncToCloud = async (collectionName: string, data: any) => {
  if (!db) return;
  try {
    const docRef = doc(collection(db, collectionName), data.id || Math.random().toString(36).substr(2, 9));
    await setDoc(docRef, { ...data, updatedAt: Date.now() }, { merge: true });
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
    console.error("Fetch error:", e);
    return [];
  }
};

export const saveTeamPulse = async (teamId: string, data: any) => {
  if (!db) {
    console.error("Firebase not initialized - check your environment variables");
    return false;
  }
  const tid = normalizeId(teamId);
  if (!tid) return false;

  try {
    const pulseData = {
      teamId: tid,
      ...data,
      timestamp: Date.now(),
      serverTimestamp: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "team_pulses"), pulseData);
    console.log("Success: Pulse saved with ID:", docRef.id);
    return true;
  } catch (e) {
    console.error("Firestore Save Error:", e);
    return false;
  }
};

export const getTeamPulses = async (teamId: string) => {
  if (!db) return [];
  const tid = normalizeId(teamId);
  if (!tid) return [];

  try {
    const q = query(
      collection(db, "team_pulses"),
      where("teamId", "==", tid)
    );
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    console.log(`Fetched ${results.length} results for team: ${tid}`);
    return results.sort((a: any, b: any) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error("Firestore Fetch Error:", e);
    return [];
  }
};
