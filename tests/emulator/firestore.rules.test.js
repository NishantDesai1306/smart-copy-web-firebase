import { readFile } from 'node:fs/promises';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

let environment;
beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'demo-smart-copy',
    firestore: {
      rules: await readFile('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});
beforeEach(async () => environment.clearFirestore());
afterAll(async () => environment.cleanup());

describe('Firestore ownership rules', () => {
  it('allows owners to create, read, update, and delete their snippets', async () => {
    const db = environment.authenticatedContext('owner').firestore();
    const created = await assertSucceeds(
      addDoc(collection(db, 'items'), {
        owner: 'owner',
        content: 'Legacy-compatible',
        isStarred: false,
      }),
    );
    await assertSucceeds(getDoc(created));
    await assertSucceeds(updateDoc(created, { content: 'Updated' }));
    await assertSucceeds(deleteDoc(created));
  });

  it('denies anonymous and cross-account reads and owner reassignment', async () => {
    const ownerDb = environment.authenticatedContext('owner').firestore();
    const otherDb = environment.authenticatedContext('other').firestore();
    const anonymousDb = environment.unauthenticatedContext().firestore();
    const ref = doc(ownerDb, 'items', 'private');
    await setDoc(ref, { owner: 'owner', content: 'Private legacy shape' });
    await assertFails(getDoc(doc(otherDb, 'items', 'private')));
    await assertFails(getDoc(doc(anonymousDb, 'items', 'private')));
    await assertFails(
      updateDoc(doc(otherDb, 'items', 'private'), { owner: 'other' }),
    );
  });

  it('allows users to access only their own profile', async () => {
    const ownerDb = environment.authenticatedContext('owner').firestore();
    const otherDb = environment.authenticatedContext('other').firestore();
    await assertSucceeds(
      setDoc(doc(ownerDb, 'users', 'owner'), {
        email: 'owner@example.com',
        username: 'Owner',
        profilePicture: 'legacy.jpg',
        themeMode: 'dark',
      }),
    );
    await assertFails(getDoc(doc(otherDb, 'users', 'owner')));
  });
});
