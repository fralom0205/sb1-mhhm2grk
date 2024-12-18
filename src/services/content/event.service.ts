import { BaseContentService } from './base.service';
import { EventContent } from '../../types/content';
import { ApiError } from '../../utils/apiErrors';
import { uploadContentImage } from './storage';
import { EventRepository } from '../../repositories/content/event.repository';

export class EventService extends BaseContentService {
  private eventRepository: EventRepository;

  constructor() {
    super();
    this.eventRepository = new EventRepository();
  }

  async createEvent(
    userId: string,
    data: Omit<EventContent, 'id' | 'createdAt' | 'views' | 'engagement' | 'type'>,
    coverImage?: File
  ): Promise<string> {
    try {
      let coverImageUrl;
      if (coverImage) {
        coverImageUrl = await uploadContentImage(coverImage, userId, 'event');
      }

      const eventData: Omit<EventContent, 'id' | 'createdAt' | 'views' | 'engagement'> = {
        ...data,
        type: 'event',
        userId,
        coverImage: coverImageUrl,
        status: data.status || 'draft',
        updatedAt: new Date().toISOString()
      };

      return this.eventRepository.createEvent(eventData);
    } catch (error) {
      console.error('Error in event service:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create event', 500);
    }
  }

  async updateEvent(
    id: string,
    data: Partial<EventContent>,
    coverImage?: File
  ): Promise<void> {
    try {
      let updates = { ...data };

      if (coverImage) {
        const imageUrl = await uploadContentImage(coverImage, data.userId!, 'event');
        updates.coverImage = imageUrl;
      }

      await this.eventRepository.updateEvent(id, updates);
    } catch (error) {
      console.error('Error updating event:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update event', 500);
    }
  }

  async publishEvent(id: string): Promise<void> {
    try {
      const event = await this.repository.findById(id);
      if (!event) {
        throw new ApiError('Event not found', 404);
      }

      // Validate required fields before publishing
      if (!event.title || !event.description || !event.eventType || 
          !event.eventLocation || !event.eventDate || !event.venue) {
        throw new ApiError('Missing required fields for publishing', 400);
      }

      // Validate dates
      const eventDate = new Date(event.eventDate);
      const now = new Date();
      if (eventDate <= now) {
        throw new ApiError('Event date must be in the future', 400);
      }

      if (event.endDate) {
        const endDate = new Date(event.endDate);
        if (endDate <= eventDate) {
          throw new ApiError('End date must be after event date', 400);
        }
      }

      await this.eventRepository.updateEvent(id, {
        status: 'published',
        publishDate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error publishing event:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to publish event', 500);
    }
  }
}