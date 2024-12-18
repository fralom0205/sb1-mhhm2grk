import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { ContentItem } from '../types/dashboardTypes';

export function useContent() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadContent = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const contentRef = collection(db, 'content');
      const contentQuery = query(
        contentRef,
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc'),
        limit(3) // Only get the 3 most recent items
      );
      
      const snapshot = await getDocs(contentQuery);
      const contentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContentItem[];

      setContent(contentData);
    } catch (err) {
      console.error('Content loading error:', err);
      setError('Errore nel caricamento dei contenuti');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return {
    content,
    isLoading,
    error,
    refresh: loadContent
  };
}