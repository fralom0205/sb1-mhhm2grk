import { DBSchema } from '../types/database';

export const dbSchema: DBSchema = {
  content: '++id, userId, type, title, status, step, createdAt, [userId+type], [status+type], [userId+step], [userId+targetAudience]',
  analytics: '++id, entityId, entityType, metric, timestamp, [entityType+metric]',
  notifications: '++id, userId, type, read, createdAt, [userId+read]'
};

export const dbVersion = 1;