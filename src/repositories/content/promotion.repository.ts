import { BaseContentRepository } from './base.repository';
import { PromotionContent } from '../../types/content';
import { ApiError } from '../../utils/apiErrors';

export class PromotionRepository extends BaseContentRepository {
  constructor() {
    super('content');
  }

  async createPromotion(data: Omit<PromotionContent, 'id' | 'createdAt' | 'views' | 'engagement'>): Promise<string> {
    try {
      // Validate promotion-specific fields
      if (!data.promotionType || !data.location || !data.validityPeriod) {
        throw new ApiError('Missing required promotion fields', 400);
      }

      if (!data.validityPeriod.start || !data.validityPeriod.end) {
        throw new ApiError('Validity period must include start and end dates', 400);
      }

      return this.create({
        ...data,
        type: 'promotion',
        status: data.status || 'draft'
      });
    } catch (error) {
      console.error('Error creating promotion:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create promotion', 500);
    }
  }

  async updatePromotion(id: string, data: Partial<PromotionContent>): Promise<void> {
    try {
      // Validate promotion-specific fields if they're being updated
      if (data.validityPeriod) {
        if (!data.validityPeriod.start || !data.validityPeriod.end) {
          throw new ApiError('Validity period must include start and end dates', 400);
        }
      }

      if (data.targetAudience && !Array.isArray(data.targetAudience)) {
        throw new ApiError('Target audience must be an array', 400);
      }

      await this.update(id, data);
    } catch (error) {
      console.error('Error updating promotion:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update promotion', 500);
    }
  }
}