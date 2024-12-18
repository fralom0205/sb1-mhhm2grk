import { BaseContentRepository } from './base.repository';
import { JobContent } from '../../types/content';
import { ApiError } from '../../utils/apiErrors';

export class JobRepository extends BaseContentRepository {
  constructor() {
    super('content');
  }

  async createJob(data: Omit<JobContent, 'id' | 'createdAt' | 'views' | 'engagement'>): Promise<string> {
    try {
      // Ensure job-specific fields are present
      if (!data.jobType || !data.jobLocation || !data.requirements) {
        throw new ApiError('Missing required job fields', 400);
      }

      return this.create({
        ...data,
        type: 'job',
        status: data.status || 'draft'
      });
    } catch (error) {
      console.error('Error creating job:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create job posting', 500);
    }
  }

  async updateJob(id: string, data: Partial<JobContent>): Promise<void> {
    try {
      // Validate job-specific fields if they're being updated
      if (data.jobType || data.jobLocation || data.requirements) {
        if (data.requirements && !Array.isArray(data.requirements)) {
          throw new ApiError('Requirements must be an array', 400);
        }
      }

      await this.update(id, data);
    } catch (error) {
      console.error('Error updating job:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update job posting', 500);
    }
  }
}