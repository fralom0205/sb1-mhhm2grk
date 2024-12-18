import { db } from '../config';
import { AnalyticsEntry } from '../../types/database';

interface AggregatedMetric {
  value: number;
  count: number;
}

export const analyticsRepository = {
  track: async (data: Omit<AnalyticsEntry, 'id' | 'timestamp'>): Promise<number> => {
    return await db.analytics.add({
      ...data,
      timestamp: new Date().toISOString()
    });
  },

  getMetrics: async (entityId: number, entityType: string, metric: string): Promise<AnalyticsEntry[]> => {
    return await db.analytics
      .where(['entityId', 'entityType', 'metric'])
      .equals([entityId, entityType, metric])
      .toArray();
  },

  getAggregatedMetrics: async (entityType: string, metric: string): Promise<{ value: number }[]> => {
    return await db.analytics
      .where(['entityType', 'metric'])
      .equals([entityType, metric])
      .toArray();
  }
};