import { Content, ContentType, JobContent, PromotionContent, EventContent } from '../types/content';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Common field validation
function validateCommonFields(data: Partial<Content>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }
  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  }

  return errors;
}

// Job-specific validation
function validateJobFields(data: Partial<JobContent>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.jobType) {
    errors.jobType = 'Job type is required';
  }
  if (!data.jobLocation) {
    errors.jobLocation = 'Job location is required';
  }
  if (!data.requirements?.length) {
    errors.requirements = 'At least one requirement is required';
  }
  if (data.applicationDeadline) {
    const deadline = new Date(data.applicationDeadline);
    if (deadline <= new Date()) {
      errors.applicationDeadline = 'Application deadline must be in the future';
    }
  }

  return errors;
}

// Promotion-specific validation
function validatePromotionFields(data: Partial<PromotionContent>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.promotionType) {
    errors.promotionType = 'Promotion type is required';
  }
  if (!data.location) {
    errors.location = 'Location is required';
  }
  if (!data.validityPeriod?.start || !data.validityPeriod?.end) {
    errors.validityPeriod = 'Validity period is required';
  } else {
    const start = new Date(data.validityPeriod.start);
    const end = new Date(data.validityPeriod.end);
    if (end <= start) {
      errors.validityPeriod = 'End date must be after start date';
    }
  }
  if (!data.targetAudience?.length) {
    errors.targetAudience = 'Target audience is required';
  }

  return errors;
}

// Event-specific validation
function validateEventFields(data: Partial<EventContent>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.eventType) {
    errors.eventType = 'Event type is required';
  }
  if (!data.eventLocation) {
    errors.eventLocation = 'Event location is required';
  }
  if (!data.eventDate) {
    errors.eventDate = 'Event date is required';
  } else {
    const eventDate = new Date(data.eventDate);
    if (eventDate <= new Date()) {
      errors.eventDate = 'Event date must be in the future';
    }
  }
  if (!data.venue) {
    errors.venue = 'Venue is required';
  }

  return errors;
}

// Main validation function
export function validateContent(
  type: ContentType,
  data: Partial<Content>,
  mode: 'draft' | 'publish' = 'draft'
): ValidationResult {
  let errors: Record<string, string> = {};

  // For drafts, only validate title
  if (mode === 'draft') {
    if (!data.title?.trim()) {
      errors.title = 'Title is required for draft';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  // For publishing, validate all required fields
  errors = validateCommonFields(data);

  switch (type) {
    case 'job':
      errors = { ...errors, ...validateJobFields(data as JobContent) };
      break;
    case 'promotion':
      errors = { ...errors, ...validatePromotionFields(data as PromotionContent) };
      break;
    case 'event':
      errors = { ...errors, ...validateEventFields(data as EventContent) };
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Step-specific validation
export function validateStep(
  type: ContentType,
  step: number,
  data: Partial<Content>
): ValidationResult {
  const errors: Record<string, string> = {};

  switch (step) {
    case 1:
      // Common fields validation
      if (!data.title?.trim()) {
        errors.title = 'Title is required';
      }
      break;

    case 2:
      // Type-specific fields validation
      switch (type) {
        case 'job':
          if (!data.jobType) errors.jobType = 'Job type is required';
          if (!data.jobLocation) errors.jobLocation = 'Job location is required';
          break;
        case 'promotion':
          if (!data.promotionType) errors.promotionType = 'Promotion type is required';
          if (!data.location) errors.location = 'Location is required';
          break;
        case 'event':
          if (!data.eventType) errors.eventType = 'Event type is required';
          if (!data.eventDate) errors.eventDate = 'Event date is required';
          break;
      }
      break;

    case 3:
      // Description and additional fields
      if (!data.description?.trim()) {
        errors.description = 'Description is required';
      }
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}