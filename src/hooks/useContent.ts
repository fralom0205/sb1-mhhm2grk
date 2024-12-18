import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Content, ContentFilter } from '../types/content';
import { getUserContent } from '../services/content.service';

export function useContent() {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContentFilter>({});
  const { user } = useAuth();

  const loadContent = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const contentData = await getUserContent(user.id);
      let filteredContent = contentData;

      // Apply client-side filters
      if (filters.dateRange?.start || filters.dateRange?.end) {
        filteredContent = filteredContent.filter(item => {
          const itemDate = new Date(item.createdAt);
          const start = filters.dateRange?.start ? new Date(filters.dateRange.start) : null;
          const end = filters.dateRange?.end ? new Date(filters.dateRange.end) : null;
          
          if (start && end) {
            return itemDate >= start && itemDate <= end;
          } else if (start) {
            return itemDate >= start;
          } else if (end) {
            return itemDate <= end;
          }
          return true;
        });
      }

      setContent(filteredContent);
    } catch (err) {
      console.error('Content loading error:', err);
      setError('Error loading content');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, filters]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return {
    content,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: loadContent
  };
}