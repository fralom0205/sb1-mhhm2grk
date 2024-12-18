export type ContentType = 'promotion' | 'coupon' | 'event' | 'job';

export interface ContentBase {
  id?: string;
  userId: string;
  type: ContentType;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  publishDate?: string;
  expiryDate?: string;
  views: number;
  engagement: number;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
  sharingImage?: string;
}

export interface PromotionContent extends ContentBase {
  type: 'promotion' | 'coupon';
  promotionType: 'discount' | 'offer' | 'event';
  location: 'store' | 'online' | 'both';
  validityPeriod: {
    start: string;
    end: string;
  };
  targetAudience: string[];
  usageLimit?: string;
}

export interface EventContent extends ContentBase {
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
}

export interface JobContent extends ContentBase {
  type: 'job';
  jobType: string;
  jobLocation: string;
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hour' | 'month' | 'year';
  };
  department?: string;
  experience?: string;
  requirements: string[];
  benefits?: string[];
  applicationDeadline?: string;
}

export type Content = PromotionContent | EventContent | JobContent;