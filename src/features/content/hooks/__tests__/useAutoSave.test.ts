import { renderHook } from '@testing-library/react';
import { useAutoSave } from '../useAutoSave';
import { contentRepository } from '../../../repositories/contentRepository';
import { useAuth } from '../../auth/hooks/useAuth';

// Mock dependencies
jest.mock('../../../repositories/contentRepository');
jest.mock('../../auth/hooks/useAuth');

describe('useAutoSave', () => {
  const mockUser = { id: 'test-user-123' };
  const mockFormData = {
    type: 'promotion',
    title: 'Test Content',
    description: 'Test Description'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not save if user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    renderHook(() => useAutoSave(mockFormData, true));
    jest.advanceTimersByTime(3000);

    expect(contentRepository.create).not.toHaveBeenCalled();
    expect(contentRepository.update).not.toHaveBeenCalled();
  });

  it('should not save if content is not dirty', () => {
    renderHook(() => useAutoSave(mockFormData, false));
    jest.advanceTimersByTime(3000);

    expect(contentRepository.create).not.toHaveBeenCalled();
    expect(contentRepository.update).not.toHaveBeenCalled();
  });

  it('should create new content if no contentId is provided', () => {
    renderHook(() => useAutoSave(mockFormData, true));
    jest.advanceTimersByTime(3000);

    expect(contentRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockFormData,
        userId: mockUser.id,
        status: 'draft'
      })
    );
  });

  it('should update existing content if contentId is provided', () => {
    const contentId = 'test-content-123';
    
    renderHook(() => useAutoSave(mockFormData, true, contentId));
    jest.advanceTimersByTime(3000);

    expect(contentRepository.update).toHaveBeenCalledWith(
      contentId,
      expect.objectContaining({
        ...mockFormData,
        status: 'draft'
      })
    );
  });

  it('should debounce save operations', () => {
    const { rerender } = renderHook(
      ({ formData }) => useAutoSave(formData, true),
      { initialProps: { formData: mockFormData } }
    );

    // First update
    jest.advanceTimersByTime(1500);
    expect(contentRepository.create).not.toHaveBeenCalled();

    // Second update before timeout
    rerender({ formData: { ...mockFormData, title: 'Updated Title' } });
    jest.advanceTimersByTime(1500);
    expect(contentRepository.create).not.toHaveBeenCalled();

    // Wait for full timeout
    jest.advanceTimersByTime(1500);
    expect(contentRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should handle validation errors', () => {
    const invalidData = {
      type: 'promotion',
      // Missing required fields
    };

    renderHook(() => useAutoSave(invalidData, true));
    jest.advanceTimersByTime(3000);

    expect(contentRepository.create).not.toHaveBeenCalled();
  });

  it('should handle save errors gracefully', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    (contentRepository.create as jest.Mock).mockRejectedValueOnce(new Error('Save failed'));

    renderHook(() => useAutoSave(mockFormData, true));
    jest.advanceTimersByTime(3000);

    expect(consoleError).toHaveBeenCalledWith('Auto-save error:', expect.any(Error));
    consoleError.mockRestore();
  });
});