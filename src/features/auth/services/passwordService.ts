import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { FirebaseError } from 'firebase/app';

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('Nessun account trovato con questa email');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Email non valida');
      }
      throw error;
    }
    throw new Error('Errore durante il reset della password');
  }
}