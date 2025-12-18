
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

// Helper function to check if firebase is ready
export const isFirebaseReady = () => !!db;

const normalizeId = (id: string) => id ? id.trim().toLowerCase() : "";

export const syncToCloud = async (collectionName: string, data: any) => {
  if (!db) {
    console.warn("Cloud Sync skipped: Database not initialized.");
    return;
  }
  try {
    const id = data.id || Math.random().toString(36).substr(2, 9);
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, { ...data, id, updatedAt: Date.now() }, { merge: true });
    console.log(`Cloud sync successful for ${collectionName}/${id}`);
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
    console.error(`Fetch error for ${collectionName}:`, e);
    return [];
  }
};

export const saveTeamPulse = async (teamId: string, data: any) => {
  if (!db) {
    console.error("Firebase not initialized - check your .env keys");
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
    return true;
  } catch (e) {
    console.error("Firestore Save Error:", e);
    return false;
  }
};

export const getTeamPulses = async (teamId: string) => {
  if (!db) return [];
  const tid = normalizeId(teamId);
  try {
    const q = query(collection(db, "team_pulses"), where("teamId", "==", tid));
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return results.sort((a: any, b: any) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error("Firestore Fetch Error:", e);
    return [];
  }
};
