import { doc, setDoc } from 'firebase/firestore';
import { db } from './client';

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
