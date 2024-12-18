import { db } from '../config';
import { User } from '../../types/database';
import { hashPassword, comparePasswords } from '../../utils/auth';

export const userRepository = {
  create: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<number> => {
    const hashedPassword = await hashPassword(userData.password);
    
    return await db.users.add({
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });
  },

  findByEmail: async (email: string): Promise<User | undefined> => {
    return await db.users.where('email').equals(email).first();
  },
  
  findByVerificationToken: async (token: string): Promise<User | undefined> => {
    return await db.users.where('verificationToken').equals(token).first();
  },

  findById: async (id: number): Promise<User | undefined> => {
    return await db.users.get(id);
  },

  verifyCredentials: async (email: string, password: string): Promise<User | null> => {
    const user = await db.users.where('email').equals(email).first();
    if (!user) return null;

    const isValid = await comparePasswords(password, user.password);
    if (!isValid) return null;

    return user;
  },

  verifyEmail: async (userId: number): Promise<void> => {
    await db.users.update(userId, { 
      emailVerified: true,
      verificationToken: null 
    });
    
    // Get updated user
    const user = await db.users.get(userId);
    if (user) {
      // Create verification success notification
      await db.notifications.add({
        userId,
        type: 'success',
        title: 'Email verificata',
        message: 'Il tuo account è stato verificato con successo.',
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  },

  update: async (id: number, data: Partial<User>): Promise<void> => {
    await db.users.update(id, data);
  },

  delete: async (id: number): Promise<void> => {
    await db.users.delete(id);
  }
};