import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyCBUwWpgEObf4vIvauAi9U5tStWdIRaduo',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'smartcopy-195fd.firebaseapp.com',
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    'https://smartcopy-195fd.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'smartcopy-195fd',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'smartcopy-195fd.appspot.com',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '961123670467',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:961123670467:web:e99ec5fb44bb9391040576',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

if (
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true'
) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}
