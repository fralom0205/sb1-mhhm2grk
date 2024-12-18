import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Content, ContentType } from '../types/content';
import { ApiError } from '../utils/apiErrors';

const CONTENT_COLLECTION = 'content';
const DEFAULT_PAGE_SIZE = 20;

export const contentRepository = {
  create: async (data: Omit<Content, 'id'>): Promise<string> => {
    try {
      if (!data.title?.trim()) {
        throw new ApiError('Title is required', 400);
      }

      const contentRef = collection(db, CONTENT_COLLECTION);
      const docRef = await addDoc(contentRef, {
        ...data,
        views: 0,
        engagement: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating content:', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create content', 500);
    }
  },

  findById: async (id: string): Promise<Content | null> => {
    try {
      const docRef = doc(db, CONTENT_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Content : null;
    } catch (error) {
      console.error('Error fetching content:', error);
      throw new ApiError('Failed to fetch content', 500);
    }
  },

  findByUser: async (
    userId: string,
    type?: ContentType,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE
  ): Promise<Content[]> => {
    try {
      const constraints = [
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      ];

      if (type) {
        constraints.push(where('type', '==', type));
      }

      constraints.push(limit(pageSize));

      const q = query(collection(db, CONTENT_COLLECTION), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Content);
    } catch (error) {
      console.error('Error fetching user content:', error);
      throw new ApiError('Failed to fetch content', 500);
    }
  },

  update: async (id: string, data: Partial<Content>): Promise<void> => {
    try {
      const docRef = doc(db, CONTENT_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating content:', error);
      throw new ApiError('Failed to update content', 500);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, CONTENT_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new ApiError('Content not found', 404);
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting content:', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete content', 500);
    }
  }
};