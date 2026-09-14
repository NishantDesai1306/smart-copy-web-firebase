import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ensureUserProfile } from './auth';

const mocks = vi.hoisted(() => ({
  profileRef: { path: 'users/user-one' },
  transaction: {
    get: vi.fn(),
    set: vi.fn(),
  },
  runTransaction: vi.fn(),
  readStoredThemeMode: vi.fn(() => 'dark'),
}));

vi.mock('firebase/auth', () => ({
  EmailAuthProvider: { credential: vi.fn() },
  FacebookAuthProvider: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  getRedirectResult: vi.fn(),
  linkWithCredential: vi.fn(),
  linkWithPopup: vi.fn(),
  linkWithRedirect: vi.fn(),
  reauthenticateWithCredential: vi.fn(),
  reauthenticateWithPopup: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  signOut: vi.fn(),
  updatePassword: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => mocks.profileRef),
  runTransaction: (...args) => mocks.runTransaction(...args),
}));

vi.mock('./client', () => ({
  auth: {},
  db: {},
}));

vi.mock('../utils/themeMode', () => ({
  readStoredThemeMode: (...args) => mocks.readStoredThemeMode(...args),
}));

const user = {
  uid: 'user-one',
  email: 'review-user@example.com',
  displayName: 'Provider Name',
  photoURL: 'https://example.com/avatar.png',
};

describe('ensureUserProfile', () => {
  beforeEach(() => {
    mocks.transaction.get.mockReset();
    mocks.transaction.set.mockReset();
    mocks.runTransaction.mockReset();
    mocks.readStoredThemeMode.mockClear();
    mocks.runTransaction.mockImplementation((_, update) =>
      update(mocks.transaction),
    );
  });

  it('creates a canonical profile when none exists', async () => {
    mocks.transaction.get.mockResolvedValue({ exists: () => false });

    await ensureUserProfile(user, '  Chosen Name  ');

    expect(mocks.transaction.set).toHaveBeenCalledWith(mocks.profileRef, {
      email: user.email,
      username: 'Chosen Name',
      avatarUrl: user.photoURL,
      themeMode: 'dark',
    });
  });

  it('merges the submitted name if the auth listener created a fallback first', async () => {
    mocks.transaction.get.mockResolvedValue({ exists: () => true });

    await ensureUserProfile(user, '  Chosen Name  ');

    expect(mocks.transaction.set).toHaveBeenCalledWith(
      mocks.profileRef,
      { username: 'Chosen Name' },
      { merge: true },
    );
  });

  it('does not rewrite an existing profile during ordinary session restoration', async () => {
    mocks.transaction.get.mockResolvedValue({ exists: () => true });

    await ensureUserProfile(user);

    expect(mocks.transaction.set).not.toHaveBeenCalled();
  });
});
