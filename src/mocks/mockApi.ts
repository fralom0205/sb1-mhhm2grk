// Simulated delay to mimic network latency
const MOCK_DELAY = 1000;

// Simulated database
const users = new Map();

// Mock API response helper
async function mockResponse<T>(data: T, shouldFail = false): Promise<T> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  if (shouldFail) {
    throw new Error('Errore di connessione al server');
  }
  
  return data;
}

// Helper to create a proper JWT-like token structure
function createMockToken(payload: any): string {
  // Create a basic JWT-like structure with header, payload, and signature
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const mockSignature = btoa('mock-signature');
  
  return `${header}.${encodedPayload}.${mockSignature}`;
}

// Mock user for testing
const MOCK_USER = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'manager',
  password: 'password123',
  emailVerified: true
};

users.set(MOCK_USER.email, MOCK_USER);

export async function mockLogin(credentials: { email: string; password: string }) {
  const user = users.get(credentials.email);

  if (!user || user.password !== credentials.password) {
    throw new Error('Email o password non validi');
  }

  if (!user.emailVerified) {
    throw new Error('Email non verificata. Controlla la tua casella di posta.');
  }

  // Create a proper mock JWT token
  const token = createMockToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
  });

  return mockResponse({ token });
}

export async function mockRegister(data: any) {
  if (users.has(data.email)) {
    throw new Error('Email già registrata');
  }

  const userData = {
    ...data,
    id: Math.random().toString(36).substring(2),
    emailVerified: false,
    verificationToken: Math.random().toString(36).substring(2),
  };

  users.set(data.email, userData);
  return mockResponse({ message: 'Registrazione completata con successo' });
}

export async function mockSendVerification(email: string) {
  const user = users.get(email);
  
  if (!user) {
    throw new Error('Utente non trovato');
  }

  console.log('Verification email sent with token:', user.verificationToken);
  return mockResponse({ message: 'Email di verifica inviata' });
}

export async function mockVerifyEmail(token: string) {
  const user = Array.from(users.values()).find(u => u.verificationToken === token);
  
  if (!user) {
    throw new Error('Token di verifica non valido');
  }

  user.emailVerified = true;
  delete user.verificationToken;

  return mockResponse({ message: 'Email verificata con successo' });
}