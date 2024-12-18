import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useContentForm } from '../useContentForm';
import { JobService, PromotionService, EventService } from '../../../services/content';
import { useAuth } from '../../auth/hooks/useAuth';

// Mock dependencies
jest.mock('react-router-dom');
jest.mock('../../../services/content');
jest.mock('../../auth/hooks/useAuth');

describe('useContentForm', () => {
  const mockUser = { id: 'test-user-123' };
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useContentForm('promotion'));

    expect(result.current).toEqual(expect.objectContaining({
      step: 1,
      formData: expect.objectContaining({
        type: 'promotion',
        status: 'draft',
        views: 0,
        engagement: 0
      }),
      error: null,
      isSubmitting: false
    }));
  });

  it('should handle next step correctly', async () => {
    const { result } = renderHook(() => useContentForm('promotion'));

    const stepData = {
      title: 'Test Promotion',
      promotionType: 'discount'
    };

    await act(async () => {
      result.current.handleNext(stepData);
    });

    expect(result.current.step).toBe(2);
    expect(result.current.formData).toEqual(
      expect.objectContaining(stepData)
    );
    expect(result.current.error).toBeNull();
  });

  it('should handle back step correctly', () => {
    const { result } = renderHook(() => useContentForm('promotion'));

    act(() => {
      result.current.handleNext({ title: 'Test' });
    });

    expect(result.current.step).toBe(2);

    act(() => {
      result.current.handleBack();
    });

    expect(result.current.step).toBe(1);
  });

  it('should handle save draft correctly', async () => {
    const mockCreate = jest.fn().mockResolvedValue('test-id');
    (PromotionService as jest.Mock).mockImplementation(() => ({
      create: mockCreate
    }));

    const { result } = renderHook(() => useContentForm('promotion'));

    await act(async () => {
      await result.current.handleSaveDraft();
    });

    expect(mockCreate).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(
      '/dashboard/content',
      expect.objectContaining({
        state: { message: 'Bozza salvata con successo', type: 'success' }
      })
    );
  });

  it('should handle publish correctly', async () => {
    const mockCreate = jest.fn().mockResolvedValue('test-id');
    (PromotionService as jest.Mock).mockImplementation(() => ({
      create: mockCreate
    }));

    const { result } = renderHook(() => useContentForm('promotion'));

    await act(async () => {
      await result.current.handlePublish();
    });

    expect(mockCreate).toHaveBeenCalledWith(
      mockUser.id,
      expect.objectContaining({ status: 'published' })
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      '/dashboard/content',
      expect.objectContaining({
        state: { message: 'Contenuto pubblicato con successo' }
      })
    );
  });

  it('should handle errors during save', async () => {
    const mockError = new Error('Save failed');
    (PromotionService as jest.Mock).mockImplementation(() => ({
      create: jest.fn().mockRejectedValue(mockError)
    }));

    const { result } = renderHook(() => useContentForm('promotion'));

    await act(async () => {
      await result.current.handleSaveDraft();
    });

    expect(result.current.error).toBe('Error saving draft');
  });

  it('should handle errors during publish', async () => {
    const mockError = new Error('Publish failed');
    (PromotionService as jest.Mock).mockImplementation(() => ({
      create: jest.fn().mockRejectedValue(mockError)
    }));

    const { result } = renderHook(() => useContentForm('promotion'));

    await act(async () => {
      await result.current.handlePublish();
    });

    expect(result.current.error).toBe('Error publishing content');
  });

  it('should use correct service based on content type', () => {
    renderHook(() => useContentForm('job'));
    expect(JobService).toHaveBeenCalled();

    renderHook(() => useContentForm('promotion'));
    expect(PromotionService).toHaveBeenCalled();

    renderHook(() => useContentForm('event'));
    expect(EventService).toHaveBeenCalled();
  });
});