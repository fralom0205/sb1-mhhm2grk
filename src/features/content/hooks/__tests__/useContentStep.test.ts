import { renderHook } from '@testing-library/react';
import { validateStep } from '../../../utils/validation';

describe('useContentStep', () => {
  it('should validate promotion step correctly', async () => {
    const { result } = renderHook(() => 
      useContentStep('promotion', 1, { 
        type: 'promotion',
        title: 'Test Promotion',
        promotionType: 'discount',
        location: 'online',
        validityPeriod: {
          start: '2024-01-01',
          end: '2024-12-31'
        }
      } as PromotionContent)
    );

    const isValid = await result.current.validateAndUpdateStep({
      title: 'Test Promotion',
      promotionType: 'discount',
      location: 'online',
      validityPeriod: {
        start: '2024-01-01',
        end: '2024-12-31'
      }
    });

    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it('should show validation errors for invalid promotion data', async () => {
    const { result } = renderHook(() => 
      useContentStep('promotion', 1, { type: 'promotion' })
    );

    const isValid = await result.current.validateAndUpdateStep({
      title: '', // Missing required field
      promotionType: '', // Missing required field
    });

    expect(isValid).toBe(false);
    expect(result.current.errors).toHaveProperty('title');
    expect(result.current.errors).toHaveProperty('promotionType');
  });

  it('should validate job step correctly', async () => {
    const { result } = renderHook(() => 
      useContentStep('job', 1, {
        type: 'job',
        title: 'Software Engineer',
        jobType: 'full-time',
        jobLocation: 'remote',
        requirements: ['React', 'TypeScript']
      } as JobContent)
    );

    const isValid = await result.current.validateAndUpdateStep({
      title: 'Software Engineer',
      jobType: 'full-time',
      jobLocation: 'remote',
      requirements: ['React', 'TypeScript']
    });

    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it('should validate event step correctly', async () => {
    const { result } = renderHook(() => 
      useContentStep('event', 1, {
        type: 'event',
        title: 'Tech Conference',
        eventType: 'conference',
        eventLocation: 'venue',
        eventDate: '2024-06-01',
        venue: 'Convention Center'
      } as EventContent)
    );

    const isValid = await result.current.validateAndUpdateStep({
      title: 'Tech Conference',
      eventType: 'conference',
      eventLocation: 'venue',
      eventDate: '2024-06-01',
      venue: 'Convention Center'
    });

    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });
});