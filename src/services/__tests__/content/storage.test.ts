import { validateFile } from '../../content/validation';
import { FileValidationOptions } from '../../content/types';
import { ApiError } from '../../../utils/apiErrors';

describe('File Validation', () => {
  const createFile = (type: string, size: number): File => {
    const content = 'x'.repeat(size);
    return new File([content], 'test.jpg', { type });
  };

  describe('validateFile', () => {
    it('should validate file type', async () => {
      const file = createFile('image/jpeg', 1024);
      const options: FileValidationOptions = {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png']
      };

      await expect(validateFile(file, options)).resolves.not.toThrow();
    });

    it('should reject invalid file type', async () => {
      const file = createFile('text/plain', 1024);
      const options: FileValidationOptions = {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png']
      };

      await expect(validateFile(file, options))
        .rejects
        .toThrow('Invalid file type');
    });

    it('should validate file size', async () => {
      const file = createFile('image/jpeg', 1024);
      const options: FileValidationOptions = {
        maxSize: 5 * 1024,
        allowedTypes: ['image/jpeg']
      };

      await expect(validateFile(file, options)).resolves.not.toThrow();
    });

    it('should reject oversized file', async () => {
      const file = createFile('image/jpeg', 6 * 1024 * 1024);
      const options: FileValidationOptions = {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg']
      };

      await expect(validateFile(file, options))
        .rejects
        .toThrow('File size exceeds');
    });

    it('should use default options when not provided', async () => {
      const file = createFile('image/jpeg', 1024);
      await expect(validateFile(file)).resolves.not.toThrow();
    });

    it('should merge provided options with defaults', async () => {
      const file = createFile('image/jpeg', 1024);
      const options: FileValidationOptions = {
        maxSize: 2 * 1024 * 1024 // Override just maxSize
      };

      await expect(validateFile(file, options)).resolves.not.toThrow();
    });
  });
});