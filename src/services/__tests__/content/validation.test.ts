import { validateContentFields } from '../../content/validation';
import { Content } from '../../../types/content';

describe('Content Validation', () => {
  describe('validateContentFields', () => {
    it('should validate common required fields', () => {
      const data: Partial<Content> = {};
      const errors = validateContentFields('promotion', data);
      
      expect(errors).toContain('Title is required');
      expect(errors).toContain('Description is required');
      expect(errors).toContain('Target audience is required');
    });

    describe('Promotion validation', () => {
      it('should validate promotion-specific fields', () => {
        const data: Partial<Content> = {
          title: 'Test Promotion',
          description: 'Test Description',
          targetAudience: ['students']
        };
        
        const errors = validateContentFields('promotion', data);
        
        expect(errors).toContain('Promotion type is required');
        expect(errors).toContain('Location is required');
        expect(errors).toContain('Validity period is required');
      });

      it('should pass validation with valid promotion data', () => {
        const data: Partial<Content> = {
          title: 'Test Promotion',
          description: 'Test Description',
          targetAudience: ['students'],
          promotionType: 'discount',
          location: 'online',
          validityPeriod: {
            start: '2024-01-01',
            end: '2024-12-31'
          }
        };
        
        const errors = validateContentFields('promotion', data);
        expect(errors).toHaveLength(0);
      });
    });

    describe('Job validation', () => {
      it('should validate job-specific fields', () => {
        const data: Partial<Content> = {
          title: 'Test Job',
          description: 'Test Description',
          targetAudience: ['students']
        };
        
        const errors = validateContentFields('job', data);
        
        expect(errors).toContain('Job type is required');
        expect(errors).toContain('Job location is required');
        expect(errors).toContain('Requirements are required');
        expect(errors).toContain('Application deadline is required');
      });

      it('should pass validation with valid job data', () => {
        const data: Partial<Content> = {
          title: 'Test Job',
          description: 'Test Description',
          targetAudience: ['students'],
          jobType: 'full-time',
          jobLocation: 'remote',
          requirements: ['React', 'TypeScript'],
          applicationDeadline: '2024-12-31'
        };
        
        const errors = validateContentFields('job', data);
        expect(errors).toHaveLength(0);
      });
    });

    describe('Event validation', () => {
      it('should validate event-specific fields', () => {
        const data: Partial<Content> = {
          title: 'Test Event',
          description: 'Test Description',
          targetAudience: ['students']
        };
        
        const errors = validateContentFields('event', data);
        
        expect(errors).toContain('Event type is required');
        expect(errors).toContain('Event location is required');
        expect(errors).toContain('Event date is required');
        expect(errors).toContain('Venue is required');
      });

      it('should pass validation with valid event data', () => {
        const data: Partial<Content> = {
          title: 'Test Event',
          description: 'Test Description',
          targetAudience: ['students'],
          eventType: 'workshop',
          eventLocation: 'online',
          eventDate: '2024-01-01',
          venue: 'Virtual Room'
        };
        
        const errors = validateContentFields('event', data);
        expect(errors).toHaveLength(0);
      });
    });
  });
});