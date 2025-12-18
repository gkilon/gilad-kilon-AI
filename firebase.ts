
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, doc, deleteDoc, updateDoc, setDoc } from "firebase/firestore";

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
  const q = query(
    collection(db, collectionName),
    where("managerId", "==", managerId),
    orderBy("updatedAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const saveTeamPulse = async (teamId: string, data: any) => {
  if (!db) return null;
  return await addDoc(collection(db, "team_pulses"), {
    teamId,
    ...data,
    timestamp: Date.now()
  });
};

export const getTeamPulses = async (teamId: string) => {
  if (!db) return [];
  try {
    const q = query(
      collection(db, "team_pulses"),
      where("teamId", "==", teamId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (e) {
    console.error("Firestore error:", e);
    return [];
  }
};
