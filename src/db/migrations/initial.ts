import { db } from '../../config/firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';

export async function createInitialCollections() {
  const batch = writeBatch(db);

  // Create collections with example documents
  const collections = [
    'users',
    'content',
    'notifications',
    'analytics'
  ];

  for (const collectionName of collections) {
    const collectionRef = collection(db, collectionName);
    const docs = await getDocs(collectionRef);
    
    // Only create if collection is empty
    if (docs.empty) {
      console.log(`Creating collection: ${collectionName}`);
      
      // Add a placeholder document to create the collection
      batch.set(collection(db, collectionName).doc('placeholder'), {
        _created: new Date(),
        _placeholder: true
      });
    }
  }

  // Commit the batch
  await batch.commit();
  console.log('Initial collections created successfully');
}

// Create indexes
export const requiredIndexes = [
  {
    collection: 'content',
    fields: ['userId', 'type', 'status']
  },
  {
    collection: 'notifications',
    fields: ['userId', 'read', 'createdAt']
  },
  {
    collection: 'analytics',
    fields: ['entityType', 'metric', 'timestamp']
  }
];