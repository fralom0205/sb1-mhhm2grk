import { BaseContentService } from '../../content/base.service';
import { ContentRepository } from '../../../repositories/content/content.repository';
import { Content, ContentType } from '../../../types/content';

jest.mock('../../../repositories/content/content.repository');

describe('BaseContentService', () => {
  let service: BaseContentService;
  const mockUserId = 'test-user-123';
  const mockContentId = 'test-content-123';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BaseContentService();
  });

  describe('initializeContent', () => {
    it('should create new content successfully', async () => {
      const mockCreate = jest.fn().mockResolvedValue(mockContentId);
      (ContentRepository as jest.Mock).mockImplementation(() => ({
        create: mockCreate
      }));

      const result = await service.initializeContent(mockUserId, 'promotion' as ContentType);

      expect(result).toBe(mockContentId);
      expect(mockCreate).toHaveBeenCalledWith({
        type: 'promotion',
        userId: mockUserId,
        title: 'New Content',
        status: 'draft',
        step: 1,
        views: 0,
        engagement: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('should handle initialization errors', async () => {
      const mockCreate = jest.fn().mockRejectedValue(new Error('Database error'));
      (ContentRepository as jest.Mock).mockImplementation(() => ({
        create: mockCreate
      }));

      await expect(service.initializeContent(mockUserId, 'promotion' as ContentType))
        .rejects
        .toThrow('Failed to initialize content. Please try again.');
    });
  });

  describe('saveDraft', () => {
    it('should save draft successfully', async () => {
      const mockFindById = jest.fn().mockResolvedValue({ id: mockContentId });
      const mockUpdate = jest.fn().mockResolvedValue(undefined);

      (ContentRepository as jest.Mock).mockImplementation(() => ({
        findById: mockFindById,
        update: mockUpdate
      }));

      const draftData = { title: 'Draft Title' };
      await service.saveDraft(mockContentId, 2, draftData);

      expect(mockUpdate).toHaveBeenCalledWith(mockContentId, {
        ...draftData,
        status: 'draft',
        step: 2,
        updatedAt: expect.any(String)
      });
    });

    it('should handle save errors', async () => {
      const mockFindById = jest.fn().mockResolvedValue({ id: mockContentId });
      const mockUpdate = jest.fn().mockRejectedValue(new Error('Save failed'));

      (ContentRepository as jest.Mock).mockImplementation(() => ({
        findById: mockFindById,
        update: mockUpdate
      }));

      await expect(service.saveDraft(mockContentId, 2, {}))
        .rejects
        .toThrow('Failed to save draft. Please try again.');
    });
  });

  describe('getContent', () => {
    it('should retrieve content successfully', async () => {
      const mockContent = {
        id: mockContentId,
        title: 'Test Content'
      };
      const mockFindById = jest.fn().mockResolvedValue(mockContent);

      (ContentRepository as jest.Mock).mockImplementation(() => ({
        findById: mockFindById
      }));

      const result = await service.getContent(mockContentId);

      expect(result).toEqual(mockContent);
      expect(mockFindById).toHaveBeenCalledWith(mockContentId);
    });

    it('should handle not found content', async () => {
      const mockFindById = jest.fn().mockResolvedValue(null);

      (ContentRepository as jest.Mock).mockImplementation(() => ({
        findById: mockFindById
      }));

      await expect(service.getContent(mockContentId))
        .rejects
        .toThrow('Content not found');
    });
  });

  describe('publishContent', () => {
    it('should publish content successfully', async () => {
      const mockContent = {
        id: mockContentId,
        title: 'Test Content',
        description: 'Test Description'
      };
      const mockFindById = jest.fn().mockResolvedValue(mockContent);
      const mockUpdate = jest.fn().mockResolvedValue(undefined);

      (ContentRepository as jest.Mock).mockImplementation(() => ({
        findById: mockFindById,
        update: mockUpdate
      }));

      await service.publishContent(mockContentId);

      expect(mockUpdate).toHaveBeenCalledWith(mockContentId, {
        status: 'published',
        publishDate: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('should validate required fields before publishing', async () => {
      const mockContent = {
        id: mockContentId,
        title: 'Test Content'
        // Missing description
      };

      (ContentRepository as jest.Mock).mockImplementation(() => ({
        findById: jest.fn().mockResolvedValue(mockContent)
      }));

      await expect(service.publishContent(mockContentId))
        .rejects
        .toThrow('Missing required fields for publishing');
    });

    it('should handle publish errors', async () => {
      const mockContent = {
        id: mockContentId,
        title: 'Test Content',
        description: 'Test Description'
      };
      const mockFindById = jest.fn().mockResolvedValue(mockContent);
      const mockUpdate = jest.fn().mockRejectedValue(new Error('Publish failed'));

      (ContentRepository as jest.Mock).mockImplementation(() => ({
        findById: mockFindById,
        update: mockUpdate
      }));

      await expect(service.publishContent(mockContentId))
        .rejects
        .toThrow('Failed to publish content. Please try again.');
    });
  });
});