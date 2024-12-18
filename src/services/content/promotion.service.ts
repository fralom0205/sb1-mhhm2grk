import { BaseContentService } from './base.service';
import { PromotionContent } from '../../types/content';
import { ApiError } from '../../utils/apiErrors';

import { uploadContentImage } from './storage';

export class PromotionService extends BaseContentService {
  constructor() { super(); }

  async createPromotion(
    userId: string,
    data: Omit<PromotionContent, 'id' | 'createdAt' | 'views' | 'engagement' | 'type'>,
    coverImage?: File,
    sharingImage?: File
  ): Promise<string> {
    try {
      let coverImageUrl;
      let sharingImageUrl;

      if (coverImage) {
        coverImageUrl = await uploadContentImage(coverImage, userId, 'promotion-cover');
      }
      if (sharingImage) {
        sharingImageUrl = await uploadContentImage(sharingImage, userId, 'promotion-sharing');
      }

      const promotionData: Omit<PromotionContent, 'id' | 'createdAt' | 'views' | 'engagement'> = {
        ...data,
        type: 'promotion',
        userId,
        coverImage: coverImageUrl,
        sharingImage: sharingImageUrl,
        status: data.status || 'draft',
        updatedAt: new Date().toISOString()
      };

      return this.repository.create(promotionData);
    } catch (error) {
      console.error('Error in promotion service:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create promotion', 500);
    }
  }

  async updatePromotion(
    id: string,
    data: Partial<PromotionContent>,
    coverImage?: File,
    sharingImage?: File
  ): Promise<void> {
    try {
      let updates = { ...data };

      if (coverImage) {
        updates.coverImage = await uploadContentImage(coverImage, data.userId!, 'promotion-cover');
      }

      if (sharingImage) {
        updates.sharingImage = await uploadContentImage(sharingImage, data.userId!, 'promotion-sharing');
      }

      await this.repository.updatePromotion(id, updates);
    } catch (error) {
      console.error('Error updating promotion:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update promotion', 500);
    }
  }

  async publishPromotion(id: string): Promise<void> {
    try {
      const promotion = await this.repository.findById(id);
      if (!promotion) {
        throw new ApiError('Promotion not found', 404);
      }

      // Validate required fields before publishing
      if (!promotion.title || !promotion.description || !promotion.promotionType || 
          !promotion.location || !promotion.validityPeriod) {
        throw new ApiError('Missing required fields for publishing', 400);
      }

      // Validate validity period
      const now = new Date();
      const startDate = new Date(promotion.validityPeriod.start);
      const endDate = new Date(promotion.validityPeriod.end);

      if (endDate <= startDate) {
        throw new ApiError('End date must be after start date', 400);
      }

      if (endDate <= now) {
        throw new ApiError('End date must be in the future', 400);
      }

      await this.repository.updatePromotion(id, {
        status: 'published',
        publishDate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error publishing promotion:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to publish promotion', 500);
    }
  }
}