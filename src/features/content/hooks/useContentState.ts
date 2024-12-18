import { useState, useCallback } from 'react';
import { Content } from '../../../types/content';

interface ContentState {
  step: number;
  data: any;
  error: string | null;
  isSubmitting: boolean;
  isDirty: boolean;
}

export function useContentState(initialState: Partial<ContentState> = {}) {
  const [state, setState] = useState<ContentState>({
    step: 1,
    data: {},
    error: null,
    isSubmitting: false,
    isDirty: false,
    ...initialState
  });

  const updateStep = useCallback((newStep: number) => {
    setState(prev => ({
      ...prev,
      step: newStep,
      error: null
    }));
  }, []);

  const updateData = useCallback((newData: Partial<Content>) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        ...newData
      },
      isDirty: true
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error
    }));
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState(prev => ({
      ...prev,
      isSubmitting
    }));
  }, []);

  const resetDirty = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDirty: false
    }));
  }, []);

  return {
    state,
    updateStep,
    updateData,
    setError,
    setSubmitting,
    resetDirty
  };
}