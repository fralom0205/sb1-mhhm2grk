import { BaseContentService } from './base.service';
import { JobContent } from '../../types/content';
import { ApiError } from '../../utils/apiErrors';
import { uploadContentImage } from './storage';

export class JobService extends BaseContentService {
  constructor() {
    super();
  }

  async saveDraft(
    contentId: string,
    step: number,
    data: Partial<Content>
  ): Promise<void> {
    try {
      await super.saveDraft(contentId, step, {
        ...data,
        type: 'job'
      });
    } catch (error) {
      console.error('Error saving job draft:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to save job draft', 500);
    }
  }

  async createJob(
    userId: string,
    data: Omit<JobContent, 'id' | 'createdAt' | 'views' | 'engagement' | 'type'>,
    coverImage?: File
  ): Promise<string> {
    try {
      // Validate required fields
      if (!data.jobType || !data.jobLocation || !data.requirements) {
        throw new ApiError('Missing required job fields', 400);
      }

      let coverImageUrl;
      if (coverImage) {
        coverImageUrl = await uploadContentImage(coverImage, userId, 'job');
      }

      const jobData = {
        ...data,
        type: 'job',
        userId,
        status: data.status || 'draft',
        coverImage: coverImageUrl,
        updatedAt: new Date().toISOString()
      };

      return await this.repository.create(jobData);
    } catch (error) {
      console.error('Error in job service:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create job posting', 500);
    }
  }

  async updateJob(
    id: string,
    data: Partial<JobContent>,
    coverImage?: File
  ): Promise<void> {
    try {
      let updates = { ...data };

      if (coverImage) {
        const imageUrl = await uploadContentImage(coverImage, data.userId!, 'job');
        updates.coverImage = imageUrl;
      }

      await this.repository.update(id, updates);
    } catch (error) {
      console.error('Error updating job:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update job posting', 500);
    }
  }

  async publishJob(id: string): Promise<void> {
    try {
      const job = await this.repository.findById(id);
      if (!job) {
        throw new ApiError('Job posting not found', 404);
      }

      // Validate required fields before publishing
      if (!job.title || !job.description || !job.jobType || 
          !job.jobLocation || !job.requirements) {
        throw new ApiError('Missing required fields for publishing', 400);
      }

      await this.repository.update(id, {
        status: 'published',
        publishDate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error publishing job:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to publish job posting', 500);
    }
  }
}