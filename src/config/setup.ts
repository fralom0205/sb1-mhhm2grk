import { auth, db } from './firebase';
import { setupFirestore } from '../db/setup';
import { onAuthStateChanged } from 'firebase/auth';
import { enableIndexedDbPersistence } from 'firebase/firestore';

export async function setupApp() {
  try {
    console.log('Setting up application...');

    // Set up Firestore collections and indexes
    await setupFirestore();

    // Initialize Firebase Auth
    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        unsubscribe();
        resolve();
      });
    });

    // Enable offline persistence
    try {
      await enableIndexedDbPersistence(db);
      console.log('Offline persistence enabled');
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('Browser doesn\'t support persistence');
      } else {
        console.error('Error enabling offline persistence:', err);
      }
    }

    console.log('Firebase setup completed successfully');
    return true;
  } catch (error) {
    console.error('Error setting up Firebase:', error);
    return false;
  }
}