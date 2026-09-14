import { doc, setDoc } from 'firebase/firestore';
import {
  connectStorageEmulator,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { db, firebaseApp } from './client';

const storage = getStorage(firebaseApp);

if (
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true'
) {
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}

function safeFileName(fileName) {
  return fileName.toLocaleLowerCase().replace(/[^a-z0-9._-]+/g, '-');
}

export async function uploadUserAvatar(userId, file) {
  const objectPath = `profile pictures/${userId}/${Date.now()}-${safeFileName(file.name)}`;
  const avatarRef = ref(storage, objectPath);
  await uploadBytes(avatarRef, file, { contentType: file.type });
  const avatarUrl = await getDownloadURL(avatarRef);

  await setDoc(doc(db, 'users', userId), { avatarUrl }, { merge: true });
  return avatarUrl;
}
