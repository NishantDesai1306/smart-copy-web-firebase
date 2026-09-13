import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/client';
import {
  consumeAuthReturnPath,
  ensureUserProfile,
  finishRedirectSignIn,
} from '../firebase/auth';
import { normalizeProfile } from '../utils/data';
import { getErrorMessage } from '../utils/errors';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    profile: null,
    loading: true,
    error: '',
    redirectPath: '',
  });

  useEffect(() => {
    let unsubscribeAuth = () => {};
    let unsubscribeProfile = () => {};
    let cancelled = false;

    async function startAuthListener() {
      let redirectPath = '';

      try {
        const redirectResult = await finishRedirectSignIn();
        if (redirectResult?.user) redirectPath = consumeAuthReturnPath();
      } catch (error) {
        if (!cancelled) {
          setState((current) => ({
            ...current,
            error: getErrorMessage(
              error,
              'Sign-in could not be completed. Try again.',
            ),
          }));
        }
      }

      if (cancelled) return;

      unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        unsubscribeProfile();

        if (!user) {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: '',
            redirectPath,
          });
          return;
        }

        setState((current) => ({
          ...current,
          user,
          loading: true,
          redirectPath,
        }));
        ensureUserProfile(user).catch((error) => {
          setState((current) => ({
            ...current,
            error: getErrorMessage(error),
          }));
        });

        unsubscribeProfile = onSnapshot(
          doc(db, 'users', user.uid),
          (snapshot) => {
            setState({
              user,
              profile: normalizeProfile(snapshot.data(), user),
              loading: false,
              error: '',
              redirectPath,
            });
          },
          (error) => {
            setState({
              user,
              profile: normalizeProfile({}, user),
              loading: false,
              error: getErrorMessage(
                error,
                'Your profile could not be loaded.',
              ),
              redirectPath,
            });
          },
        );
      });
    }

    startAuthListener();

    return () => {
      cancelled = true;
      unsubscribeProfile();
      unsubscribeAuth();
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
