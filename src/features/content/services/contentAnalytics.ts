import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export async function trackContentView(contentId: string) {
  await addDoc(collection(db, 'analytics'), {
    entityId: contentId,
    entityType: 'content',
    metric: 'view',
    value: 1,
    timestamp: new Date().toISOString()
  });
}

export async function trackContentEngagement(contentId: string, value: number) {
  await addDoc(collection(db, 'analytics'), {
    entityId: contentId,
    entityType: 'content',
    metric: 'engagement',
    value,
    timestamp: new Date().toISOString()
  });
}