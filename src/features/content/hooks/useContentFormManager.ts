import { useState, useCallback, useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Content, ContentType } from '../../../types/content';
import { BaseContentService } from '../../../services/content/base.service';
import { validateContentFields } from '../../../services/content/validation';

export function useContentFormManager(
  type: ContentType,
  userId: string,
  navigate: NavigateFunction
) {
  const [contentId, setContentId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Content>>({
    type,
    userId,
    status: 'draft',
    step: 1,
    views: 0,
    engagement: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const service = new BaseContentService();

  // Initialize content on first mount
  useEffect(() => {
    const initializeContent = async () => {
      try {
        const id = await service.initializeContent(userId, type);
        setContentId(id);
        setFormData(prev => ({ ...prev, id }));
      } catch (err) {
        console.error('Error initializing content:', err);
        setError('Failed to initialize content');
      }
    };

    if (!contentId) {
      initializeContent();
    }
  }, [userId, type, service]);

  const handleNext = useCallback(async (stepData: Partial<Content>) => {
    if (!contentId) {
      setError('Content not initialized');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    
    const newData = {
      ...formData,
      ...stepData,
      step: step + 1
    };
    
    // Auto-save as draft when moving to next step
    try {
      await service.saveDraft(contentId, step, newData);
      setFormData(newData);
      setStep(prev => prev + 1);
      setIsDirty(true);
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(err instanceof Error ? err.message : 'Failed to save progress');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, step, type, service, contentId]);

  const handleBack = useCallback(() => {
    setStep(prev => prev - 1);
    setError(null);
  }, []);

  const saveDraft = useCallback(async () => {
    if (!contentId) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await service.saveDraft(contentId, step, formData);
      setIsDirty(false);
      navigate('/dashboard/content', {
        state: { message: 'Bozza salvata con successo', type: 'success' }
      });
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(err instanceof Error ? err.message : 'Error saving draft');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, step, navigate, service, contentId]);

  const publish = useCallback(async () => {
    if (!contentId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await service.publishContent(contentId);
      navigate('/dashboard/content', {
        state: { message: 'Contenuto pubblicato con successo', type: 'success' }
      });
    } catch (err) {
      console.error('Error publishing content:', err);
      setError(err instanceof Error ? err.message : 'Error publishing content');
    } finally {
      setIsSubmitting(false);
    }
  }, [contentId, navigate, service]);

  return {
    step,
    formData,
    error,
    isSubmitting,
    isDirty,
    handleNext,
    handleBack,
    saveDraft,
    publish
  };
}