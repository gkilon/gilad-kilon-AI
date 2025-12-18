
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, deleteDoc, setDoc, enableIndexedDbPersistence, onSnapshot } from "firebase/firestore";

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

// פונקציה לבדיקת חיבור
export const isFirebaseReady = () => !!db;

const normalizeId = (id: string) => id.trim().toLowerCase();

export const syncToCloud = async (collectionName: string, data: any) => {
  if (!db) return;
  try {
    const docRef = doc(collection(db, collectionName), data.id || Math.random().toString(36).substr(2, 9));
    await setDoc(docRef, { ...data, updatedAt: Date.now() }, { merge: true });
  } catch (e) {
    console.error("Cloud sync failed", e);
  }
};

export const deleteFromCloud = async (collectionName: string, id: string) => {
  if (!db) return;
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (e) {
    console.error("Cloud delete failed", e);
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
    console.error("Firebase not initialized");
    return false;
  }
  const tid = normalizeId(teamId);
  try {
    const pulseData = {
      teamId: tid,
      ...data,
      timestamp: Date.now(),
      serverTimestamp: new Date().toISOString()
    };
    await addDoc(collection(db, "team_pulses"), pulseData);
    console.log("Data saved to cloud for team:", tid);
    return true;
  } catch (e) {
    console.error("Error saving to Firestore:", e);
    return false;
  }
};

export const getTeamPulses = async (teamId: string) => {
  if (!db) return [];
  const tid = normalizeId(teamId);
  try {
    const q = query(
      collection(db, "team_pulses"),
      where("teamId", "==", tid)
    );
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return results.sort((a: any, b: any) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error("Error fetching from Firestore:", e);
    return [];
  }
};
