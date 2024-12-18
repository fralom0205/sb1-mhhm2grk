import { db } from '../config/firebase';

export async function createRequiredIndexes() {
  // Content collection indexes
  await db.collection('content').doc('_indexes').set({
    byUserAndType: {
      fields: ['userId', 'type', 'createdAt'],
      order: ['desc']
    },
    byUserAndStatus: {
      fields: ['userId', 'status', 'createdAt'],
      order: ['desc']
    }
  });

  // Analytics collection indexes
  await db.collection('analytics').doc('_indexes').set({
    byEntityAndMetric: {
      fields: ['entityId', 'metric', 'timestamp'],
      order: ['desc']
    }
  });

  // Notifications collection indexes
  await db.collection('notifications').doc('_indexes').set({
    byUserAndRead: {
      fields: ['userId', 'read', 'createdAt'],
      order: ['desc']
    }
  });
}