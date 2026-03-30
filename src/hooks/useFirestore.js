import { useState, useEffect } from 'react';
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

export function useCollection(collectionName, queryConstraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return;
    setLoading(true);
    const ref = collection(db, collectionName);
    const q = queryConstraints.length ? query(ref, ...queryConstraints) : ref;
    const unsub = onSnapshot(q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => { setError(err); setLoading(false); }
    );
    return unsub;
  }, [collectionName]);

  return { data, loading, error };
}

export function useDocument(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionName || !docId) return;
    const unsub = onSnapshot(doc(db, collectionName, docId),
      (snap) => {
        setData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setLoading(false);
      }
    );
    return unsub;
  }, [collectionName, docId]);

  return { data, loading };
}

export async function addDocument(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDocument(collectionName, docId, data) {
  await updateDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName, docId) {
  await deleteDoc(doc(db, collectionName, docId));
}

export { where, orderBy, limit, serverTimestamp };
