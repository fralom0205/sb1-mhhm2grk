import { RegistrationFormData } from '../types/registration';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function register(data: RegistrationFormData): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Errore durante la registrazione');
  }

  return response.json();
}