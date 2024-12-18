import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Content, ContentType } from '../types/content';
import { ApiError } from '../utils/apiErrors';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const PAGE_SIZE = 20;

/**
 * Validate the uploaded file.
 * @param file - File to validate
 * @throws ApiError if validation fails
 */
async function validateFile(file: File): Promise<void> {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new ApiError('Invalid file type. Only JPEG, PNG, and WebP are allowed.', 400);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new ApiError('File size exceeds 5MB limit.', 400);
  }
}

/**
 * Upload an image to Firebase Storage.
 * @param file - File to upload
 * @param userId - ID of the user uploading the file
 * @param type - Type of the content associated with the file
 * @returns URL of the uploaded image
 */
async function uploadImage(file: File, userId: string, type: string): Promise<string> {
  try {
    await validateFile(file);

    const timestamp = Date.now();
    const filename = `${timestamp}_${userId}_${type}`;
    const imageRef = ref(storage, `content/${filename}`);

    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading image:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to upload image. Please try again.', 500);
  }
}

/**
 * Fetch content by ID.
 * @param id - Content document ID
 * @returns Content object or null if not found
 */
export async function getContentById(id: string): Promise<Content | null> {
  try {
    const docRef = doc(db, 'content', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Content) : null;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw new ApiError('Failed to fetch content. Please try again.', 500);
  }
}

/**
 * Fetch content for a specific user with optional filters and pagination.
 * @param userId - ID of the user
 * @param page - Page number for pagination
 * @param filters - Optional filters for type and status
 * @returns Array of content
 */
export async function getUserContent(
  userId: string,
  page = 1,
  filters?: { type?: ContentType; status?: string }
): Promise<Content[]> {
  try {
    const constraints = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(PAGE_SIZE)
    ];

    // Add type filter if specified
    if (filters?.type) {
      constraints.push(where('type', '==', filters.type));
    }

    // Add status filter if specified
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }

    // Apply pagination offset
    if (page > 1) {
      const offset = (page - 1) * PAGE_SIZE;
      constraints.push(limit(offset + PAGE_SIZE));
    }

    const q = query(collection(db, 'content'), ...constraints);
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`No content found for user ${userId} with the provided filters.`);
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Content[];
  } catch (error) {
    console.error('Error fetching user content:', error);
    throw new ApiError('Failed to fetch content. Please try again.', 500);
  }
}

/**
 * Update a specific content document.
 * @param id - Content document ID
 * @param data - Partial content data to update
 */
export async function updateContent(id: string, data: Partial<Content>): Promise<void> {
  try {
    const docRef = doc(db, 'content', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating content:', error);
    throw new ApiError('Failed to update content. Please try again.', 500);
  }
}

/**
 * Create new content in the Firestore database.
 * @param data - Content data to create
 * @returns ID of the newly created content document
 */
export async function createContent(data: Partial<Content>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'content'), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating content:', error);
    throw new ApiError('Failed to create content. Please try again.', 500);
  }
}
