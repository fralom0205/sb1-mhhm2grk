import { renderHook, act } from '@testing-library/react';
import { useContentFormManager } from '../useContentFormManager';
import { contentRepository } from '../../repositories/contentRepository';
import { validateContent, validateStep } from '../../utils/contentValidation';

jest.mock('../../repositories/contentRepository');
jest.mock('../../utils/contentValidation');

describe('useContentFormManager', () => {
  const mockNavigate = jest.fn();
  const mockUserId = 'test-user-123';
  const mockContentId = 'test-content-123';

  beforeEach(() => {
    jest.clearAllMocks();
    (validateStep as jest.Mock).mockReturnValue({ isValid: true, errors: {} });
    (validateContent as jest.Mock).mockReturnValue({ isValid: true, errors: {} });
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() =>
      useContentFormManager('promotion', mockUserId, mockNavigate)
    );

    expect(result.current).toEqual(expect.objectContaining({
      step: 1,
      formData: expect.objectContaining({
        type: 'promotion',
        userId: mockUserId,
        status: 'draft'
      }),
      error: null,
      isSubmitting: false,
      isDirty: false
    }));
  });

  it('creates initial content on mount', async () => {
    const mockCreate = jest.fn().mockResolvedValue(mockContentId);
    (contentRepository.create as jest.Mock).mockImplementation(mockCreate);

    renderHook(() => useContentFormManager('promotion', mockUserId, mockNavigate));

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      type: 'promotion',
      userId: mockUserId,
      status: 'draft'
    }));
  });

  it('handles next step with validation', async () => {
    const mockUpdate = jest.fn().mockResolvedValue(undefined);
    (contentRepository.update as jest.Mock).mockImplementation(mockUpdate);

    const { result } = renderHook(() =>
      useContentFormManager('promotion', mockUserId, mockNavigate)
    );

    await act(async () => {
      await result.current.handleNext({ title: 'Test Content' });
    });

    expect(validateStep).toHaveBeenCalled();
    expect(result.current.step).toBe(2);
    expect(result.current.formData.title).toBe('Test Content');
  });

  it('handles validation errors on next step', async () => {
    (validateStep as jest.Mock).mockReturnValue({
      isValid: false,
      errors: { title: 'Title is required' }
    });

    const { result } = renderHook(() =>
      useContentFormManager('promotion', mockUserId, mockNavigate)
    );

    await act(async () => {
      await result.current.handleNext({});
    });

    expect(result.current.error).toBe('Title is required');
    expect(result.current.step).toBe(1);
  });

  it('saves draft successfully', async () => {
    const mockUpdate = jest.fn().mockResolvedValue(undefined);
    (contentRepository.update as jest.Mock).mockImplementation(mockUpdate);

    const { result } = renderHook(() =>
      useContentFormManager('promotion', mockUserId, mockNavigate)
    );

    // Set contentId and make form dirty
    await act(async () => {
      await result.current.handleNext({ title: 'Test Content' });
    });

    await act(async () => {
      await result.current.saveDraft();
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        status: 'draft',
        title: 'Test Content'
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      '/dashboard/content',
      expect.objectContaining({
        state: expect.objectContaining({
          message: 'Draft saved successfully'
        })
      })
    );
  });

  it('publishes content successfully', async () => {
    const mockUpdate = jest.fn().mockResolvedValue(undefined);
    (contentRepository.update as jest.Mock).mockImplementation(mockUpdate);

    const { result } = renderHook(() =>
      useContentFormManager('promotion', mockUserId, mockNavigate)
    );

    await act(async () => {
      await result.current.publish();
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        status: 'published',
        publishDate: expect.any(String)
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      '/dashboard/content',
      expect.objectContaining({
        state: expect.objectContaining({
          message: 'Content published successfully'
        })
      })
    );
  });
});