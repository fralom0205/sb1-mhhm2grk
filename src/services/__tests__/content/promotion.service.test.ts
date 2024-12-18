import { PromotionService } from '../../content/promotion.service';
import { BaseContentService } from '../../content/base.service';
import { ApiError } from '../../../utils/apiErrors';

jest.mock('../../content/base.service');

describe('PromotionService', () => {
  let service: PromotionService;
  const mockUserId = 'test-user-123';
  const mockContentId = 'test-content-123';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PromotionService();
  });

  describe('createPromotion', () => {
    it('should create promotion with images successfully', async () => {
      const mockUploadImages = jest.fn().mockResolvedValue({
        coverImage: 'cover-url',
        sharingImage: 'sharing-url'
      });
      const mockCreate = jest.fn().mockResolvedValue(mockContentId);

      (BaseContentService as jest.Mock).mockImplementation(() => ({
        uploadImages: mockUploadImages,
        create: mockCreate
      }));

      const promotionData = {
        title: 'Test Promotion',
        promotionType: 'discount',
        location: 'online'
      };

      const mockCoverImage = new File([''], 'cover.jpg', { type: 'image/jpeg' });
      const mockSharingImage = new File([''], 'sharing.jpg', { type: 'image/jpeg' });

      const result = await service.createPromotion(
        mockUserId,
        promotionData,
        mockCoverImage,
        mockSharingImage
      );

      expect(result).toBe(mockContentId);
      expect(mockUploadImages).toHaveBeenCalledWith(
        mockUserId,
        'promotion',
        mockCoverImage,
        mockSharingImage
      );
      expect(mockCreate).toHaveBeenCalledWith({
        ...promotionData,
        type: 'promotion',
        userId: mockUserId,
        status: 'draft',
        coverImage: 'cover-url',
        sharingImage: 'sharing-url',
        updatedAt: expect.any(String)
      });
    });

    it('should handle creation errors', async () => {
      const mockError = new Error('Upload failed');
      (BaseContentService as jest.Mock).mockImplementation(() => ({
        uploadImages: jest.fn().mockRejectedValue(mockError)
      }));

      await expect(service.createPromotion(mockUserId, {}))
        .rejects
        .toThrow('Failed to create promotion');
    });
  });

  describe('updatePromotion', () => {
    it('should update promotion with new images', async () => {
      const mockUploadImage = jest.fn()
        .mockResolvedValueOnce('new-cover-url')
        .mockResolvedValueOnce('new-sharing-url');
      const mockUpdate = jest.fn().mockResolvedValue(undefined);

      (BaseContentService as jest.Mock).mockImplementation(() => ({
        uploadContentImage: mockUploadImage,
        update: mockUpdate
      }));

      const updateData = { title: 'Updated Promotion' };
      const mockCoverImage = new File([''], 'new-cover.jpg', { type: 'image/jpeg' });

      await service.updatePromotion(mockContentId, updateData, mockCoverImage);

      expect(mockUpdate).toHaveBeenCalledWith(mockContentId, {
        ...updateData,
        coverImage: 'new-cover-url'
      });
    });

    it('should handle update errors', async () => {
      const mockError = new Error('Update failed');
      (BaseContentService as jest.Mock).mockImplementation(() => ({
        update: jest.fn().mockRejectedValue(mockError)
      }));

      await expect(service.updatePromotion(mockContentId, {}))
        .rejects
        .toThrow('Failed to update promotion');
    });
  });

  describe('publishPromotion', () => {
    it('should validate promotion before publishing', async () => {
      const mockContent = {
        id: mockContentId,
        title: 'Test Promotion',
        description: 'Test Description',
        promotionType: 'discount',
        location: 'online',
        validityPeriod: {
          start: new Date(Date.now() + 86400000).toISOString(),
          end: new Date(Date.now() + 172800000).toISOString()
        }
      };

      const mockFindById = jest.fn().mockResolvedValue(mockContent);
      const mockUpdate = jest.fn().mockResolvedValue(undefined);

      (BaseContentService as jest.Mock).mockImplementation(() => ({
        findById: mockFindById,
        update: mockUpdate
      }));

      await service.publishPromotion(mockContentId);

      expect(mockUpdate).toHaveBeenCalledWith(mockContentId, {
        status: 'published',
        publishDate: expect.any(String)
      });
    });

    it('should reject invalid validity period', async () => {
      const mockContent = {
        id: mockContentId,
        title: 'Test Promotion',
        validityPeriod: {
          start: new Date().toISOString(),
          end: new Date(Date.now() - 86400000).toISOString()
        }
      };

      (BaseContentService as jest.Mock).mockImplementation(() => ({
        findById: jest.fn().mockResolvedValue(mockContent)
      }));

      await expect(service.publishPromotion(mockContentId))
        .rejects
        .toThrow('End date must be in the future');
    });
  });
});