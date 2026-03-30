import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import useSiteSettingsStore from '../store/useSiteSettingsStore';

export function useSiteSettingsListener() {
  const { setSettings } = useSiteSettingsStore();

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'siteSettings', 'config'),
      (snap) => { if (snap.exists()) setSettings(snap.data()); },
      (err) => { console.warn('siteSettings:', err.message); }
    );
    return unsub;
  }, [setSettings]);
}

export default useSiteSettingsStore;
