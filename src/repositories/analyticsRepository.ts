import { doc, collection, query, where, getDocs, setDoc, runTransaction } from 'firebase/firestore';
import { db } from '../db/firestore';
import { AnalyticsEntry } from '../types/database';

export const analyticsCollection = collection(db, 'analytics');

export const analyticsRepository = {
  track: async (data: Omit<AnalyticsEntry, 'id' | 'timestamp'>) => {
    const docRef = doc(analyticsCollection);
    await setDoc(docRef, {
      ...data,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  },

  incrementMetric: async (entityId: string, entityType: string, metric: string, value = 1) => {
    const q = query(
      analyticsCollection,
      where('entityId', '==', entityId),
      where('entityType', '==', entityType),
      where('metric', '==', metric)
    );
    
    await runTransaction(db, async (transaction) => {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        // Create new metric
        const docRef = doc(analyticsCollection);
        transaction.set(docRef, {
          entityId,
          entityType,
          metric,
          value,
          timestamp: new Date().toISOString()
        });
      } else {
        // Update existing metric
        const docRef = snapshot.docs[0].ref;
        const currentValue = snapshot.docs[0].data().value;
        transaction.update(docRef, { 
          value: currentValue + value,
          timestamp: new Date().toISOString()
        });
      }
    });
  },

  getMetrics: async (entityId: string, entityType: string, metric: string) => {
    const q = query(
      analyticsCollection,
      where('entityId', '==', entityId),
      where('entityType', '==', entityType),
      where('metric', '==', metric)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getAggregatedMetrics: async (entityType: string, metric: string) => {
    const q = query(
      analyticsCollection,
      where('entityType', '==', entityType),
      where('metric', '==', metric)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};