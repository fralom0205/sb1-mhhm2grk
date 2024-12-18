import { doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../db/firestore';
import { User } from '../types/database';

export const usersCollection = collection(db, 'users');

export const userRepository = {
  create: async (userData: Omit<User, 'id' | 'createdAt'>) => {
    const docRef = doc(usersCollection);
    await setDoc(docRef, {
      ...userData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  },

  findByEmail: async (email: string) => {
    const q = query(usersCollection, where('email', '==', email));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  },

  findById: async (id: string) => {
    const docRef = doc(usersCollection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  update: async (id: string, data: Partial<User>) => {
    const docRef = doc(usersCollection, id);
    await updateDoc(docRef, data);
  }
};