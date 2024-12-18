import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { PromotionContent } from '../../../../../types/content';
import { targetAudienceOptions } from '../../../../../constants/contentTypes';

interface PromotionStep2Props {
  data?: Partial<PromotionContent>;
  onNext: (data: Partial<PromotionContent>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
}

export function PromotionStep2({ data = {}, onNext, onBack, onSaveDraft }: PromotionStep2Props) {
  const normalizedData = {
    title: '',
    targetAudience: [],
    description: data.description || '',
    coverImage: data.coverImage || '',
    ...data
  };

  const [selectedAudience, setSelectedAudience] = useState<string[]>(normalizedData.targetAudience);
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
    
    if (selectedAudience.length === 0) {
      setErrors({ targetAudience: 'Seleziona almeno un pubblico target' });
      return;
    }

    onNext({
      // Preserve all existing data and add new data
      ...normalizedData,
      targetAudience: selectedAudience
    });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Target</h3>
            <p className="text-sm text-gray-500">
              Seleziona il pubblico di destinazione
            </p>
          </div>
          <ProgressIndicator percentage={30} label="Compila tutti i dati necessari" />
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
          <Button type="button" variant="secondary" onClick={onBack}>
            Indietro
          </Button>
          <Button type="button" variant="secondary" onClick={onSaveDraft}>
            Salva come bozza
          </Button>
          <Button type="submit">
            Continua
          </Button>
        </div>
      </form>

      <div className="col-span-1">
        <ContentPreview
          title={normalizedData.title}
          subtitle={selectedAudience.map(audience => 
            targetAudienceOptions.find(opt => opt.value === audience)?.label
          ).join(', ')}
          image={normalizedData.coverImage}
        />
      </div>
    </div>
  );
}