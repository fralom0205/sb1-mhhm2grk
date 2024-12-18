import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { AuthContext } from './AuthContext';
import { User } from '../types/authTypes';
import { loginWithEmail, loginWithGoogle, logout } from '../services/authService';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset error when route changes
  // Clear error on route change
  useEffect(() => {
    const handleRouteChange = () => setError(null);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [window.location.pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          const userData = userDoc.exists() ? userDoc.data() : {};
          const isGoogleAuth = userData.authProvider === 'google';
          
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: userData.name || firebaseUser.displayName || '',
            role: userData.role || '',
            brandName: userData.brandName || '',
            emailVerified: firebaseUser.emailVerified || isGoogleAuth,
            authProvider: isGoogleAuth ? 'google' : 'email'
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEmailLogin = async (credentials: { email: string; password: string }) => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithEmail(credentials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err instanceof Error && err.message !== 'registration_required') {
        setError(err.message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    error,
    handleEmailLogin,
    handleGoogleLogin,
    handleLogout
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}