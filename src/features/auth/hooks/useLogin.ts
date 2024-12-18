import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { LoginCredentials } from '../types/authTypes';

export function useLogin() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (credentials: LoginCredentials) => {
    setError('');
    setIsLoading(true);

    try {
      await login(credentials);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('non verificata')) {
          navigate('/verification-pending', { replace: true });
          return;
        }
        if (err.message.includes('non verificata')) {
          navigate('/verification-pending');
          return;
        }
        setError(err.message);
      } else {
        setError('Errore durante il login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    handleLogin
  };
}