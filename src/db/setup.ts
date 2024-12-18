import { db } from '../config/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';

export async function setupFirestore() {
  try {
    console.log('Setting up Firestore collections...');
    const batch = writeBatch(db);

    // Define collections to create
    const collections = [
      {
        name: 'users',
        schema: {
          email: '',
          name: '',
          role: '',
          brandName: '',
          brandCategory: '',
          salesChannel: '',
          website: '',
          emailVerified: false,
          createdAt: new Date().toISOString()
        }
      },
      {
        name: 'promotions',
        schema: {
          userId: '',
          title: '',
          type: '',
          description: '',
          status: 'draft',
          validityPeriod: {
            start: '',
            end: ''
          },
          targetAudience: [],
          location: '',
          views: 0,
          engagement: 0,
          createdAt: new Date().toISOString()
        }
      },
      {
        name: 'content',
        schema: {
          userId: '',
          type: '',
          title: '',
          description: '',
          status: 'draft',
          views: 0,
          engagement: 0,
          createdAt: new Date().toISOString()
        }
      },
      {
        name: 'notifications',
        schema: {
          userId: '',
          type: 'info',
          title: '',
          message: '',
          read: false,
          createdAt: new Date().toISOString()
        }
      },
      {
        name: 'analytics',
        schema: {
          entityId: '',
          entityType: '',
          metric: '',
          value: 0,
          timestamp: new Date().toISOString()
        }
      }
    ];

    // Create collections with placeholder documents
    for (const { name, schema } of collections) {
      const collectionRef = collection(db, name);
      const placeholderDoc = doc(collectionRef, '_placeholder');
      batch.set(placeholderDoc, {
        ...schema,
        _isPlaceholder: true,
        _createdAt: new Date().toISOString()
      });
    }

    // Commit all changes
    await batch.commit();
    console.log('Firestore collections created successfully');

    // Log required indexes
    console.log('Required indexes to create in Firebase Console:');
    console.log(`
    Collection: promotions
    - Composite index on: userId ASC, createdAt DESC
    - Composite index on: status ASC, createdAt DESC

    Collection: content
    - Composite index on: userId ASC, createdAt DESC
    - Composite index on: type ASC, createdAt DESC

    Collection: notifications
    - Composite index on: userId ASC, createdAt DESC
    - Composite index on: userId ASC, read ASC, createdAt DESC

    Collection: analytics
    - Composite index on: entityType ASC, metric ASC, timestamp DESC
    `);

    return true;
  } catch (error) {
    console.error('Error setting up Firestore:', error);
    return false;
  }
}