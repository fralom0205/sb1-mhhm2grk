import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { PromotionContent } from '../../../../../types/content';

interface PromotionStep3Props {
  data?: Partial<PromotionContent>;
  onNext: (data: Partial<PromotionContent>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
}

export function PromotionStep3({ 
  data = {}, 
  onNext, 
  onBack, 
  onSaveDraft, 
  onPublish,
  isSubmitting 
}: PromotionStep3Props) {
  const normalizedData = {
    title: '',
    description: '',
    coverImage: '',
    ...data
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const description = formData.get('description') as string;
    
    if (!description?.trim()) {
      setErrors({ description: 'La descrizione è obbligatoria' });
      return;
    }
    
    onNext({ 
      // Preserve all existing data and add new data
      ...normalizedData,
      description
    });
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
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onSaveDraft}
            disabled={isSubmitting}
          >
            Salva come bozza
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Continua
          </Button>
        </div>
      </form>

      <div className="col-span-1">
        <ContentPreview
          title={normalizedData.title}
          subtitle={normalizedData.description}
          image={normalizedData.coverImage}
        />
      </div>
    </div>
  );
}