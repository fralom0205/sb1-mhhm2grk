import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Content } from '../types/contentTypes';

export async function createContent(data: Partial<Content>): Promise<string> {
  const contentRef = collection(db, 'content');
  const docRef = await addDoc(contentRef, {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    promotionType: data.promotionType,
    location: data.location,
  });
  return docRef.id;
}

export async function saveDraft(data: Partial<Content>): Promise<string> {
  return createContent({
    ...data,
    status: 'draft'
  });
}

export async function getContentById(id: string): Promise<Content | null> {
  const docRef = doc(db, 'content', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Content : null;
}

export async function getUserContent(userId: string): Promise<Content[]> {
  const contentRef = collection(db, 'content');
  const q = query(
    contentRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Content[];
}

export async function updateContent(id: string, data: Partial<Content>): Promise<void> {
  const docRef = doc(db, 'content', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}