export type ContentType = 'article' | 'event' | 'promotion';

export interface NewContentFormData {
  // Step 1 - Basic Info
  type: ContentType;
  title: string;
  description: string;
  thumbnail?: File;

  // Step 2 - Details
  content: string;
  tags: string[];
  category?: string;
  
  // Step 3 - Publishing
  status: 'draft' | 'published';
  publishDate?: string;
  expiryDate?: string;
  targetAudience: string[];
}

export interface ContentStepProps {
  data: Partial<NewContentFormData>;
  onNext: (data: Partial<NewContentFormData>) => void;
  onBack?: () => void;
  onCancel?: () => void;
}

export interface ProgressStep {
  label: string;
  completed: boolean;
  current: boolean;
}