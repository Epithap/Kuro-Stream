import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const env = import.meta.env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyCEYlTXca-PecXz8x5k1CW4O1eXtz4aH7s',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'kuro-stream.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'kuro-stream',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'kuro-stream.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '378727104506',
  appId: env.VITE_FIREBASE_APP_ID || '1:378727104506:web:7e5864f9cad90da11e6e43',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-8WPN8VYJLJ',
};

if (!env.VITE_FIREBASE_API_KEY) {
  // Helpful development-time warning — do not expose secrets in repo
  // Firebase web API keys are not secret, but moving config to env is cleaner.
  // Create `.env.local` at project root (copy from .env.example) and set values.
  // Vercel: set the same keys in the project Environment Variables.
  // See FIREBASE_SETUP.md for steps.
  // eslint-disable-next-line no-console
  console.warn('VITE_FIREBASE_API_KEY not set — using embedded firebase config. Move config to .env.local for security.');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

let db;
try {
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
} catch (error) {
  if (error?.message?.includes('initializeFirestore() has already been called')) {
    db = getFirestore(app);
  } else {
    throw error;
  }
}

export { db };
