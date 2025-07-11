import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Replace with your actual Firebase config
 apiKey: "AIzaSyCACMfK-YldL7AWxZwmEnKa9tbIpSrUeK4",
  authDomain: "civil-8581d.firebaseapp.com",
  projectId: "civil-8581d",
  storageBucket: "civil-8581d.firebasestorage.app",
  messagingSenderId: "591162163505",
  appId: "1:591162163505:web:58ffab3aac3fff5b90b010",
  measurementId: "G-YKS4GKFLSL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;