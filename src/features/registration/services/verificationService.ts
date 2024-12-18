import { ApiError } from '../../../utils/apiErrors';
import { mockSendVerification, mockVerifyEmail } from '../../../mocks/mockApi';

// In production, this would be an environment variable
const USE_MOCK_API = true;

export async function sendVerificationEmail(email: string): Promise<void> {
  try {
    if (USE_MOCK_API) {
      await mockSendVerification(email);
      return;
    }

    const response = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(
        data.message || 'Errore durante l\'invio dell\'email di verifica',
        response.status,
        data
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Impossibile inviare l\'email di verifica. Riprova più tardi.');
  }
}

export async function verifyEmail(token: string): Promise<void> {
  try {
    if (USE_MOCK_API) {
      await mockVerifyEmail(token);
      return;
    }

    const response = await fetch(`/api/auth/verify-email/${token}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(
        data.message || 'Token di verifica non valido',
        response.status,
        data
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Impossibile verificare l\'email. Riprova più tardi.');
  }
}