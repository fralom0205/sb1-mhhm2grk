import { JobService } from '../../content/job.service';
import { BaseContentService } from '../../content/base.service';
import { ApiError } from '../../../utils/apiErrors';
import { uploadContentImage } from '../../content/storage';

jest.mock('../../content/base.service');
jest.mock('../../content/storage');

describe('JobService', () => {
  let service: JobService;
  const mockUserId = 'test-user-123';
  const mockContentId = 'test-content-123';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new JobService();
  });

  describe('createJob', () => {
    it('should create job posting successfully', async () => {
      const mockCreate = jest.fn().mockResolvedValue(mockContentId);
      (uploadContentImage as jest.Mock).mockResolvedValue('cover-url');
      (BaseContentService as jest.Mock).mockImplementation(() => ({
        repository: { create: mockCreate }
      }));

      const jobData = {
        title: 'Software Engineer',
        jobType: 'full-time',
        jobLocation: 'remote',
        requirements: ['React', 'TypeScript']
      };

      const mockCoverImage = new File([''], 'cover.jpg', { type: 'image/jpeg' });

      const result = await service.createJob(mockUserId, jobData, mockCoverImage);

      expect(result).toBe(mockContentId);
      expect(uploadContentImage).toHaveBeenCalledWith(
        mockCoverImage,
        mockUserId,
        'job'
      );
      expect(mockCreate).toHaveBeenCalledWith({
        ...jobData,
        type: 'job',
        userId: mockUserId,
        status: 'draft',
        coverImage: 'cover-url',
        updatedAt: expect.any(String)
      });
    });

    it('should handle missing required fields', async () => {
      const jobData = {
        title: 'Software Engineer'
        // Missing required fields
      };

      await expect(service.createJob(mockUserId, jobData))
        .rejects
        .toThrow('Missing required job fields');
    });
  });

  describe('saveDraft', () => {
    it('should save draft successfully', async () => {
      const mockSaveDraft = jest.fn().mockResolvedValue(undefined);
      (BaseContentService as jest.Mock).mockImplementation(() => ({
        saveDraft: mockSaveDraft
      }));

      const draftData = { title: 'Draft Job' };
      await service.saveDraft(mockContentId, 2, draftData);

      expect(mockSaveDraft).toHaveBeenCalledWith(
        mockContentId,
        2,
        {
          ...draftData,
          type: 'job'
        }
      );
    });
  });

  describe('updateJob', () => {
    it('should update job posting with new image', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(undefined);
      (uploadContentImage as jest.Mock).mockResolvedValue('new-cover-url');
      (BaseContentService as jest.Mock).mockImplementation(() => ({
        repository: { update: mockUpdate }
      }));

      const updateData = {
        title: 'Senior Software Engineer',
        userId: mockUserId
      };
      const mockCoverImage = new File([''], 'new-cover.jpg', { type: 'image/jpeg' });

      await service.updateJob(mockContentId, updateData, mockCoverImage);

      expect(mockUpdate).toHaveBeenCalledWith(mockContentId, {
        ...updateData,
        coverImage: 'new-cover-url'
      });
    });
  });

  describe('publishJob', () => {
    it('should validate job posting before publishing', async () => {
      const mockFindById = jest.fn().mockResolvedValue({
        id: mockContentId,
        title: 'Software Engineer',
        description: 'Job Description',
        jobType: 'full-time',
        jobLocation: 'remote',
        requirements: ['React', 'TypeScript']
      });
      const mockUpdate = jest.fn().mockResolvedValue(undefined);

      (BaseContentService as jest.Mock).mockImplementation(() => ({
        repository: {
          findById: mockFindById,
          update: mockUpdate
        }
      }));

      await service.publishJob(mockContentId);

      expect(mockUpdate).toHaveBeenCalledWith(mockContentId, {
        status: 'published',
        publishDate: expect.any(String)
      });
    });

    it('should reject invalid job posting', async () => {
      const mockFindById = jest.fn().mockResolvedValue({
        id: mockContentId,
        title: 'Software Engineer'
        // Missing required fields
      });

      (BaseContentService as jest.Mock).mockImplementation(() => ({
        repository: { findById: mockFindById }
      }));

      await expect(service.publishJob(mockContentId))
        .rejects
        .toThrow('Missing required fields for publishing');
    });
  });
});