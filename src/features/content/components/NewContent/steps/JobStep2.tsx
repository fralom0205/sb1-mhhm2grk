import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { JobContent } from '../../../../../types/content';

interface JobStep2Props {
  data: Partial<JobContent>;
  onNext: (data: Partial<JobContent>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
}

export function JobStep2({ data, onNext, onBack, onSaveDraft }: JobStep2Props) {
  const [requirements, setRequirements] = useState<string[]>(data.requirements || []);
  const [newRequirement, setNewRequirement] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (requirements.length === 0) {
      setErrors({ requirements: 'Inserisci almeno un requisito' });
      return;
    }

    onNext({ requirements });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Requisiti</h3>
            <p className="text-sm text-gray-500">
              Definisci i requisiti per la posizione
            </p>
          </div>
          <ProgressIndicator percentage={40} label="Compila tutti i dati necessari" />
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
          subtitle={requirements.join(', ')}
          image={data.coverImage}
          type="job"
          data={data}
        />
      </div>
    </div>
  );
}