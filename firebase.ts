
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

export const syncToCloud = async (collectionName: string, data: any) => {
  if (!db) return;
  const docRef = doc(collection(db, collectionName), data.id || Math.random().toString(36).substr(2, 9));
  await setDoc(docRef, { ...data, updatedAt: Date.now() }, { merge: true });
};

export const deleteFromCloud = async (collectionName: string, id: string) => {
  if (!db) return;
  await deleteDoc(doc(db, collectionName, id));
};

export const fetchFromCloud = async (collectionName: string, managerId: string) => {
  if (!db) return [];
  try {
    const q = query(
      collection(db, collectionName),
      where("managerId", "==", managerId)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    // מיון בזיכרון כדי למנוע שגיאות אינדקס ב-Firestore
    return data.sort((a: any, b: any) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } catch (e) {
    console.error("Fetch error:", e);
    return [];
  }
};

export const saveTeamPulse = async (teamId: string, data: any) => {
  if (!db) return null;
  try {
    return await addDoc(collection(db, "team_pulses"), {
      teamId,
      ...data,
      timestamp: Date.now()
    });
  } catch (e) {
    console.error("Save error:", e);
    return null;
  }
};

export const getTeamPulses = async (teamId: string) => {
  if (!db) return [];
  try {
    const q = query(
      collection(db, "team_pulses"),
      where("teamId", "==", teamId)
    );
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => doc.data());
    // מיון בזיכרון ללא צורך באינדקס מורכב
    return results.sort((a: any, b: any) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error("Firestore error:", e);
    return [];
  }
};
