import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContextType, User } from '../types/auth';
import { validateToken } from '../services/auth.service';
import { getAuthToken, removeAuthToken, setAuthToken } from '../utils/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const isValid = await validateToken(token);
          if (isValid) {
            const decoded = jwtDecode<User>(token);
            setUser(decoded);
          } else {
            removeAuthToken();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          removeAuthToken();
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = (token: string) => {
    setAuthToken(token);
    const decoded = jwtDecode<User>(token);
    setUser(decoded);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}