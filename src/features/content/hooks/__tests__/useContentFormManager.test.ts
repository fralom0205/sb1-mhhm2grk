import { renderHook, act } from '@testing-library/react';
import { useContentFormManager } from '../useContentFormManager';
import { BaseContentService } from '../../../../services/content/base.service';
import { validateContentFields } from '../../../../services/content/validation';

jest.mock('../../../../services/content/base.service');
jest.mock('../../../../services/content/validation');

describe('useContentFormManager', () => {
  const mockUserId = 'test-user-123';
  const mockContentId = 'test-content-123';
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (validateContentFields as jest.Mock).mockReturnValue([]);
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => 
      useContentFormManager('promotion', mockUserId, mockNavigate)
    );

    expect(result.current).toEqual(expect.objectContaining({
      step: 1,
      formData: expect.objectContaining({
        type: 'promotion'
      }),
      error: null,
      isSubmitting: false,
      isDirty: false
    }));
  });

  it('initializes content on mount', async () => {
    const mockInitialize = jest.fn().mockResolvedValue(mockContentId);
    (BaseContentService as jest.Mock).mockImplementation(() => ({
      initializeContent: mockInitialize
    }));

    const { result } = renderHook(() => 
      useContentFormManager('promotion', mockUserId, mockNavigate)
    );

    await act(async () => {
      await result.current.initialize();
    });

    expect(mockInitialize).toHaveBeenCalledWith(mockUserId, 'promotion');
  });

  it('handles next step with validation', async () => {
    const mockSaveDraft = jest.fn().mockResolvedValue(undefined);
    (BaseContentService as jest.Mock).mockImplementation(() => ({
      saveDraft: mockSaveDraft
    }));

    const { result } = renderHook(() => 
      useContentFormManager('promotion', mockUserId, mockNavigate)
    );

    await act(async () => {
      await result.current.handleNext({ title: 'Test Content' });
    });

    expect(validateContentFields).toHaveBeenCalled();
    expect(result.current.step).toBe(2);
  });

  it('handles publish with validation', async () => {
    const mockPublish = jest.fn().mockResolvedValue(undefined);
    (BaseContentService as jest.Mock).mockImplementation(() => ({
      publishContent: mockPublish
    }));

    const { result } = renderHook(() => 
      useContentFormManager('promotion', mockUserId, mockNavigate)
    );

    await act(async () => {
      await result.current.publish();
    });

    expect(validateContentFields).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(
      '/dashboard/content',
      expect.objectContaining({
        state: { message: 'Content published successfully', type: 'success' }
      })
    );
  });

  it('handles validation errors during publish', async () => {
    (validateContentFields as jest.Mock).mockReturnValue(['Required field missing']);

    const { result } = renderHook(() => 
      useContentFormManager('promotion', mockUserId, mockNavigate)
    );

    await act(async () => {
      await result.current.publish();
    });

    expect(result.current.error).toBe('Required field missing');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});