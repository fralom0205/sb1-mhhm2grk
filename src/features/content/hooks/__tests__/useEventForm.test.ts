import { renderHook, act } from '@testing-library/react';
import { useEventForm } from '../useEventForm';

describe('useEventForm', () => {
  it('should initialize with empty form data', () => {
    const { result } = renderHook(() => useEventForm());
    expect(result.current.formData).toEqual({});
    expect(result.current.errors).toEqual({});
  });

  it('should update fields correctly', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.updateField('title', 'Test Event');
    });

    expect(result.current.formData.title).toBe('Test Event');
  });

  it('should validate required fields', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors).toHaveProperty('title');
    expect(result.current.errors).toHaveProperty('eventType');
    expect(result.current.errors).toHaveProperty('eventLocation');
    expect(result.current.errors).toHaveProperty('eventDate');
    expect(result.current.errors).toHaveProperty('venue');
  });

  it('should clear errors when field is updated', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors).toHaveProperty('title');

    act(() => {
      result.current.updateField('title', 'Test Event');
    });

    expect(result.current.errors).not.toHaveProperty('title');
  });

  it('should validate form successfully with valid data', () => {
    const { result } = renderHook(() => useEventForm());

    act(() => {
      result.current.updateField('title', 'Test Event');
      result.current.updateField('eventType', 'conference');
      result.current.updateField('eventLocation', 'venue');
      result.current.updateField('eventDate', '2024-12-31');
      result.current.updateField('venue', 'Test Venue');
    });

    let isValid;
    act(() => {
      isValid = result.current.validateForm();
    });

    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });
});