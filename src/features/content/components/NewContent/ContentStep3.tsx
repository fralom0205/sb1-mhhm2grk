import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Select } from '../../../../components/ui/Select';
import { Input } from '../../../../components/ui/Input';
import { ContentStepProps } from '../../types/newContentTypes';

const targetAudienceOptions = [
  { value: 'university_student', label: 'Studenti universitari' },
  { value: 'high_school_student', label: 'Studenti scuole superiori' },
  { value: 'university_staff', label: 'Staff universitario' },
  { value: 'all', label: 'Tutti' },
];

export function ContentStep3({ data, onNext, onBack }: ContentStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedAudience, setSelectedAudience] = useState<string[]>(
    data.targetAudience || []
  );

  const toggleAudience = (value: string) => {
    setSelectedAudience(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const stepData = {
      status: formData.get('status') as 'draft' | 'published',
      publishDate: formData.get('publishDate') as string,
      expiryDate: formData.get('expiryDate') as string,
      targetAudience: selectedAudience,
    };

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!stepData.status) newErrors.status = 'Seleziona uno stato';
    if (stepData.status === 'published' && !stepData.publishDate) {
      newErrors.publishDate = 'Seleziona una data di pubblicazione';
    }
    if (selectedAudience.length === 0) {
      newErrors.targetAudience = 'Seleziona almeno un pubblico target';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(stepData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Stato"
        name="status"
        options={[
          { value: 'draft', label: 'Bozza' },
          { value: 'published', label: 'Pubblicato' },
        ]}
        defaultValue={data.status}
        error={errors.status}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Data di pubblicazione"
          name="publishDate"
          type="datetime-local"
          defaultValue={data.publishDate}
          error={errors.publishDate}
        />
        <Input
          label="Data di scadenza"
          name="expiryDate"
          type="datetime-local"
          defaultValue={data.expiryDate}
          error={errors.expiryDate}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pubblico target
        </label>
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
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          Indietro
        </Button>
        <Button type="submit">
          Pubblica contenuto
        </Button>
      </div>
    </form>
  );
}