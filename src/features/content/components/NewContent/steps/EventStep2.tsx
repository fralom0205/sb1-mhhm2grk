import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { EventContent } from '../../../../../types/content';
import { targetAudienceOptions } from '../../../../../constants/contentTypes';
import { validateStep } from '../../../../../utils/contentValidation';

interface EventStep2Props {
  data: Partial<EventContent>;
  onNext: (data: Partial<EventContent>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
  isDirty?: boolean;
}

export function EventStep2({ 
  data, 
  onNext, 
  onBack, 
  onSaveDraft,
  isSubmitting = false,
  isDirty = false 
}: EventStep2Props) {
  const [selectedAudience, setSelectedAudience] = useState<string[]>(data.targetAudience || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleAudience = (value: string) => {
    setSelectedAudience(prev =>
      prev.includes(value)
        ? prev.filter(t => t !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate step data
    const validation = validateStep('event', 2, {
      ...data,
      targetAudience: selectedAudience
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onNext({ targetAudience: selectedAudience });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Pubblico target</h3>
            <p className="text-sm text-gray-500">
              Seleziona il pubblico di destinazione per il tuo evento
            </p>
          </div>
          <ProgressIndicator percentage={40} label="Compila tutti i dati necessari" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {targetAudienceOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleAudience(option.value)}
              className={`p-3 text-left rounded-lg border ${
                selectedAudience.includes(option.value)
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {errors.targetAudience && (
          <p className="mt-1 text-sm text-red-600">{errors.targetAudience}</p>
        )}

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onBack}
            disabled={isSubmitting}
          >
            Indietro
          </Button>
          {isDirty && (
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
          title={data.title}
          subtitle={selectedAudience.map(audience => 
            targetAudienceOptions.find(opt => opt.value === audience)?.label
          ).join(', ')}
          image={data.coverImage}
          type="event"
          data={data}
        />
      </div>
    </div>
  );
}