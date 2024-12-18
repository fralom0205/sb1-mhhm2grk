import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { JobContent } from '../../../../../types/content';

interface JobStep3Props {
  data: Partial<JobContent>;
  onNext: (data: Partial<JobContent>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
}

export function JobStep3({ data, onNext, onBack, onSaveDraft }: JobStep3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requirements, setRequirements] = useState<string[]>(data.requirements || []);
  const [benefits, setBenefits] = useState<string[]>(data.benefits || []);
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const stepData = {
      description: formData.get('description') as string,
      requirements,
      benefits,
      experience: formData.get('experience') as string,
    };

    if (!stepData.description?.trim()) {
      setErrors({ description: 'La descrizione è obbligatoria' });
      return;
    }

    if (requirements.length === 0) {
      setErrors({ requirements: 'Inserisci almeno un requisito' });
      return;
    }

    onNext(stepData);
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Requisiti e benefit</h3>
            <p className="text-sm text-gray-500">
              Descrivi i requisiti e i benefit della posizione
            </p>
          </div>
          <ProgressIndicator percentage={60} label="Compila tutti i dati necessari" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrizione della posizione
          </label>
          <textarea
            name="description"
            rows={6}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            defaultValue={data.description}
            placeholder="Descrivi la posizione in dettaglio..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requisiti
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder="Aggiungi un requisito"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement}>
                Aggiungi
              </Button>
            </div>
            {errors.requirements && (
              <p className="text-sm text-red-600">{errors.requirements}</p>
            )}
            <ul className="space-y-2">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-gray-600">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Benefit (opzionali)
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder="Aggiungi un benefit"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <Button type="button" onClick={addBenefit}>
                Aggiungi
              </Button>
            </div>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-gray-600">{benefit}</span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
          subtitle={data.description}
          image={data.coverImage}
          type="job"
          data={data}
        />
      </div>
    </div>
  );
}