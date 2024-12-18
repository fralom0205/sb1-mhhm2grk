import { Content, ContentType, PromotionContent, JobContent, EventContent } from '../../../types/content';

export function validateContentFields(type: ContentType, data: Partial<Content>): string[] {
  const errors: string[] = [];

  // Common validations
  if (!data.title?.trim()) errors.push('Title is required');
  if (!data.description?.trim()) errors.push('Description is required');
  if (!data.targetAudience?.length) errors.push('Target audience is required');

  // Type-specific validations
  switch (type) {
    case 'promotion':
      validatePromotionFields(data, errors);
      break;
    case 'job':
      validateJobFields(data, errors);
      break;
    case 'event':
      validateEventFields(data, errors);
      break;
    default:
      errors.push(`Invalid content type: ${type}`);
  }

  return errors;
}

function validatePromotionFields(data: Partial<PromotionContent>, errors: string[]): void {
  if (!data.promotionType) errors.push('Promotion type is required');
  if (!data.location) errors.push('Location is required');
  if (!data.validityPeriod?.start || !data.validityPeriod?.end) {
    errors.push('Validity period is required');
  }
}

function validateJobFields(data: Partial<JobContent>, errors: string[]): void {
  if (!data.jobType) errors.push('Job type is required');
  if (!data.jobLocation) errors.push('Job location is required');
  if (!data.requirements?.length) errors.push('Requirements are required');
  if (!data.applicationDeadline) errors.push('Application deadline is required');
}

function validateEventFields(data: Partial<EventContent>, errors: string[]): void {
  if (!data.eventType) errors.push('Event type is required');
  if (!data.eventLocation) errors.push('Event location is required');
  if (!data.eventDate) errors.push('Event date is required');
  if (!data.venue) errors.push('Venue is required');
}