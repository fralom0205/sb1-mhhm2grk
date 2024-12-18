import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { app, auth, db, storage } from '../firebase';

jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/storage');

describe('Firebase Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Firebase with correct config', () => {
    expect(initializeApp).toHaveBeenCalledWith({
      apiKey: expect.any(String),
      authDomain: expect.any(String),
      projectId: expect.any(String),
      storageBucket: expect.any(String),
      messagingSenderId: expect.any(String),
      appId: expect.any(String)
    });
  });

  it('should initialize Firestore with persistence', () => {
    expect(initializeFirestore).toHaveBeenCalledWith(
      expect.anything(),
      {
        localCache: expect.any(Object)
      }
    );
  });

  it('should export Firebase instances', () => {
    expect(app).toBeDefined();
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
    expect(storage).toBeDefined();
  });

  it('should configure Firestore persistence correctly', () => {
    expect(persistentLocalCache).toHaveBeenCalledWith({
      tabManager: expect.any(Object)
    });
  });
});