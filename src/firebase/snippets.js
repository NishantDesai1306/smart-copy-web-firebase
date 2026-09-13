import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './client';
import { normalizeSnippet, sortSnippets } from '../utils/data';

export function subscribeToSnippets(userId, onData, onError) {
  const snippetsQuery = query(
    collection(db, 'items'),
    where('owner', '==', userId),
  );

  return onSnapshot(
    snippetsQuery,
    (snapshot) => {
      const snippets = snapshot.docs.map((item) =>
        normalizeSnippet(item.id, item.data()),
      );
      onData(sortSnippets(snippets));
    },
    onError,
  );
}

export async function addSnippet(userId, content) {
  return addDoc(collection(db, 'items'), {
    owner: userId,
    content: content.trim(),
    isStarred: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateSnippet(snippetId, content) {
  await updateDoc(doc(db, 'items', snippetId), {
    content: content.trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function setSnippetStarred(snippetId, isStarred) {
  await updateDoc(doc(db, 'items', snippetId), {
    isStarred,
    updatedAt: serverTimestamp(),
  });
}

export async function removeSnippet(snippetId) {
  await deleteDoc(doc(db, 'items', snippetId));
}
