import { BaseContentRepository } from './base.repository';
import { EventContent } from '../../types/content';
import { ApiError } from '../../utils/apiErrors';

export class EventRepository extends BaseContentRepository {
  constructor() {
    super('content');
  }

  async createEvent(data: Omit<EventContent, 'id' | 'createdAt' | 'views' | 'engagement'>): Promise<string> {
    try {
      // Validate event-specific fields
      if (!data.eventType || !data.eventLocation || !data.eventDate || !data.venue) {
        throw new ApiError('Missing required event fields', 400);
      }

      // Validate dates
      const startDate = new Date(data.eventDate);
      if (data.endDate) {
        const endDate = new Date(data.endDate);
        if (endDate <= startDate) {
          throw new ApiError('End date must be after start date', 400);
        }
      }

      return this.create({
        ...data,
        type: 'event',
        status: data.status || 'draft'
      });
    } catch (error) {
      console.error('Error creating event:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create event', 500);
    }
  }

  async updateEvent(id: string, data: Partial<EventContent>): Promise<void> {
    try {
      // Validate event-specific fields if they're being updated
      if (data.eventDate && data.endDate) {
        const startDate = new Date(data.eventDate);
        const endDate = new Date(data.endDate);
        if (endDate <= startDate) {
          throw new ApiError('End date must be after start date', 400);
        }
      }

      if (data.speakers && !Array.isArray(data.speakers)) {
        throw new ApiError('Speakers must be an array', 400);
      }

      if (data.agenda && !Array.isArray(data.agenda)) {
        throw new ApiError('Agenda must be an array', 400);
      }

      await this.update(id, data);
    } catch (error) {
      console.error('Error updating event:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update event', 500);
    }
  }
}