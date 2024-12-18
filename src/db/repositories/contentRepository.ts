import { db } from '../config';
import { ContentItem } from '../../types/database';

export const contentRepository = {
  create: async (data: Omit<ContentItem, 'id' | 'createdAt' | 'views' | 'engagement'>): Promise<number> => {
    return await db.content.add({
      ...data,
      views: 0,
      engagement: 0,
      createdAt: new Date().toISOString()
    });
  },

  findById: async (id: number): Promise<ContentItem | undefined> => {
    return await db.content.get(id);
  },

  findByUser: async (userId: number): Promise<ContentItem[]> => {
    return await db.content
      .where('userId').equals(userId)
      .reverse()
      .sortBy('createdAt');
  },

  findByStatus: async (status: string): Promise<ContentItem[]> => {
    return await db.content
      .where('status').equals(status)
      .reverse()
      .sortBy('createdAt');
  },

  update: async (id: number, data: Partial<ContentItem>): Promise<void> => {
    await db.content.update(id, data);
  },

  incrementViews: async (id: number): Promise<void> => {
    const content = await db.content.get(id);
    if (content) {
      await db.content.update(id, { views: content.views + 1 });
    }
  },

  updateEngagement: async (id: number, engagement: number): Promise<void> => {
    await db.content.update(id, { engagement });
  },

  delete: async (id: number): Promise<void> => {
    await db.content.delete(id);
  }
};