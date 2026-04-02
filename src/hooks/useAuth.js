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
        const quickRole = isAdminEmail ? 'admin' : 'customer';

        // Rolü ve loading'i hemen set et — redirect beklemeden çalışsın
        setUserRole(quickRole);
        setLoading(false);

        // Firestore senkronizasyonu arka planda
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
              role: quickRole,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            });
          } else {
            const firestoreRole = snap.data().role || 'customer';
            // Admin email değilse Firestore'daki rolü kullan (başka admin tarafından yetkilendirilmiş olabilir)
            if (!isAdminEmail && firestoreRole !== quickRole) setUserRole(firestoreRole);
            await setDoc(userRef, { lastLogin: serverTimestamp(), role: isAdminEmail ? 'admin' : firestoreRole }, { merge: true });
          }
        } catch { /* ignore */ }
      } else {
        clearAuth();
      }
    });
    return unsubscribe;
  }, [setUser, setUserRole, setLoading, clearAuth]);
}

export default useAuthStore;
