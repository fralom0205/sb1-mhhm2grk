import React, { useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Button } from '../../../../components/ui/Button';
import { ContentStepProps } from '../../types/newContentTypes';
import { ContentType } from '../../../../types/content';

const contentTypeOptions = [
  { value: 'article', label: 'Articolo' },
  { value: 'event', label: 'Evento' },
  { value: 'promotion', label: 'Promozione' },
];

export function ContentStep1({ data, onNext, onCancel }: ContentStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const stepData = {
      type: formData.get('type') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    };

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!stepData.type) newErrors.type = 'Seleziona un tipo di contenuto';
    if (!stepData.title) newErrors.title = 'Inserisci un titolo';
    if (!stepData.description) newErrors.description = 'Inserisci una descrizione';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({
      ...stepData,
      type: stepData.type as ContentType
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Tipo di contenuto"
        name="type"
        options={contentTypeOptions}
        defaultValue={data.type}
        error={errors.type}
        required
      />

      <Input
        label="Titolo"
        name="title"
        defaultValue={data.title}
        error={errors.title}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrizione
        </label>
        <textarea
          name="description"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          defaultValue={data.description}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit">
          Continua
        </Button>
      </div>
    </form>
  );
}