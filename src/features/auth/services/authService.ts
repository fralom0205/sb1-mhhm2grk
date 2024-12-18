import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider, 
  signOut,
  getAuth
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { LoginCredentials } from '../types/authTypes';

// Configure Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export async function loginWithEmail({ email, password }: LoginCredentials): Promise<void> {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
    
    // Verify user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await signOut(auth);
      throw new Error('Account non trovato');
    }
    
    // Check email verification unless it's a Google user
    if (!user.emailVerified && userDoc.data().authProvider !== 'google') {
      await signOut(auth);
      throw new Error('Email non verificata. Controlla la tua casella di posta.');
    }

  } catch (error: any) {
    if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/user-not-found') {
      throw new Error('Email o password non validi');
    } else if (error?.code === 'auth/too-many-requests') {
      throw new Error('Troppi tentativi. Riprova più tardi');
    }
    throw error;
  }
}

export async function loginWithGoogle(): Promise<void> {
  try {
    // Always force new selection to avoid cached credentials
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user profile exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create temporary profile for Google users
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName || '',
        role: '',
        emailVerified: true,
        authProvider: 'google',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Keep user signed in but throw registration_required
      throw new Error('registration_required');
    }

    // User exists, proceed with login
    return;
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user') {
      throw new Error('Login annullato');
    } else if (error.message === 'registration_required') {
      throw error;
    } else if (error?.code === 'auth/network-request-failed') {
      throw new Error('Errore di connessione. Verifica la tua connessione internet.');
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  await signOut(auth);
}