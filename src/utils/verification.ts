import { VerificationHelper } from '../components/dev/VerificationHelper';

export function generateVerificationToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  // In development, we'll just log the verification link
  if (process.env.NODE_ENV === 'development') {
    console.log('Verification email sent with token:', token);
    return;
  }

  // In production, implement actual email sending logic here
  throw new Error('Email sending not implemented in production');
}