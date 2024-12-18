import React, { useState } from 'react';
import { targetAudienceOptions } from '../../constants/promotionOptions';
import { Button } from '../ui/Button';
import { PromotionStepProps } from '../../types/promotion';

export function PromotionStep2({ data, onNext, onBack }: PromotionStepProps) {
  const [selectedTargets, setSelectedTargets] = useState<string[]>(data.targetAudience || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleTarget = (value: string) => {
    setSelectedTargets(prev =>
      prev.includes(value)
        ? prev.filter(t => t !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const stepData = {
      targetAudience: selectedTargets,
      description: formData.get('description') as string,
    };

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (selectedTargets.length === 0) {
      newErrors.targetAudience = 'Seleziona almeno un pubblico di destinazione';
    }
    if (!stepData.description) {
      newErrors.description = 'Inserisci una descrizione';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(stepData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pubblico di destinazione
        </label>
        <div className="grid grid-cols-2 gap-3">
          {targetAudienceOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleTarget(option.value)}
              className={`p-3 text-left rounded-lg border ${
                selectedTargets.includes(option.value)
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
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrizione
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={data.description}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          placeholder="Descrivi la tua promozione..."
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          Indietro
        </Button>
        <Button type="submit">
          Continua
        </Button>
      </div>
    </form>
  );
}