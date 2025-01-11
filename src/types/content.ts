export type ContentType = 'promotion' | 'job' | 'event';

export interface ValidityPeriod {
  start: string;
  end: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface Content {
  id: string;
  type: ContentType | string;
  title: string;
  description?: string;
  validityPeriod?: ValidityPeriod;
  requirements?: string[];
  targetAudience?: string[];
  status?: 'draft' | 'published' | 'archived';
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  views?: number;
  engagement?: number;
  coverImageUrl?: string;
  step?: number; // Add step for workflow tracking
  publishDate?: string; // Add publishDate for published content
  data?: Record<string, any>; // Optional, for additional dynamic fields
}

export interface JobContent extends Content {
  type: 'job';
  jobType: string;
  jobLocation: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hour' | 'month' | 'year';
  };
  applicationDeadline?: string;
  department?: string;
  experience?: string;
  benefits?: string[];
}

export interface PromotionContent extends Content {
  type: 'promotion';
  promotionType: 'discount' | 'offer' | 'event';
  location: 'store' | 'online' | 'both';
  usageLimit?: string;
}

export interface EventContent extends Content {
  type: 'event';
  eventType: string;
  eventLocation: string;
  eventDate: string;
  endDate?: string;
  venue: string;
  capacity?: number;
  speakers?: string[];
  agenda?: string[];
  registrationDeadline?: string;
  registrationUrl?: string;
  views?: number;
  engagement?: number;
  status?: 'draft' | 'published';
}


export interface ContentFilter {
  type?: ContentType;
  dateRange?: DateRange;
}
