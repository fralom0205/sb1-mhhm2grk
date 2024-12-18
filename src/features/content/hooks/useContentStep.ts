import { useState, useCallback } from 'react';
import { Content, ContentType } from '../../../types/content';
import { validateStep } from '../utils/validation';

export function useContentStep(type: ContentType, step: number, currentData: any) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndUpdateStep = useCallback(async (stepData: Partial<Content>) => {
    const validationResult = validateStep(type, step, {
      ...currentData,
      ...stepData
    });

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return false;
    }

    setErrors({});
    return true;
  }, [type, step, currentData]);

  return {
    errors,
    validateAndUpdateStep
  };
}