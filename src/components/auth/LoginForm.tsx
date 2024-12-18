import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { LoginFormContent } from './LoginFormContent';

export function LoginForm() {
  const { error, isLoading, handleEmailLogin, handleGoogleLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await handleEmailLogin(credentials);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await handleGoogleLogin();
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error && err.message === 'registration_required') {
        navigate('/register', { 
          state: { 
            googleAuth: true,
            message: 'Per completare la registrazione, inserisci i dati mancanti'
          }
        });
      }
      // Other errors are handled by AuthContext
    }
  };

  return (
    <LoginFormContent
      onSubmit={handleLogin}
      onGoogleLogin={handleGoogleSignIn}
      error={error}
      isLoading={isLoading}
    />
  );
}