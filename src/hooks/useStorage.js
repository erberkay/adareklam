import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

// Client-side image compression using Canvas API
async function compressImage(file, maxWidth = 1920) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) { resolve(file); return; }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width <= maxWidth) { resolve(file); return; }
      const scale = maxWidth / img.width;
      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.85);
    };
    img.src = url;
  });
}

export function useUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const upload = async (file, path) => {
    setUploading(true);
    setProgress(0);
    const compressed = await compressImage(file);
    const storageRef = ref(storage, `${path}/${Date.now()}_${compressed.name}`);
    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, compressed);
      task.on('state_changed',
        (snap) => setProgress((snap.bytesTransferred / snap.totalBytes) * 100),
        (err) => { setUploading(false); reject(err); },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          setUploading(false);
          setProgress(100);
          resolve(url);
        }
      );
    });
  };

  const deleteFile = async (url) => {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  };

  return { upload, deleteFile, progress, uploading };
}
