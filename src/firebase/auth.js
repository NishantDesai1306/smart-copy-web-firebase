import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  linkWithCredential,
  linkWithPopup,
  linkWithRedirect,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updatePassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './client';
import { readStoredThemeMode } from '../utils/themeMode';

const providers = {
  google: () => new GoogleAuthProvider(),
  facebook: () => new FacebookAuthProvider(),
};

function shouldUseRedirect(error) {
  return [
    'auth/popup-blocked',
    'auth/operation-not-supported-in-this-environment',
  ].includes(error?.code);
}

async function withPopupOrRedirect(
  popupOperation,
  redirectOperation,
  returnTo,
) {
  try {
    return await popupOperation();
  } catch (error) {
    if (!shouldUseRedirect(error)) throw error;
    sessionStorage.setItem('smart-copy:return-to', returnTo);
    await redirectOperation();
    return null;
  }
}

export async function ensureUserProfile(user, username) {
  const profileRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) {
    await setDoc(profileRef, {
      email: user.email || '',
      username:
        username ||
        user.displayName ||
        user.email?.split('@')[0] ||
        'Smart Copy user',
      avatarUrl: user.photoURL || '',
      themeMode: readStoredThemeMode(),
    });
  }
}

export async function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function createAccount({ email, password, username }) {
  const result = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  await ensureUserProfile(result.user, username.trim());
  return result;
}

export async function signInWithSocialProvider(
  providerName,
  returnTo = '/dashboard',
) {
  const providerFactory = providers[providerName];
  if (!providerFactory) throw new Error('Unsupported sign-in provider.');

  const provider = providerFactory();

  const result = await withPopupOrRedirect(
    () => signInWithPopup(auth, provider),
    () => signInWithRedirect(auth, provider),
    returnTo,
  );
  if (result?.user) await ensureUserProfile(result.user);
  return result;
}

export async function finishRedirectSignIn() {
  const result = await getRedirectResult(auth);
  if (result?.user) await ensureUserProfile(result.user);
  return result;
}

export function consumeAuthReturnPath(defaultPath = '/dashboard') {
  const path = sessionStorage.getItem('smart-copy:return-to') || defaultPath;
  sessionStorage.removeItem('smart-copy:return-to');
  return path;
}

export async function requestPasswordReset(email) {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function logOut() {
  await signOut(auth);
}

export async function changePassword({ currentPassword, newPassword }) {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in again before changing your password.');

  const providerIds = user.providerData.map(({ providerId }) => providerId);
  const hasPassword = providerIds.includes('password');

  if (hasPassword) {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return;
  }

  const provider = providerIds.includes('google.com')
    ? new GoogleAuthProvider()
    : new FacebookAuthProvider();

  try {
    await reauthenticateWithPopup(user, provider);
  } catch (error) {
    if (shouldUseRedirect(error)) {
      const blocked = new Error(
        'Allow popups to confirm your identity, then try again.',
      );
      blocked.code = 'auth/popup-blocked';
      throw blocked;
    }
    throw error;
  }

  const credential = EmailAuthProvider.credential(user.email, newPassword);
  await linkWithCredential(user, credential);
}

export async function linkSocialProvider(
  providerName,
  returnTo = '/dashboard/profile?tab=security',
) {
  const user = auth.currentUser;
  const providerFactory = providers[providerName];
  if (!user || !providerFactory)
    throw new Error('Sign in again before linking an account.');

  const provider = providerFactory();
  return withPopupOrRedirect(
    () => linkWithPopup(user, provider),
    () => linkWithRedirect(user, provider),
    returnTo,
  );
}
