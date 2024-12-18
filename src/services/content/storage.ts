import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';
import { ApiError } from '../../utils/apiErrors';
import { validateFile } from './validation';
import { FileValidationOptions } from './types';

export async function uploadContentImage(
  file: File,
  userId: string,
  type: string,
  options?: FileValidationOptions
): Promise<string> {
  try {
    await validateFile(file, options);
    
    const timestamp = Date.now();
    const filename = `${timestamp}_${userId}_${type}`;
    const imageRef = ref(storage, `content/${filename}`);
    
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error uploading image:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to upload image. Please try again.', 500);
  }
}