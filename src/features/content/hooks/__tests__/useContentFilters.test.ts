import { renderHook, act } from '@testing-library/react';
import { useContentFilters } from '../useContentFilters';

describe('useContentFilters', () => {
  it('should initialize with empty filters', () => {
    const { result } = renderHook(() => useContentFilters());

    expect(result.current.filters).toEqual({});
  });

  it('should update filters', () => {
    const { result } = renderHook(() => useContentFilters());

    act(() => {
      result.current.updateFilters({
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

  it('should merge new filters with existing ones', () => {
    const { result } = renderHook(() => useContentFilters());

    act(() => {
      result.current.updateFilters({ type: 'promotion' });
    });

    act(() => {
      result.current.updateFilters({
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

  it('should reset filters', () => {
    const { result } = renderHook(() => useContentFilters());

    act(() => {
      result.current.updateFilters({
        type: 'promotion',
        dateRange: {
          start: '2024-01-01',
          end: '2024-12-31'
        }
      });
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({});
  });
});