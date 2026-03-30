import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase projenizin ayarlarını buraya girin
// Firebase Console > Project Settings > Your Apps > SDK setup
const firebaseConfig = {
  apiKey: "AIzaSyAGR3cRVYJFTdulcxhDN0rps2s6Tx4eo9U",
  authDomain: "adareklam-312f4.firebaseapp.com",
  projectId: "adareklam-312f4",
  storageBucket: "adareklam-312f4.firebasestorage.app",
  messagingSenderId: "164134482960",
  appId: "1:164134482960:web:e89f996f07dc93d9e50695",
  measurementId: "G-S135Q4X320",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
