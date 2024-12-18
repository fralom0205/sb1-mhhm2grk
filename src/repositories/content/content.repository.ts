import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Content, ContentType } from '../../types/content';
import { ApiError } from '../../utils/apiErrors';

export class ContentRepository {
  private readonly collectionRef;

  constructor() {
    this.collectionRef = collection(db, 'content');
  }

  async create(data: Omit<Content, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.collectionRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating content:', error);
      throw new ApiError('Failed to create content', 500);
    }
  }

  async findById(id: string): Promise<Content | null> {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Content : null;
    } catch (error) {
      console.error('Error fetching content:', error);
      throw new ApiError('Failed to fetch content', 500);
    }
  }

  async findByUserAndStatus(userId: string, status: string): Promise<Content[]> {
    try {
      const q = query(
        this.collectionRef,
        where('userId', '==', userId),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Content);
    } catch (error) {
      console.error('Error fetching content by status:', error);
      throw new ApiError('Failed to fetch content', 500);
    }
  }

  async update(id: string, data: Partial<Content>): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating content:', error);
      throw new ApiError('Failed to update content', 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.collectionRef, id));
    } catch (error) {
      console.error('Error deleting content:', error);
      throw new ApiError('Failed to delete content', 500);
    }
  }
}