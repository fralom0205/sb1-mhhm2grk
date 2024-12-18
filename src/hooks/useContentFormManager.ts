import { useState, useCallback, useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Content, ContentType } from '../types/content';
import { validateContent, validateStep } from '../utils/contentValidation';
import { contentRepository } from '../repositories/contentRepository';

interface ContentFormState {
  step: number;
  data: Partial<Content>;
  error: string | null;
  isSubmitting: boolean;
  isDirty: boolean;
  contentId: string | null;
}

export function useContentFormManager(
  type: ContentType,
  userId: string,
  navigate: NavigateFunction
) {
  const [state, setState] = useState<ContentFormState>({
    step: 1,
    data: {
      type,
      userId,
      status: 'draft',
      views: 0,
      engagement: 0
    },
    error: null,
    isSubmitting: false,
    isDirty: false,
    contentId: null
  });

  // Initialize content on first mount
  useEffect(() => {
    const initializeContent = async () => {
      try {
        const id = await contentRepository.create({
          ...state.data,
          title: '',
          description: '',
          createdAt: new Date().toISOString()
        });
        setState(prev => ({ ...prev, contentId: id }));
      } catch (err) {
        console.error('Error initializing content:', err);
        setState(prev => ({ ...prev, error: 'Failed to initialize content' }));
      }
    };

    if (!state.contentId) {
      initializeContent();
    }
  }, []);

  const handleNext = useCallback(async (stepData: Partial<Content>) => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // Validate current step
      const validation = validateStep(type, state.step, {
        ...state.data,
        ...stepData
      });

      if (!validation.isValid) {
        setState(prev => ({
          ...prev,
          error: Object.values(validation.errors)[0],
          isSubmitting: false
        }));
        return;
      }

      // Update form data
      const newData = {
        ...state.data,
        ...stepData
      };

      // Save progress if we have a contentId
      if (state.contentId) {
        await contentRepository.update(state.contentId, {
          ...newData,
          step: state.step + 1,
          updatedAt: new Date().toISOString()
        });
      }

      // Update state
      setState(prev => ({
        ...prev,
        step: prev.step + 1,
        data: newData,
        isDirty: true,
        isSubmitting: false
      }));
    } catch (err) {
      console.error('Error saving progress:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to save progress',
        isSubmitting: false
      }));
    }
  }, [state.contentId, state.data, state.step, type]);

  const handleBack = useCallback(() => {
    setState(prev => ({
      ...prev,
      step: prev.step - 1,
      error: null
    }));
  }, []);

  const saveDraft = useCallback(async () => {
    if (!state.contentId || !state.isDirty) return;

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // Validate draft
      const validation = validateContent(type, state.data, 'draft');
      if (!validation.isValid) {
        setState(prev => ({
          ...prev,
          error: Object.values(validation.errors)[0],
          isSubmitting: false
        }));
        return;
      }

      await contentRepository.update(state.contentId, {
        ...state.data,
        status: 'draft',
        updatedAt: new Date().toISOString()
      });

      setState(prev => ({ ...prev, isDirty: false, isSubmitting: false }));
      navigate('/dashboard/content', {
        state: { message: 'Draft saved successfully', type: 'success' }
      });
    } catch (err) {
      console.error('Error saving draft:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to save draft',
        isSubmitting: false
      }));
    }
  }, [state.contentId, state.data, state.isDirty, type, navigate]);

  const publish = useCallback(async () => {
    if (!state.contentId) return;

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // Validate for publishing
      const validation = validateContent(type, state.data, 'publish');
      if (!validation.isValid) {
        setState(prev => ({
          ...prev,
          error: Object.values(validation.errors)[0],
          isSubmitting: false
        }));
        return;
      }

      await contentRepository.update(state.contentId, {
        ...state.data,
        status: 'published',
        publishDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      navigate('/dashboard/content', {
        state: { message: 'Content published successfully', type: 'success' }
      });
    } catch (err) {
      console.error('Error publishing content:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to publish content',
        isSubmitting: false
      }));
    }
  }, [state.contentId, state.data, type, navigate]);

  return {
    step: state.step,
    formData: state.data,
    error: state.error,
    isSubmitting: state.isSubmitting,
    isDirty: state.isDirty,
    handleNext,
    handleBack,
    saveDraft,
    publish
  };
}