import { db } from '../config';
import { Notification } from '../../types/database';

export const notificationRepository = {
  create: async (data: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<number> => {
    return await db.notifications.add({
      ...data,
      read: false,
      createdAt: new Date().toISOString()
    });
  },

  findByUser: async (userId: number): Promise<Notification[]> => {
    return await db.notifications
      .where('userId').equals(userId)
      .reverse()
      .sortBy('createdAt');
  },

  markAsRead: async (id: number): Promise<void> => {
    await db.notifications.update(id, { read: true });
  },

  markAllAsRead: async (userId: number): Promise<void> => {
    await db.notifications
      .where('userId').equals(userId)
      .modify({ read: true });
  },

  delete: async (id: number): Promise<void> => {
    await db.notifications.delete(id);
  }
};