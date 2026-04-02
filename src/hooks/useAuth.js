import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import useAuthStore from '../store/useAuthStore';

// Bu mailler her zaman admin sayılır — Firestore rules engelleyemez
const ADMIN_EMAILS = ['berkayer032@gmail.com', 'adasosyal09@gmail.com'];

export function useAuthListener() {
  const { setUser, setUserRole, setLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const isAdminEmail = ADMIN_EMAILS.includes(firebaseUser.email);

        // Önce email listesinden rolü kesin belirle
        let role = isAdminEmail ? 'admin' : 'customer';

        // Firestore'dan okumayı dene; başarılı olursa admin-email-olmayan kullanıcılar için Firestore'daki rol geçerli
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              phone: '',
              role,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            });
          } else {
            if (!isAdminEmail) role = snap.data().role || 'customer';
            await setDoc(userRef, { lastLogin: serverTimestamp(), role }, { merge: true });
          }
        } catch { /* Firestore erişilemese bile email listesi geçerli */ }

        setUserRole(role);
        setLoading(false);
      } else {
        clearAuth();
      }
    });
    return unsubscribe;
  }, [setUser, setUserRole, setLoading, clearAuth]);
}

export default useAuthStore;
