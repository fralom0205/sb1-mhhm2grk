import React, { useState } from 'react';
import { Input } from '../../../../../components/ui/Input';
import { Select } from '../../../../../components/ui/Select';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { JobContent } from '../../../../../types/content';
import { jobTypeOptions, jobLocationOptions, salaryPeriodOptions } from '../../../../../constants/contentTypes';

interface JobStep1Props {
  data: Partial<JobContent>;
  onNext: (data: Partial<JobContent>) => void;
  onCancel: () => void;
  onSaveDraft?: () => void;
  isSubmitting?: boolean;
  isDirty?: boolean;
}

export function JobStep1({ 
  data, 
  onNext, 
  onCancel, 
  onSaveDraft,
  isSubmitting = false,
  isDirty = false 
}: JobStep1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(data);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Il titolo è obbligatorio';
    if (!formData.jobType) newErrors.jobType = 'Seleziona un tipo di lavoro';
    if (!formData.jobLocation) newErrors.jobLocation = 'Seleziona una modalità di lavoro';
    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = 'Seleziona una data di scadenza';
    } else {
      const deadline = new Date(formData.applicationDeadline);
      if (deadline <= new Date()) {
        newErrors.applicationDeadline = 'La data di scadenza deve essere futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const isValid = validateForm();
    if (!isValid) return;
    
    onNext({
      ...formData,
      type: 'job',
      step: 1
    });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Dettagli posizione</h3>
            <p className="text-sm text-gray-500">
              Inserisci i dettagli dell'offerta di lavoro
            </p>
          </div>
          <ProgressIndicator percentage={10} label="Compila tutti i dati necessari" />
        </div>

        <Input
          label="Titolo della posizione"
          name="title"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo di contratto"
            name="jobType"
            value={formData.jobType || ''}
            onChange={(e) => handleChange('jobType', e.target.value)}
            options={jobTypeOptions}
            error={errors.jobType}
            required
          />

          <Select
            label="Modalità di lavoro"
            name="jobLocation"
            value={formData.jobLocation || ''}
            onChange={(e) => handleChange('jobLocation', e.target.value)}
            options={jobLocationOptions}
            error={errors.jobLocation}
            required
          />
        </div>

        <Input
          label="Dipartimento"
          name="department"
          value={formData.department || ''}
          onChange={(e) => handleChange('department', e.target.value)}
          placeholder="Es: Marketing, IT, HR"
        />

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Range retributivo (opzionale)
          </label>
          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              name="salaryMin"
              placeholder="Min"
              value={formData.salary?.min || ''}
              onChange={(e) => handleChange('salary', {
                ...formData.salary,
                min: parseInt(e.target.value)
              })}
            />
            <Input
              type="number"
              name="salaryMax"
              placeholder="Max"
              value={formData.salary?.max || ''}
              onChange={(e) => handleChange('salary', {
                ...formData.salary,
                max: parseInt(e.target.value)
              })}
            />
            <Select
              name="salaryPeriod"
              value={formData.salary?.period || 'year'}
              onChange={(e) => handleChange('salary', {
                ...formData.salary,
                period: e.target.value
              })}
              options={salaryPeriodOptions}
            />
          </div>
        </div>

        <Input
          label="Scadenza candidature"
          type="date"
          name="applicationDeadline"
          value={formData.applicationDeadline || ''}
          onChange={(e) => handleChange('applicationDeadline', e.target.value)}
          error={errors.applicationDeadline}
          required
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
              disabled={isSubmitting || !validateForm()}
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
          subtitle={`${jobTypeOptions.find(opt => opt.value === formData.jobType)?.label || ''} · 
                    ${jobLocationOptions.find(opt => opt.value === formData.jobLocation)?.label || ''}`}
          image={formData.coverImage}
          type="job"
          data={formData}
        />
      </div>
    </div>
  );
}