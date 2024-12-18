import { validateContent, validateStep } from '../contentValidation';
import { ContentType } from '../../types/content';

describe('Content Validation', () => {
  describe('validateContent', () => {
    it('validates draft mode with minimal requirements', () => {
      const data = { title: 'Test Title' };
      const result = validateContent('job' as ContentType, data, 'draft');
      expect(result.isValid).toBe(true);
    });

    it('requires title for draft mode', () => {
      const data = {};
      const result = validateContent('job' as ContentType, data, 'draft');
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it('validates job content for publishing', () => {
      const data = {
        title: 'Software Engineer',
        description: 'Great opportunity',
        jobType: 'full-time',
        jobLocation: 'remote',
        requirements: ['React', 'TypeScript']
      };
      const result = validateContent('job' as ContentType, data, 'publish');
      expect(result.isValid).toBe(true);
    });

    it('validates promotion content for publishing', () => {
      const data = {
        title: 'Summer Sale',
        description: 'Big discounts',
        promotionType: 'discount',
        location: 'online',
        validityPeriod: {
          start: '2024-12-01',
          end: '2024-12-31'
        },
        targetAudience: ['students']
      };
      const result = validateContent('promotion' as ContentType, data, 'publish');
      expect(result.isValid).toBe(true);
    });

    it('validates event content for publishing', () => {
      const data = {
        title: 'Tech Conference',
        description: 'Annual conference',
        eventType: 'conference',
        eventLocation: 'venue',
        eventDate: '2024-12-01',
        venue: 'Convention Center'
      };
      const result = validateContent('event' as ContentType, data, 'publish');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateStep', () => {
    it('validates step 1 common fields', () => {
      const data = { title: 'Test Title' };
      const result = validateStep('job' as ContentType, 1, data);
      expect(result.isValid).toBe(true);
    });

    it('validates step 2 job fields', () => {
      const data = {
        jobType: 'full-time',
        jobLocation: 'remote'
      };
      const result = validateStep('job' as ContentType, 2, data);
      expect(result.isValid).toBe(true);
    });

    it('validates step 2 promotion fields', () => {
      const data = {
        promotionType: 'discount',
        location: 'online'
      };
      const result = validateStep('promotion' as ContentType, 2, data);
      expect(result.isValid).toBe(true);
    });

    it('validates step 2 event fields', () => {
      const data = {
        eventType: 'conference',
        eventDate: '2024-12-01'
      };
      const result = validateStep('event' as ContentType, 2, data);
      expect(result.isValid).toBe(true);
    });

    it('validates step 3 description', () => {
      const data = { description: 'Test description' };
      const result = validateStep('job' as ContentType, 3, data);
      expect(result.isValid).toBe(true);
    });
  });
});