import { ContentRepository } from '../../repositories/content/content.repository';
import { Content, ContentType } from '../../types/content';
import { ApiError } from '../../utils/apiErrors';
import { validateContentFields } from './validation';

export class BaseContentService {
  protected repository: ContentRepository;

  constructor() {
    this.repository = new ContentRepository();
  }

  async initializeContent(userId: string, type: ContentType): Promise<string> {
    try {
      // Create new content
      return await this.repository.create({
        type,
        userId,
        title: '',
        description: '',
        status: 'draft',
        step: 1,
        views: 0,
        engagement: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('[BaseContentService] Error creating content:', error);
      throw new ApiError('Failed to initialize content. Please try again.', 500);
    }
  }

  async saveDraft(contentId: string, step: number, data: Partial<Content>): Promise<void> {
    try {
      const content = await this.repository.findById(contentId);
      if (!content) {
        throw new ApiError('Content not found', 404);
      }

      await this.repository.update(contentId, {
        ...data,
        status: 'draft',
        step,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('[BaseContentService] Error saving draft:', error);
      throw new ApiError('Failed to save draft. Please try again.', 500);
    }
  }

  async publishContent(contentId: string): Promise<void> {
    try {
      const content = await this.repository.findById(contentId);
      if (!content) {
        throw new ApiError('Content not found', 404);
      }

      // Validate content before publishing
      const errors = validateContentFields(content.type, content);
      if (errors.length > 0) {
        throw new ApiError(errors[0], 400);
      }

      await this.repository.update(contentId, {
        status: 'published',
        publishDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('[BaseContentService] Error publishing content:', error);
      throw error instanceof ApiError ? error : new ApiError('Failed to publish content', 500);
    }
  }
}