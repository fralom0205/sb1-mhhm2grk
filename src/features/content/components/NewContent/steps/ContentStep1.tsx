import React, { useState } from 'react';
import { Input } from '../../../../../components/ui/Input';
import { Select } from '../../../../../components/ui/Select';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { PromotionContent } from '../../../../../types/content';
import { locationOptions } from '../../../../../constants/contentTypes';

interface ContentStep1Props {
  data: Partial<PromotionContent>;
  onNext: (data: Partial<PromotionContent>) => void;
  onCancel: () => void;
}

export function ContentStep1({ data, onNext, onCancel }: ContentStep1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const stepData = {
      title: formData.get('title') as string,
      type: 'promotion',
      promotionType: formData.get('promotionType') as 'discount' | 'offer' | 'event',
      location: formData.get('location') as string,
      usageLimit: formData.get('usageLimit') as string,
      validityPeriod: {
        start: formData.get('startDate') as string,
        end: formData.get('endDate') as string,
      },
    };

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!stepData.title) newErrors.title = 'Il titolo è obbligatorio';
    if (!stepData.promotionType) newErrors.promotionType = 'Seleziona un tipo di promozione';
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
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Proprietà</h3>
            <p className="text-sm text-gray-500">
              Definisci le proprietà base della tua promozione
            </p>
          </div>
          <ProgressIndicator percentage={10} label="Compila tutti i dati necessari per pubblicare la tua promozione" />
        </div>

        <Input
          label="Titolo della promozione"
          name="title"
          defaultValue={data.title}
          error={errors.title}
          required
        />

        <Select
          label="Tipo di promozione"
          name="promotionType"
          options={[
            { value: 'discount', label: 'Sconto' },
            { value: 'offer', label: 'Offerta speciale' },
            { value: 'event', label: 'Evento' },
          ]}
          defaultValue={data.promotionType}
          error={errors.promotionType}
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Periodo di validità
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                name="startDate"
                defaultValue={data.validityPeriod?.start}
                aria-label="Data inizio"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
            <div>
              <input
                type="date"
                name="endDate"
                defaultValue={data.validityPeriod?.end}
                aria-label="Data fine"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annulla creazione
          </Button>
          <div className="relative inline-flex group">
            <Button
              type="button"
              variant="secondary"
              disabled
              className="opacity-50 cursor-not-allowed"
            >
              Salva come bozza
            </Button>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Disponibile dal prossimo step
            </div>
          </div>
          <Button type="submit">
            Continua
          </Button>
        </div>
      </form>

      <div className="col-span-1">
        <ContentPreview
          title={data.title || 'Titolo promozione'}
          subtitle={data.promotionType === 'discount' ? 'Sconto' :
                   data.promotionType === 'offer' ? 'Offerta speciale' : 'Evento'}
        />
      </div>
    </div>
  );
}