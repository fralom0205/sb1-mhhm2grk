import React from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { PromotionContent } from '../../../../../types/content';
import { promotionTypeOptions, locationOptions } from '../../../../../constants/contentTypes';

interface PromotionStep5Props {
  data?: Partial<PromotionContent>;
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
}

export function PromotionStep5({ 
  data = {}, 
  onBack, 
  onSaveDraft, 
  onPublish,
  isSubmitting 
}: PromotionStep5Props) {
  const mockAiPrediction = {
    score: 92,
    feedback: "La promozione ha un'alta probabilità di successo basata su dati storici di promozioni simili."
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Anteprima e AI success prediction
            </h3>
            <p className="text-sm text-gray-500">
              Verifica l'anteprima della tua promozione
            </p>
          </div>
          <ProgressIndicator 
            percentage={95} 
            label="Compila tutti i dati necessari" 
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">{data.title}</h4>
              <p className="text-sm text-gray-500">
                {promotionTypeOptions.find(opt => opt.value === data.promotionType)?.label} · 
                {locationOptions.find(opt => opt.value === data.location)?.label}
              </p>
            </div>
            {data.coverImage && (
              <img 
                src={data.coverImage}
                alt="Cover" 
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
          </div>
          <p className="text-sm text-gray-600">{data.description}</p>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Dettagli promozione:</h5>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Validità</dt>
                <dd className="text-gray-900">
                  Dal {new Date(data.validityPeriod?.start || '').toLocaleDateString()} al{' '}
                  {new Date(data.validityPeriod?.end || '').toLocaleDateString()}
                </dd>
              </div>
              {data.usageLimit && (
                <div>
                  <dt className="text-gray-500">Limite utilizzo</dt>
                  <dd className="text-gray-900">{data.usageLimit}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-medium text-gray-900 mb-2">AI Prediction</h4>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">OTTIMO</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {mockAiPrediction.feedback}
          </p>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-900">
              {mockAiPrediction.score}%
            </div>
            <Button variant="secondary" size="sm">
              Modifica
            </Button>
          </div>
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
          <Button 
            onClick={onPublish}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Pubblicazione...' : 'Pubblica promozione'}
          </Button>
        </div>
      </div>

      <div className="col-span-1">
        <ContentPreview
          title={data.title}
          subtitle={data.description}
          image={data.coverImage}
        />
      </div>
    </div>
  );
}