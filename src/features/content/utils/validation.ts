import { Content, ContentType, JobContent, PromotionContent, EventContent } from '../../../types/content';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateStep(
  type: ContentType,
  step: number,
  data: Partial<Content>
): ValidationResult {
  const errors: Record<string, string> = {};
  const now = new Date().getTime();

  // Common validations
  if (step === 1) {
    if (!data.title?.trim()) errors.title = 'Il titolo è obbligatorio';
  } else if (step === 3) {
    if (!data.description?.trim()) errors.description = 'La descrizione è obbligatoria';
  }

  // Type-specific validations
  switch (type) {
    case 'job':
      validateJobStep(step, data as JobContent, errors, now);
      break;
    case 'promotion':
      validatePromotionStep(step, data as PromotionContent, errors);
      break;
    case 'event':
      validateEventStep(step, data as EventContent, errors, now);
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function validateJobStep(
  step: number,
  data: Partial<JobContent>,
  errors: Record<string, string>,
  now: number
): void {
  if (step === 1) {
    if (!data.jobType) errors.jobType = 'Seleziona un tipo di lavoro';
    if (!data.jobLocation) errors.jobLocation = 'Seleziona una modalità di lavoro';
    
    const deadline = new Date(data.applicationDeadline || '').getTime();
    if (!deadline || deadline <= now) {
      errors.applicationDeadline = 'La data di scadenza deve essere futura';
    }
  } else if (step === 2) {
    if (!data.requirements?.length) {
      errors.requirements = 'Inserisci almeno un requisito';
    }
  }
}

function validatePromotionStep(
  step: number,
  data: Partial<PromotionContent>,
  errors: Record<string, string>
): void {
  if (step === 1) {
    if (!data.promotionType) errors.promotionType = 'Seleziona un tipo di promozione';
    if (!data.location) errors.location = 'Seleziona dove riscattare la promo';
    
    if (!data.validityPeriod?.start || !data.validityPeriod?.end) {
      errors.validityPeriod = 'Seleziona le date di validità';
    } else {
      const start = new Date(data.validityPeriod.start).getTime();
      const end = new Date(data.validityPeriod.end).getTime();
      if (start >= end) {
        errors.validityPeriod = 'La data di fine deve essere successiva alla data di inizio';
      }
    }
  } else if (step === 2) {
    if (!data.targetAudience?.length) {
      errors.targetAudience = 'Seleziona almeno un pubblico target';
    }
  }
}

function validateEventStep(
  step: number,
  data: Partial<EventContent>,
  errors: Record<string, string>,
  now: number
): void {
  if (step === 1) {
    if (!data.eventType) errors.eventType = 'Seleziona un tipo di evento';
    if (!data.eventLocation) errors.eventLocation = 'Seleziona una modalità';
    
    const eventDate = new Date(data.eventDate || '').getTime();
    if (!eventDate || eventDate <= now) {
      errors.eventDate = 'La data dell\'evento deve essere futura';
    }
  } else if (step === 2) {
    if (!data.targetAudience?.length) {
      errors.targetAudience = 'Seleziona almeno un pubblico target';
    }
  }
}