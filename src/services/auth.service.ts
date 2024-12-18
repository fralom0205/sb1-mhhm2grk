import { signInWithEmailAndPassword, signOut, sendEmailVerification, getIdToken } from 'firebase/auth';
import { auth } from '../config/firebase';
import { LoginCredentials } from '../types/auth';

export async function login(credentials: LoginCredentials): Promise<{ token: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      throw new Error('Email non verificata. Controlla la tua casella di posta.');
    }

    const token = await user.getIdToken();
    return { token };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Errore durante il login');
  }
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    // In a real app, you would validate the token with your backend
    // For now, we'll just check if it's a valid JWT format
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Check if token is expired
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    if (Date.now() >= exp) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}