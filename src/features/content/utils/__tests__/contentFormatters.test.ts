import { getTypeLabel, getDateInfo } from '../contentFormatters';
import { Content } from '../../../../types/content';

describe('contentFormatters', () => {
  describe('getTypeLabel', () => {
    it('returns empty string for missing type or data', () => {
      expect(getTypeLabel('job')).toBe('');
      expect(getTypeLabel('job', undefined)).toBe('');
    });

    it('formats job type label correctly', () => {
      const jobData = {
        jobType: 'full-time',
        jobLocation: 'remote'
      };

      const label = getTypeLabel('job', jobData);
      expect(label).toContain('Full-time');
      expect(label).toContain('Remoto');
    });

    it('formats event type label correctly', () => {
      const eventData = {
        eventType: 'conference',
        eventLocation: 'in-person'
      };

      const label = getTypeLabel('event', eventData);
      expect(label).toContain('Conferenza');
      expect(label).toContain('In presenza');
    });

    it('formats promotion type label correctly', () => {
      const promotionData = {
        promotionType: 'discount',
        location: 'online'
      };

      const label = getTypeLabel('promotion', promotionData);
      expect(label).toContain('Sconto');
      expect(label).toContain('Online');
    });
  });

  describe('getDateInfo', () => {
    it('returns empty string for missing type or data', () => {
      expect(getDateInfo()).toBe('');
      expect(getDateInfo('job')).toBe('');
      expect(getDateInfo('job', {})).toBe('');
    });

    it('formats job application deadline correctly', () => {
      const jobData = {
        applicationDeadline: '2024-12-31'
      };

      const dateInfo = getDateInfo('job', jobData);
      expect(dateInfo).toContain('Scade il');
      expect(dateInfo).toContain('31 dicembre 2024');
    });

    it('formats event date correctly', () => {
      const eventData = {
        eventDate: '2024-06-15T14:30:00'
      };

      const dateInfo = getDateInfo('event', eventData);
      expect(dateInfo).toContain('15 giugno 2024');
      expect(dateInfo).toContain('14:30');
    });

    it('formats promotion validity period correctly', () => {
      const promotionData = {
        validityPeriod: {
          start: '2024-01-01',
          end: '2024-12-31'
        }
      };

      const dateInfo = getDateInfo('promotion', promotionData);
      expect(dateInfo).toContain('Valido dal');
      expect(dateInfo).toContain('1 gennaio 2024');
      expect(dateInfo).toContain('31 dicembre 2024');
    });
  });
});