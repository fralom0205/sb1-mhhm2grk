import { renderHook, act } from '@testing-library/react';
import { useContent } from '../useContent';
import { useAuth } from '../../../auth/hooks/useAuth';
import { getUserContent } from '../../../../services/content.service';

jest.mock('../../../auth/hooks/useAuth');
jest.mock('../../../../services/content.service');

describe('useContent', () => {
  const mockUser = { id: 'test-user-123' };
  const mockContent = [
    {
      id: '1',
      title: 'Test Content',
      type: 'promotion',
      status: 'published',
      createdAt: '2024-01-01'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (getUserContent as jest.Mock).mockResolvedValue(mockContent);
  });

  it('should load content on mount', async () => {
    const { result } = renderHook(() => useContent());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.content).toEqual([]);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.content).toEqual(mockContent);
    expect(getUserContent).toHaveBeenCalledWith(mockUser.id);
  });

  it('should handle loading errors', async () => {
    const error = new Error('Failed to load content');
    (getUserContent as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useContent());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Error loading content');
    expect(result.current.content).toEqual([]);
  });

  it('should apply filters when provided', async () => {
    const { result } = renderHook(() => useContent());

    await act(async () => {
      result.current.setFilters({
        type: 'promotion',
        dateRange: {
          start: '2024-01-01',
          end: '2024-12-31'
        }
      });
    });

    expect(result.current.filters).toEqual({
      type: 'promotion',
      dateRange: {
        start: '2024-01-01',
        end: '2024-12-31'
      }
    });
  });

  it('should refresh content', async () => {
    const { result } = renderHook(() => useContent());

    await act(async () => {
      await result.current.refresh();
    });

    expect(getUserContent).toHaveBeenCalledTimes(2); // Once on mount, once on refresh
    expect(result.current.content).toEqual(mockContent);
  });
});