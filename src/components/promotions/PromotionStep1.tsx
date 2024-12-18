import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { promotionTypeOptions, locationOptions } from '../../constants/promotionOptions';
import { PromotionStepProps } from '../../types/promotion';

export function PromotionStep1({ data, onNext, onCancel }: PromotionStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const stepData = {
      type: formData.get('type') as string,
      location: formData.get('location') as string,
      usageLimit: formData.get('usageLimit') as string,
      validityPeriod: {
        start: formData.get('startDate') as string,
        end: formData.get('endDate') as string,
      },
    };

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!stepData.type) newErrors.type = 'Seleziona un tipo di promozione';
    if (!stepData.location) newErrors.location = 'Seleziona dove riscattare la promo';
    if (!stepData.validityPeriod.start) newErrors.startDate = 'Seleziona una data di inizio';
    if (!stepData.validityPeriod.end) newErrors.endDate = 'Seleziona una data di fine';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(stepData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Tipo di promozione"
        name="type"
        options={promotionTypeOptions}
        defaultValue={data.type}
        error={errors.type}
        required
      />

      <Select
        label="Dove riscattare la promo?"
        name="location"
        options={locationOptions}
        defaultValue={data.location}
        error={errors.location}
        required
      />

      <Input
        label="Utilizzabile una volta sola?"
        type="text"
        name="usageLimit"
        defaultValue={data.usageLimit}
        placeholder="Es: Una volta per utente"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Periodo di validità"
          type="date"
          name="startDate"
          defaultValue={data.validityPeriod?.start}
          error={errors.startDate}
          required
        />
        <Input
          label="&nbsp;"
          type="date"
          name="endDate"
          defaultValue={data.validityPeriod?.end}
          error={errors.endDate}
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annulla creazione
        </Button>
        <Button type="submit">
          Continua
        </Button>
      </div>
    </form>
  );
}