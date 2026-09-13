import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './client';

function safeFileName(fileName) {
  return fileName.toLocaleLowerCase().replace(/[^a-z0-9._-]+/g, '-');
}

export async function updateUserProfile(userId, profile) {
  await setDoc(
    doc(db, 'users', userId),
    {
      username: profile.username.trim(),
    },
    { merge: true },
  );
}

export async function updateThemeMode(userId, themeMode) {
  await setDoc(doc(db, 'users', userId), { themeMode }, { merge: true });
}

export async function uploadUserAvatar(userId, file) {
  const objectPath = `profile pictures/${userId}/${Date.now()}-${safeFileName(file.name)}`;
  const avatarRef = ref(storage, objectPath);
  await uploadBytes(avatarRef, file, { contentType: file.type });
  const avatarUrl = await getDownloadURL(avatarRef);

  await setDoc(doc(db, 'users', userId), { avatarUrl }, { merge: true });
  return avatarUrl;
}
