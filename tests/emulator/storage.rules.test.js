import { deleteApp, initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
} from 'firebase/auth';
import {
  connectStorageEmulator,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const apps = [];

async function authenticatedStorage(label) {
  const app = initializeApp(
    {
      apiKey: 'demo-key',
      projectId: 'demo-smart-copy',
      storageBucket: 'demo-smart-copy.appspot.com',
    },
    label,
  );
  apps.push(app);
  const auth = getAuth(app);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  const result = await createUserWithEmailAndPassword(
    auth,
    `${label}@example.com`,
    'secret123',
  );
  const storage = getStorage(app);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  return { storage, user: result.user };
}

let owner;
let other;
beforeAll(async () => {
  owner = await authenticatedStorage('storage-owner');
  other = await authenticatedStorage('storage-other');
});
afterAll(async () => Promise.all(apps.map((app) => deleteApp(app))));

describe('Storage ownership rules', () => {
  it('allows an image upload below the UID-scoped path', async () => {
    const image = new Uint8Array([137, 80, 78, 71]);
    await expect(
      uploadBytes(
        ref(owner.storage, `profile pictures/${owner.user.uid}/avatar.png`),
        image,
        { contentType: 'image/png' },
      ),
    ).resolves.toBeTruthy();
  });

  it('denies writes to another user and legacy flat paths', async () => {
    const image = new Uint8Array([137, 80, 78, 71]);
    await expect(
      uploadBytes(
        ref(other.storage, `profile pictures/${owner.user.uid}/intruder.png`),
        image,
        { contentType: 'image/png' },
      ),
    ).rejects.toBeTruthy();
    await expect(
      uploadBytes(ref(owner.storage, 'profile pictures/legacy.png'), image, {
        contentType: 'image/png',
      }),
    ).rejects.toBeTruthy();
  });

  it('denies non-image uploads', async () => {
    await expect(
      uploadBytes(
        ref(owner.storage, `profile pictures/${owner.user.uid}/notes.txt`),
        new TextEncoder().encode('not an image'),
        { contentType: 'text/plain' },
      ),
    ).rejects.toBeTruthy();
  });
});
