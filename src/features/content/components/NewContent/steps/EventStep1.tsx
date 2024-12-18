import React, { useState } from 'react';
import { Input } from '../../../../../components/ui/Input';
import { Select } from '../../../../../components/ui/Select';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { EventContent } from '../../../../../types/content';
import { eventTypeOptions, eventLocationOptions, eventCapacityOptions } from '../../../../../constants/contentTypes';
import { validateStep } from '../../../../../utils/contentValidation';

interface EventStep1Props {
  data: Partial<EventContent>;
  onNext: (data: Partial<EventContent>) => void;
  onCancel: () => void;
  onSaveDraft?: () => void;
  isSubmitting?: boolean;
  isDirty?: boolean;
}

export function EventStep1({ 
  data, 
  onNext, 
  onCancel,
  onSaveDraft,
  isSubmitting = false,
  isDirty = false 
}: EventStep1Props) {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for the updated field
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate step data
    const validation = validateStep('event', 1, formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onNext({
      ...formData,
      type: 'event',
      step: 1
    });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Dettagli evento</h3>
            <p className="text-sm text-gray-500">
              Inserisci i dettagli dell'evento
            </p>
          </div>
          <ProgressIndicator percentage={10} label="Compila tutti i dati necessari" />
        </div>

        <Input
          label="Titolo dell'evento"
          name="title"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo di evento"
            name="eventType"
            value={formData.eventType || ''}
            onChange={(e) => handleChange('eventType', e.target.value)}
            options={eventTypeOptions}
            error={errors.eventType}
            required
          />

          <Select
            label="Modalità"
            name="eventLocation"
            value={formData.eventLocation || ''}
            onChange={(e) => handleChange('eventLocation', e.target.value)}
            options={eventLocationOptions}
            error={errors.eventLocation}
            required
          />
        </div>

        <Input
          label="Location"
          name="venue"
          value={formData.venue || ''}
          onChange={(e) => handleChange('venue', e.target.value)}
          error={errors.venue}
          placeholder="Es: Aula Magna, Online, etc."
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data inizio"
            type="datetime-local"
            name="eventDate"
            value={formData.eventDate || ''}
            onChange={(e) => handleChange('eventDate', e.target.value)}
            error={errors.eventDate}
            required
          />
          <Input
            label="Data fine"
            type="datetime-local"
            name="endDate"
            value={formData.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Numero massimo partecipanti"
            name="capacity"
            value={formData.capacity?.toString() || ''}
            onChange={(e) => handleChange('capacity', e.target.value === 'unlimited' ? undefined : Number(e.target.value))}
            options={eventCapacityOptions}
          />
          <Input
            label="Scadenza registrazioni"
            type="date"
            name="registrationDeadline"
            value={formData.registrationDeadline || ''}
            onChange={(e) => handleChange('registrationDeadline', e.target.value)}
          />
        </div>

        <Input
          label="Link registrazione"
          type="url"
          name="registrationUrl"
          value={formData.registrationUrl || ''}
          onChange={(e) => handleChange('registrationUrl', e.target.value)}
          placeholder="https://..."
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annulla
          </Button>
          {onSaveDraft && isDirty && (
            <Button
              type="button"
              variant="secondary"
              onClick={onSaveDraft}
              disabled={isSubmitting}
            >
              Salva come bozza
            </Button>
          )}
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvataggio...' : 'Continua'}
          </Button>
        </div>
      </form>

      <div className="col-span-1">
        <ContentPreview
          title={formData.title}
          subtitle={`${eventTypeOptions.find(opt => opt.value === formData.eventType)?.label || ''} · 
                    ${eventLocationOptions.find(opt => opt.value === formData.eventLocation)?.label || ''}`}
          image={formData.coverImage}
          type="event"
          data={formData}
        />
      </div>
    </div>
  );
}