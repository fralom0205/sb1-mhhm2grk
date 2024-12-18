import { Table } from 'dexie';

export interface User {
  id?: number;
  email: string;
  name: string;
  role: string;
  password: string;
  verificationToken?: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface Promotion {
  id?: number;
  userId: number;
  title: string;
  type: 'discount' | 'event' | 'offer';
  description: string;
  status: 'draft' | 'active' | 'expired';
  validityPeriod: {
    start: string;
    end: string;
  };
  targetAudience: string[];
  location: string;
  views: number;
  engagement: number;
  createdAt: string;
}

export interface ContentItem {
  id?: number;
  userId: number;
  type: 'article' | 'event' | 'promotion';
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  publishDate?: string;
  expiryDate?: string;
  views: number;
  engagement: number;
  createdAt: string;
}

export interface Notification {
  id?: number;
  userId: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AnalyticsEntry {
  id?: number;
  entityId: number;
  entityType: 'promotion' | 'content';
  metric: 'view' | 'engagement' | 'conversion';
  value: number;
  timestamp: string;
}

export interface Database {
  users: Table<User>;
  promotions: Table<Promotion>;
  content: Table<ContentItem>;
  notifications: Table<Notification>;
  analytics: Table<AnalyticsEntry>;
}

export interface DBSchema {
  [key: string]: string;
}