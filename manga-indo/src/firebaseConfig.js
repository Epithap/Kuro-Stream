import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCEYlTXca-PecXz8x5k1CW4O1eXtz4aH7s',
  authDomain: 'kuro-stream.firebaseapp.com',
  projectId: 'kuro-stream',
  storageBucket: 'kuro-stream.firebasestorage.app',
  messagingSenderId: '378727104506',
  appId: '1:378727104506:web:7e5864f9cad90da11e6e43',
  measurementId: 'G-8WPN8VYJLJ',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
