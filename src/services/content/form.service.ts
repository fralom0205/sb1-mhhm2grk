import { Content, ContentType, JobContent, PromotionContent, EventContent } from '../../types/content';
import { ApiError } from '../../utils/apiErrors';
import { JobService, PromotionService, EventService } from './index';

export class ContentFormService {
  private jobService: JobService;
  private promotionService: PromotionService;
  private eventService: EventService;

  constructor() {
    this.jobService = new JobService();
    this.promotionService = new PromotionService();
    this.eventService = new EventService();
  }

  async validateStep(type: ContentType, step: number, data: Partial<Content>): Promise<string[]> {
    const errors: string[] = [];

    switch (type) {
      case 'job':
        errors.push(...this.validateJobStep(step, data as Partial<JobContent>));
        break;
      case 'promotion':
        errors.push(...this.validatePromotionStep(step, data as Partial<PromotionContent>));
        break;
      case 'event':
        errors.push(...this.validateEventStep(step, data as Partial<EventContent>));
        break;
    }

    return errors;
  }

  async saveDraft(type: ContentType, data: Partial<Content>): Promise<string> {
    try {
      switch (type) {
        case 'job':
          return await this.jobService.createJob(data.userId!, data as Partial<JobContent>);
        case 'promotion':
          return await this.promotionService.createPromotion(data.userId!, data as Partial<PromotionContent>);
        case 'event':
          return await this.eventService.createEvent(data.userId!, data as Partial<EventContent>);
        default:
          throw new ApiError('Invalid content type', 400);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  }

  async publish(type: ContentType, data: Partial<Content>): Promise<string> {
    try {
      // Validate all required fields before publishing
      const errors = await this.validateAllFields(type, data);
      if (errors.length > 0) {
        throw new ApiError(errors[0], 400);
      }

      switch (type) {
        case 'job':
          return await this.jobService.createJob(data.userId!, {
            ...data as Partial<JobContent>,
            status: 'published'
          });
        case 'promotion':
          return await this.promotionService.createPromotion(data.userId!, {
            ...data as Partial<PromotionContent>,
            status: 'published'
          });
        case 'event':
          return await this.eventService.createEvent(data.userId!, {
            ...data as Partial<EventContent>,
            status: 'published'
          });
        default:
          throw new ApiError('Invalid content type', 400);
      }
    } catch (error) {
      console.error('Error publishing content:', error);
      throw error;
    }
  }

  private validateJobStep(step: number, data: Partial<JobContent>): string[] {
    const errors: string[] = [];

    switch (step) {
      case 1:
        if (!data.title) errors.push('Il titolo è obbligatorio');
        if (!data.jobType) errors.push('Seleziona un tipo di lavoro');
        if (!data.jobLocation) errors.push('Seleziona una modalità di lavoro');
        break;
      case 2:
        if (!data.requirements?.length) errors.push('Inserisci almeno un requisito');
        break;
      case 3:
        if (!data.description) errors.push('La descrizione è obbligatoria');
        break;
    }

    return errors;
  }

  private validatePromotionStep(step: number, data: Partial<PromotionContent>): string[] {
    const errors: string[] = [];

    switch (step) {
      case 1:
        if (!data.title) errors.push('Il titolo è obbligatorio');
        if (!data.promotionType) errors.push('Seleziona un tipo di promozione');
        if (!data.validityPeriod?.start) errors.push('Seleziona una data di inizio');
        if (!data.validityPeriod?.end) errors.push('Seleziona una data di fine');
        break;
      case 2:
        if (!data.targetAudience?.length) errors.push('Seleziona almeno un pubblico target');
        break;
      case 3:
        if (!data.description) errors.push('La descrizione è obbligatoria');
        break;
    }

    return errors;
  }

  private validateEventStep(step: number, data: Partial<EventContent>): string[] {
    const errors: string[] = [];

    switch (step) {
      case 1:
        if (!data.title) errors.push('Il titolo è obbligatorio');
        if (!data.eventType) errors.push('Seleziona un tipo di evento');
        if (!data.eventLocation) errors.push('Seleziona una modalità');
        if (!data.eventDate) errors.push('Seleziona una data');
        if (!data.venue) errors.push('Inserisci una location');
        break;
      case 2:
        if (!data.targetAudience?.length) errors.push('Seleziona almeno un pubblico target');
        break;
      case 3:
        if (!data.description) errors.push('La descrizione è obbligatoria');
        break;
    }

    return errors;
  }

  private async validateAllFields(type: ContentType, data: Partial<Content>): Promise<string[]> {
    const errors: string[] = [];

    // Common validations
    if (!data.title) errors.push('Il titolo è obbligatorio');
    if (!data.description) errors.push('La descrizione è obbligatoria');

    // Type-specific validations
    switch (type) {
      case 'job':
        errors.push(...this.validateJobFields(data as JobContent));
        break;
      case 'promotion':
        errors.push(...this.validatePromotionFields(data as PromotionContent));
        break;
      case 'event':
        errors.push(...this.validateEventFields(data as EventContent));
        break;
    }

    return errors;
  }

  private validateJobFields(data: JobContent): string[] {
    const errors: string[] = [];
    if (!data.jobType) errors.push('Tipo di lavoro mancante');
    if (!data.jobLocation) errors.push('Modalità di lavoro mancante');
    if (!data.requirements?.length) errors.push('Requisiti mancanti');
    return errors;
  }

  private validatePromotionFields(data: PromotionContent): string[] {
    const errors: string[] = [];
    if (!data.promotionType) errors.push('Tipo di promozione mancante');
    if (!data.validityPeriod?.start || !data.validityPeriod?.end) {
      errors.push('Periodo di validità mancante');
    }
    if (!data.targetAudience?.length) errors.push('Pubblico target mancante');
    return errors;
  }

  private validateEventFields(data: EventContent): string[] {
    const errors: string[] = [];
    if (!data.eventType) errors.push('Tipo di evento mancante');
    if (!data.eventLocation) errors.push('Modalità mancante');
    if (!data.eventDate) errors.push('Data mancante');
    if (!data.venue) errors.push('Location mancante');
    return errors;
  }
}