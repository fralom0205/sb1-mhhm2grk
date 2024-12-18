import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ApiError } from '../../utils/apiErrors';
import { ContentItem } from '../../types/database';

export class BaseContentRepository {
  protected collection: string;

  constructor(collection: string) {
    this.collection = collection;
  }

  async create(data: Omit<ContentItem, 'id' | 'createdAt' | 'views' | 'engagement'>): Promise<string> {
    try {
      const docRef = doc(db, this.collection);
      await setDoc(docRef, {
        ...data,
        views: 0,
        engagement: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating content:', error);
      throw new ApiError('Failed to create content. Please try again.', 500);
    }
  }

  async findById(id: string): Promise<ContentItem | null> {
    try {
      const docRef = doc(db, this.collection, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as ContentItem : null;
    } catch (error) {
      console.error('Error fetching content:', error);
      throw new ApiError('Failed to fetch content. Please try again.', 500);
    }
  }

  async update(id: string, data: Partial<ContentItem>): Promise<void> {
    try {
      const docRef = doc(db, this.collection, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating content:', error);
      throw new ApiError('Failed to update content. Please try again.', 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collection, id));
    } catch (error) {
      console.error('Error deleting content:', error);
      throw new ApiError('Failed to delete content. Please try again.', 500);
    }
  }
}