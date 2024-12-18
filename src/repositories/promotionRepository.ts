import { doc, collection, query, where, orderBy, getDocs, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, promotionsCollection } from '../db/firestore';
import { Promotion } from '../types/database';

export const promotionRepository = {
  create: async (data: Omit<Promotion, 'id' | 'createdAt' | 'views' | 'engagement'>) => {
    const docRef = doc(promotionsCollection);
    await setDoc(docRef, {
      ...data,
      views: 0,
      engagement: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  },

  findById: async (id: string) => {
    const docRef = doc(promotionsCollection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  findByUser: async (userId: string) => {
    const q = query(
      promotionsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  update: async (id: string, data: Partial<Promotion>) => {
    const docRef = doc(promotionsCollection, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  },

  delete: async (id: string) => {
    await deleteDoc(doc(promotionsCollection, id));
  }
};