import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { RegistrationFormData } from '../../../types/registration';
import { FirebaseError, getApp } from 'firebase/app';

export async function register(
  data: RegistrationFormData, 
  isGoogleAuth: boolean = false
): Promise<{ success: boolean }> {
  try {
    let userId;
    
    if (!isGoogleAuth) {
      // Create Firebase user for email registration
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );
      userId = userCredential.user.uid;
    } else {
      // For Google auth, use current user
      if (!auth.currentUser) {
        throw new Error('Utente non autenticato');
      }
      userId = auth.currentUser.uid;
    }

    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', userId), {
      name: `${data.name} ${data.surname}`.trim(),
      surname: data.surname,
      role: data.role,
      brandName: data.brandName,
      brandCategory: data.brandCategory,
      salesChannel: data.salesChannel,
      website: data.website,
      studentMessage: data.studentMessage || '',
      email: data.email.trim(),
      phone: data.phone,
      emailVerified: isGoogleAuth,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authProvider: isGoogleAuth ? 'google' : 'email'
    });

    if (!isGoogleAuth) {
      // Send verification email only for email registration
      const user = auth.currentUser;
      if (!user) throw new Error('Utente non trovato');

      await sendEmailVerification(user, {
        url: `${window.location.origin}/email-verified`,
        handleCodeInApp: true,
        dynamicLinkDomain: "inquisitive-crisp-7b52e5.netlify.app"
      });
    }
    
    // Only sign out for email registration
    if (!isGoogleAuth) {
      await auth.signOut();
    }

    // Return success to trigger navigation
    return { success: true };

  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Email già registrata');
        case 'auth/invalid-email':
          throw new Error('Email non valida');
        case 'auth/operation-not-allowed':
          throw new Error('Registrazione non abilitata');
        case 'auth/weak-password':
          throw new Error('Password troppo debole');
        default:
          console.error('Firebase error:', error);
          throw new Error('Errore durante la registrazione');
      }
    }
    console.error('Registration error:', error);
    throw new Error('Errore durante la registrazione');
  }
}