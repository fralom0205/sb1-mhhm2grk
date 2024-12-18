import { doc, collection, query, where, orderBy, getDocs, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../db/firestore';
import { Notification } from '../types/database';

export const notificationsCollection = collection(db, 'notifications');

export const notificationRepository = {
  create: async (data: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const docRef = doc(notificationsCollection);
    await setDoc(docRef, {
      ...data,
      read: false,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  },

  findByUser: async (userId: string) => {
    const q = query(
      notificationsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  markAsRead: async (id: string) => {
    const docRef = doc(notificationsCollection, id);
    await updateDoc(docRef, { read: true });
  },

  markAllAsRead: async (userId: string) => {
    const q = query(
      notificationsCollection,
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    await batch.commit();
  }
};