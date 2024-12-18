import { useState, useCallback } from 'react';
import { Content, ContentType } from '../../../types/content';
import { validateContentFields } from '../services/contentValidation';
import { ApiError } from '../../../utils/apiErrors';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  step?: number;
}

export function useContentValidation(type: ContentType) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const validateStep = useCallback((step: number, data: Partial<Content>): ValidationResult => {
    const newErrors: Record<string, string> = {};
    setCurrentStep(step);

    // Common validations for all steps
    if (step === 1) {
      if (!data.title?.trim()) {
        newErrors.title = 'Il titolo è obbligatorio';
      }
      if (!data.type) {
        newErrors.type = 'Il tipo di contenuto è obbligatorio';
      }
    }

    // Type-specific validations
    switch (type) {
      case 'promotion':
        validatePromotionStep(step, data, newErrors);
        break;
      case 'job':
        validateJobStep(step, data, newErrors);
        break;
      case 'event':
        validateEventStep(step, data, newErrors);
        break;
    }

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
      step: currentStep
    };
  }, [type, currentStep]);

  const validatePromotionStep = (step: number, data: Partial<Content>, errors: Record<string, string>) => {
    switch (step) {
      case 1:
        if (!data.promotionType) {
          errors.promotionType = 'Seleziona un tipo di promozione';
        }
        if (!data.location) {
          errors.location = 'Seleziona dove riscattare la promo';
        }
        if (!data.validityPeriod?.start || !data.validityPeriod?.end) {
          errors.validityPeriod = 'Seleziona il periodo di validità';
        } else {
          const start = new Date(data.validityPeriod.start);
          const end = new Date(data.validityPeriod.end);
          if (end <= start) {
            errors.validityPeriod = 'La data di fine deve essere successiva alla data di inizio';
          }
        }
        break;
      case 2:
        if (!data.targetAudience?.length) {
          errors.targetAudience = 'Seleziona almeno un pubblico target';
        }
        break;
      case 3:
        if (!data.description?.trim()) {
          errors.description = 'La descrizione è obbligatoria';
        }
        break;
    }
  };

  const validateJobStep = (step: number, data: Partial<Content>, errors: Record<string, string>) => {
    switch (step) {
      case 1:
        if (!data.jobType) {
          errors.jobType = 'Seleziona un tipo di lavoro';
        }
        if (!data.jobLocation) {
          errors.jobLocation = 'Seleziona una modalità di lavoro';
        }
        if (!data.applicationDeadline) {
          errors.applicationDeadline = 'Seleziona una data di scadenza';
        } else {
          const deadline = new Date(data.applicationDeadline);
          if (deadline <= new Date()) {
            errors.applicationDeadline = 'La data di scadenza deve essere futura';
          }
        }
        break;
      case 2:
        if (!data.requirements?.length) {
          errors.requirements = 'Inserisci almeno un requisito';
        }
        break;
      case 3:
        if (!data.description?.trim()) {
          errors.description = 'La descrizione è obbligatoria';
        }
        break;
    }
  };

  const validateEventStep = (step: number, data: Partial<Content>, errors: Record<string, string>) => {
    switch (step) {
      case 1:
        if (!data.eventType) {
          errors.eventType = 'Seleziona un tipo di evento';
        }
        if (!data.eventLocation) {
          errors.eventLocation = 'Seleziona una modalità';
        }
        if (!data.eventDate) {
          errors.eventDate = 'Seleziona una data';
        } else {
          const eventDate = new Date(data.eventDate);
          if (eventDate <= new Date()) {
            errors.eventDate = "La data dell'evento deve essere futura";
          }
        }
        if (!data.venue) {
          errors.venue = 'Inserisci una location';
        }
        break;
      case 2:
        if (!data.targetAudience?.length) {
          errors.targetAudience = 'Seleziona almeno un pubblico target';
        }
        break;
      case 3:
        if (!data.description?.trim()) {
          errors.description = 'La descrizione è obbligatoria';
        }
        break;
    }
  };

  const validateAll = useCallback((data: Partial<Content>): ValidationResult => {
    const validationErrors = validateContentFields(type, data);
    
    // Check if all required steps are completed
    if (data.step && data.step < getMaxSteps(type)) {
      throw new ApiError('Complete all steps before publishing', 400);
    }

    const formattedErrors = validationErrors.reduce((acc, error) => ({
      ...acc,
      [error.toLowerCase().replace(/\s+/g, '_')]: error
    }), {});

    setErrors(formattedErrors);
    return {
      isValid: validationErrors.length === 0,
      errors: formattedErrors,
      step: currentStep
    };
  }, [type, currentStep]);

  const getMaxSteps = (type: ContentType): number => {
    switch (type) {
      case 'promotion':
      case 'job':
        return 5;
      case 'event':
        return 3;
      default:
        return 0;
    }
  };

  return {
    errors,
    currentStep,
    validateStep,
    validateAll,
    clearErrors: useCallback(() => setErrors({}), [])
  };
}