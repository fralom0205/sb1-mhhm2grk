import { jwtDecode } from 'jwt-decode';
import { User } from '../types/authTypes';

// In a real application, this would be an environment variable
const JWT_SECRET = 'your-secret-key';

export function createToken(payload: Omit<User, 'password'>): string {
  // Create a basic JWT structure
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 60 * 60; // 1 hour

  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn
  };

  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(tokenPayload));
  
  // In a real application, this would use a proper JWT signing algorithm
  const signature = btoa(JWT_SECRET);

  return `${base64Header}.${base64Payload}.${signature}`;
}

export function decodeToken(token: string): User {
  return jwtDecode<User>(token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('auth_token');
}

export function createAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}