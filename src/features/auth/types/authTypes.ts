export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  brandName: string;
  emailVerified: boolean;
  authProvider?: 'email' | 'google';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  handleEmailLogin: (credentials: LoginCredentials) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}