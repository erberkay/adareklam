import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import useAuthStore from '../store/useAuthStore';

export function useAuthListener() {
  const { setUser, setUserRole, setLoading, clearAuth } = useAuthStore();
  const roleUnsubRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Önceki rol dinleyicisini temizle
      if (roleUnsubRef.current) { roleUnsubRef.current(); roleUnsubRef.current = null; }

      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(db, 'users', firebaseUser.uid);

        // Kullanıcı dokümanı yoksa oluştur
        try {
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
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
          } else {
            await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
          }
        } catch { /* ignore */ }

        // Rolü canlı dinle — Firestore'da değişince anında güncellenir
        roleUnsubRef.current = onSnapshot(
          userRef,
          (snap) => {
            setUserRole(snap.exists() ? (snap.data().role || 'customer') : 'customer');
            setLoading(false);
          },
          () => { setUserRole('customer'); setLoading(false); }
        );
      } else {
        clearAuth();
      }
    });
    return () => {
      unsubscribe();
      if (roleUnsubRef.current) roleUnsubRef.current();
    };
  }, [setUser, setUserRole, setLoading, clearAuth]);
}

export default useAuthStore;
