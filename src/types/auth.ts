export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  companyLogo?: string;
  emailVerified: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}