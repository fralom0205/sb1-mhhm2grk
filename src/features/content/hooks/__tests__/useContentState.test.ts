import { renderHook, act } from '@testing-library/react';
import { useContentState } from '../useContentState';

describe('useContentState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useContentState());

    expect(result.current.state).toEqual({
      step: 1,
      data: {},
      error: null,
      isSubmitting: false,
      isDirty: false
    });
  });

  it('should initialize with custom state', () => {
    const initialState = {
      step: 2,
      data: { title: 'Test' },
      error: 'Test error',
      isSubmitting: true,
      isDirty: true
    };

    const { result } = renderHook(() => useContentState(initialState));

    expect(result.current.state).toEqual(initialState);
  });

  it('should update step', () => {
    const { result } = renderHook(() => useContentState());

    act(() => {
      result.current.updateStep(2);
    });

    expect(result.current.state.step).toBe(2);
    expect(result.current.state.error).toBeNull();
  });

  it('should update data and mark as dirty', () => {
    const { result } = renderHook(() => useContentState());

    act(() => {
      result.current.updateData({ title: 'New Title' });
    });

    expect(result.current.state.data).toEqual({ title: 'New Title' });
    expect(result.current.state.isDirty).toBe(true);
  });

  it('should set error', () => {
    const { result } = renderHook(() => useContentState());

    act(() => {
      result.current.setError('Test error');
    });

    expect(result.current.state.error).toBe('Test error');
  });

  it('should set submitting state', () => {
    const { result } = renderHook(() => useContentState());

    act(() => {
      result.current.setSubmitting(true);
    });

    expect(result.current.state.isSubmitting).toBe(true);
  });

  it('should reset dirty state', () => {
    const { result } = renderHook(() => useContentState());

    act(() => {
      result.current.updateData({ title: 'New Title' });
    });

    expect(result.current.state.isDirty).toBe(true);

    act(() => {
      result.current.resetDirty();
    });

    expect(result.current.state.isDirty).toBe(false);
  });
});