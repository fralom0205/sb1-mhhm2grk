import { Content, ContentType } from '../../types/content';

export interface ContentFilters {
  type?: ContentType;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
}