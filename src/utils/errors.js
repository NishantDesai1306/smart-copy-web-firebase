const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use':
    'An account already uses this email. Sign in instead.',
  'auth/account-exists-with-different-credential':
    'Sign in with your existing method, then connect this provider from Security.',
  'auth/invalid-credential': 'The email or password is incorrect. Try again.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/network-request-failed': 'Check your connection and try again.',
  'auth/popup-blocked':
    'Allow popups for this site, then try Google or Facebook again.',
  'auth/popup-closed-by-user':
    'Sign-in was cancelled. Try again when you are ready.',
  'auth/requires-recent-login':
    'Sign in again before changing security settings.',
  'auth/too-many-requests': 'Too many attempts. Wait a moment, then try again.',
  'auth/user-disabled': 'This account is disabled. Contact support for help.',
  'auth/user-not-found': 'The email or password is incorrect. Try again.',
  'auth/weak-password': 'Use a password with at least 6 characters.',
  'auth/wrong-password': 'The email or password is incorrect. Try again.',
  'permission-denied': 'You do not have permission to do that.',
};

export function getErrorMessage(
  error,
  fallback = 'Something went wrong. Try again.',
) {
  if (!error) return fallback;
  return AUTH_ERROR_MESSAGES[error.code] || error.message || fallback;
}
