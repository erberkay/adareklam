import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import useAuthStore from '../store/useAuthStore';

export function useAuthListener() {
  const { setUser, setUserRole, setLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserRole(userSnap.data().role || 'customer');
            await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
          } else {
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              phone: '',
              role: 'customer',
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            });
            setUserRole('customer');
          }
        } catch {
          setUserRole('customer');
        }
        setLoading(false);
      } else {
        clearAuth();
      }
    });
    return unsubscribe;
  }, [setUser, setUserRole, setLoading, clearAuth]);
}

export default useAuthStore;
