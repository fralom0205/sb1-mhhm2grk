import React, { useState } from 'react';
import { Input } from '../../../../../components/ui/Input';
import { Select } from '../../../../../components/ui/Select';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { PromotionContent } from '../../../../../types/content';
import { promotionTypeOptions, locationOptions } from '../../../../../constants/contentTypes';

interface PromotionStep1Props {
  data: Partial<PromotionContent>;
  onNext: (data: Partial<PromotionContent>) => void;
  onCancel: () => void;
  onSaveDraft?: () => void;
  isSubmitting?: boolean;
  isDirty?: boolean;
}

export function PromotionStep1({ 
  data, 
  onNext, 
  onCancel, 
  onSaveDraft, 
  isSubmitting = false,
  isDirty = false 
}: PromotionStep1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(data);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Il titolo è obbligatorio';
    if (!formData.promotionType) newErrors.promotionType = 'Seleziona un tipo di promozione';
    if (!formData.location) newErrors.location = 'Seleziona dove riscattare la promo';
    if (!formData.validityPeriod?.start) newErrors.startDate = 'Seleziona una data di inizio';
    if (!formData.validityPeriod?.end) newErrors.endDate = 'Seleziona una data di fine';

    if (formData.validityPeriod?.start && formData.validityPeriod?.end) {
      const start = new Date(formData.validityPeriod.start);
      const end = new Date(formData.validityPeriod.end);
      if (end <= start) {
        newErrors.endDate = 'La data di fine deve essere successiva alla data di inizio';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Proprietà</h3>
            <p className="text-sm text-gray-500">
              Definisci le proprietà base della tua promozione
            </p>
          </div>
          <ProgressIndicator percentage={10} label="Compila tutti i dati necessari" />
        </div>

        <Input
          label="Titolo della promozione"
          name="title"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          required
        />

        <Select
          label="Tipo di promozione"
          name="promotionType"
          value={formData.promotionType || ''}
          onChange={(e) => handleChange('promotionType', e.target.value)}
          options={promotionTypeOptions}
          error={errors.promotionType}
          required
        />

        <Select
          label="Dove riscattare la promo?"
          name="location"
          value={formData.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          options={locationOptions}
          error={errors.location}
          required
        />

        <Input
          label="Utilizzabile una volta sola?"
          type="text"
          name="usageLimit"
          value={formData.usageLimit || ''}
          onChange={(e) => handleChange('usageLimit', e.target.value)}
          placeholder="Es: Una volta per utente"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data inizio"
            type="date"
            name="startDate"
            value={formData.validityPeriod?.start || ''}
            onChange={(e) => handleChange('validityPeriod', {
              ...formData.validityPeriod,
              start: e.target.value
            })}
            error={errors.startDate}
            required
          />
          <Input
            label="Data fine"
            type="date"
            name="endDate"
            value={formData.validityPeriod?.end || ''}
            onChange={(e) => handleChange('validityPeriod', {
              ...formData.validityPeriod,
              end: e.target.value
            })}
            error={errors.endDate}
            required
          />
        </div>

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
          <Button type="submit" disabled={isSubmitting}>
            Continua
          </Button>
        </div>
      </form>

      <div className="col-span-1">
        <ContentPreview
          title={formData.title}
          subtitle={
            formData.promotionType === 'discount' ? 'Sconto' :
            formData.promotionType === 'offer' ? 'Offerta speciale' : 'Evento'
          }
          image={formData.coverImage}
          type="promotion"
          data={formData}
        />
      </div>
    </div>
  );
}