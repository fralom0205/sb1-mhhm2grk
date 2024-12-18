import { useEffect, useCallback, useRef } from 'react';
import { Content } from '../../../types/content';
import { useAuth } from '../../auth/hooks/useAuth';
import { validateContentFields } from '../../../services/content/validation';
import { contentRepository } from '../../../repositories/contentRepository';

export function useAutoSave(
  formData: Partial<Content>,
  isDirty: boolean,
  contentId?: string
) {
  const { user } = useAuth();
  const timeoutRef = useRef<number>();
  const lastSaveRef = useRef<string>();

  const saveContent = useCallback(async () => {
    if (!user?.id || !isDirty || !formData.type) return;
    
    // Prevent saving if content hasn't changed since last save
    const { validityPeriod, ...rest } = formData;
    const contentHash = JSON.stringify({
      ...rest,
      validityPeriod: validityPeriod ? {
        start: new Date(validityPeriod.start).toISOString(),
        end: new Date(validityPeriod.end).toISOString()
      } : undefined
    });
    
    if (contentHash === lastSaveRef.current) return;

    // Validate content before saving
    const errors = validateContentFields(formData.type as ContentType, {
      ...formData,
      validityPeriod: validityPeriod ? {
        start: new Date(validityPeriod.start).toISOString(),
        end: new Date(validityPeriod.end).toISOString()
      } : undefined
    });

    if (errors.length > 0) {
      console.warn('Auto-save validation errors:', errors);
      return;
    }

    const timestamp = new Date().toISOString();

    try {
      if (contentId) {
        await contentRepository.update(contentId, {
          ...formData,
          updatedAt: timestamp
        });
      } else {
        await contentRepository.create({
          ...formData,
          type: formData.type,
          userId: user.id,
          status: 'draft',
          createdAt: timestamp,
          updatedAt: timestamp,
          views: 0,
          engagement: 0
        });
      }
      lastSaveRef.current = contentHash;
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  }, [user?.id, formData, isDirty, contentId]);

  useEffect(() => {
    if (isDirty) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      // Set new timeout for auto-save
      timeoutRef.current = window.setTimeout(saveContent, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isDirty, saveContent]);

  return { saveContent };
}