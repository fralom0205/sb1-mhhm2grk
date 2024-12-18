import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { targetAudienceOptions } from '../../../../../constants/contentTypes';
import { Content } from '../../../types/contentTypes';

interface ContentStep3Props {
  data: Partial<Content>;
  onNext: (data: Partial<Content>) => void;
  onSaveDraft: () => void;
  onBack: () => void;
}

export function ContentStep3({ data, onNext, onSaveDraft, onBack }: ContentStep3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const description = formData.get('description') as string;
    
    if (!description?.trim()) {
      setErrors({ description: 'La descrizione è obbligatoria' });
      return;
    }

    onNext({ description });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Descrizione</h3>
            <p className="text-sm text-gray-500">
              Descrivi nel dettaglio la tua promozione
            </p>
          </div>
          <ProgressIndicator percentage={60} label="Compila tutti i dati necessari" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrizione dettagliata
          </label>
          <textarea
            name="description"
            rows={8}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            defaultValue={data.description}
            placeholder="Descrivi la tua promozione in modo dettagliato..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

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
          title={data.title}
          subtitle={data.targetAudience?.map(audience => 
            targetAudienceOptions.find(opt => opt.value === audience)?.label
          ).join(', ')}
          image={data.coverImage}
        />
      </div>
    </div>
  );
}