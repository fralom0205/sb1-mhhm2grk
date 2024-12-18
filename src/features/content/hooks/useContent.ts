import { useState, useEffect } from 'react';
import { Content } from '../../../types/content';
import { BaseContentService } from '../../../services/content/base.service';

export const useContent = (contentId: string) => {
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const service = new BaseContentService();
        const result = await service.getContent(contentId);
        setContent(result);
      } catch (error) {
        console.error('Error fetching content:', error);
        setContent(null);
      }
    };

    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  return content;
};