import { ContentType } from './contentTypes';

export interface ContentFilter {
  type?: ContentType;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}