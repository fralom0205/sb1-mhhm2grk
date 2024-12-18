import { Content } from '../../../types/content';
import { 
  jobTypeOptions, 
  jobLocationOptions,
  eventTypeOptions,
  eventLocationOptions,
  promotionTypeOptions,
  locationOptions 
} from '../../../constants/contentTypes';

export function getTypeLabel(type: Content['type'], data?: Partial<Content>): string {
  if (!type || !data) return '';

  switch (type) {
    case 'job':
      return `${jobTypeOptions.find(opt => opt.value === data.jobType)?.label || ''} · 
              ${jobLocationOptions.find(opt => opt.value === data.jobLocation)?.label || ''}`;
    case 'event':
      return `${eventTypeOptions.find(opt => opt.value === data.eventType)?.label || ''} · 
              ${eventLocationOptions.find(opt => opt.value === data.eventLocation)?.label || ''}`;
    case 'promotion':
      return `${promotionTypeOptions.find(opt => opt.value === data.promotionType)?.label || ''} · 
              ${locationOptions.find(opt => opt.value === data.location)?.label || ''}`;
    default:
      return '';
  }
}

export function getDateInfo(type?: Content['type'], data?: Partial<Content>): string {
  if (!type || !data) return '';

  switch (type) {
    case 'job':
      return data.applicationDeadline ? 
        `Scade il ${formatDate(data.applicationDeadline)}` : '';
    case 'event':
      return data.eventDate ? 
        `${formatDateTime(data.eventDate)}` : '';
    case 'promotion':
      return data.validityPeriod?.start ? 
        `Valido dal ${formatDate(data.validityPeriod.start)} al ${formatDate(data.validityPeriod.end)}` : '';
    default:
      return '';
  }
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

function formatDateTime(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
}