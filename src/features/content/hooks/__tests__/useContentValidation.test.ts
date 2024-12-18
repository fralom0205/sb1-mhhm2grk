import { renderHook, act } from '@testing-library/react';
import { useContentValidation } from '../useContentValidation';
import { validateContentFields } from '../../../services/contentValidation';

jest.mock('../../../services/contentValidation');

describe('useContentValidation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateStep', () => {
    it('validates common fields for step 1', () => {
      const { result } = renderHook(() => useContentValidation('promotion'));

      const validationResult = result.current.validateStep(1, {});
      
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors.title).toBe('Il titolo è obbligatorio');
    });

    describe('Promotion validation', () => {
      it('validates promotion step 1', () => {
        const { result } = renderHook(() => useContentValidation('promotion'));

        const validationResult = result.current.validateStep(1, {
          title: 'Test Promotion'
        });

        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors).toEqual(expect.objectContaining({
          promotionType: 'Seleziona un tipo di promozione',
          location: 'Seleziona dove riscattare la promo',
          validityPeriod: 'Seleziona il periodo di validità'
        }));
      });

      it('validates validity period dates', () => {
        const { result } = renderHook(() => useContentValidation('promotion'));

        const validationResult = result.current.validateStep(1, {
          title: 'Test Promotion',
          promotionType: 'discount',
          location: 'online',
          validityPeriod: {
            start: '2024-01-01',
            end: '2023-12-31' // End before start
          }
        });

        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors.validityPeriod)
          .toBe('La data di fine deve essere successiva alla data di inizio');
      });

      it('validates target audience in step 2', () => {
        const { result } = renderHook(() => useContentValidation('promotion'));

        const validationResult = result.current.validateStep(2, {});

        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors.targetAudience)
          .toBe('Seleziona almeno un pubblico target');
      });
    });

    describe('Job validation', () => {
      it('validates job step 1', () => {
        const { result } = renderHook(() => useContentValidation('job'));

        const validationResult = result.current.validateStep(1, {
          title: 'Test Job'
        });

        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors).toEqual(expect.objectContaining({
          jobType: 'Seleziona un tipo di lavoro',
          jobLocation: 'Seleziona una modalità di lavoro',
          applicationDeadline: 'Seleziona una data di scadenza'
        }));
      });

      it('validates application deadline is in future', () => {
        const { result } = renderHook(() => useContentValidation('job'));

        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);

        const validationResult = result.current.validateStep(1, {
          title: 'Test Job',
          jobType: 'full-time',
          jobLocation: 'remote',
          applicationDeadline: pastDate.toISOString()
        });

        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors.applicationDeadline)
          .toBe('La data di scadenza deve essere futura');
      });

      it('validates requirements in step 2', () => {
        const { result } = renderHook(() => useContentValidation('job'));

        const validationResult = result.current.validateStep(2, {});

        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors.requirements)
          .toBe('Inserisci almeno un requisito');
      });
    });

    describe('Event validation', () => {
      it('validates event step 1', () => {
        const { result } = renderHook(() => useContentValidation('event'));

        const validationResult = result.current.validateStep(1, {
          title: 'Test Event'
        });

        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors).toEqual(expect.objectContaining({
          eventType: 'Seleziona un tipo di evento',
          eventLocation: 'Seleziona una modalità',
          eventDate: 'Seleziona una data',
          venue: 'Inserisci una location'
        }));
      });

      it('validates event date is in future', () => {
        const { result } = renderHook(() => useContentValidation('event'));

        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);

        const validationResult = result.current.validateStep(1, {
          title: 'Test Event',
          eventType: 'conference',
          eventLocation: 'venue',
          eventDate: pastDate.toISOString(),
          venue: 'Test Venue'
        });

        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors.eventDate)
          .toBe("La data dell'evento deve essere futura");
      });
    });
  });

  describe('validateAll', () => {
    it('validates all content fields', () => {
      (validateContentFields as jest.Mock).mockReturnValue(['Error 1', 'Error 2']);
      
      const { result } = renderHook(() => useContentValidation('promotion'));

      const validationResult = result.current.validateAll({});

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors).toEqual({
        error_1: 'Error 1',
        error_2: 'Error 2'
      });
      expect(validateContentFields).toHaveBeenCalled();
    });

    it('returns valid result when no errors', () => {
      (validateContentFields as jest.Mock).mockReturnValue([]);
      
      const { result } = renderHook(() => useContentValidation('promotion'));

      const validationResult = result.current.validateAll({
        title: 'Test Content',
        description: 'Test Description'
      });

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.errors).toEqual({});
    });
  });

  describe('clearErrors', () => {
    it('clears all validation errors', () => {
      const { result } = renderHook(() => useContentValidation('promotion'));

      // First set some errors
      act(() => {
        result.current.validateStep(1, {});
      });
      expect(result.current.errors).not.toEqual({});

      // Then clear them
      act(() => {
        result.current.clearErrors();
      });
      expect(result.current.errors).toEqual({});
    });
  });
});