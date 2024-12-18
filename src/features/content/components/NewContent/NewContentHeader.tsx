import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Content, ContentType } from '../../../../types/content';

interface NewContentHeaderProps {
  onCancel: () => void;
  type: ContentType;
  step: number;
  isSubmitting: boolean;
}

export function NewContentHeader({ onCancel, type, step, isSubmitting }: NewContentHeaderProps) {
  const getSteps = () => {
    switch (type) {
      case 'job':
        return [
          { label: 'Dettagli posizione', completed: step > 1, current: step === 1 },
          { label: 'Requisiti e competenze', completed: step > 2, current: step === 2 },
          { label: 'Benefit e retribuzione', completed: step > 3, current: step === 3 },
          { label: 'Media', completed: step > 4, current: step === 4 },
          { label: 'Revisione', completed: step > 5, current: step === 5 }
        ];
      case 'promotion':
        return [
          { label: 'Informazioni base', completed: step > 1, current: step === 1 },
          { label: 'Pubblico target', completed: step > 2, current: step === 2 },
          { label: 'Contenuto', completed: step > 3, current: step === 3 },
          { label: 'Media', completed: step > 4, current: step === 4 },
          { label: 'Revisione', completed: step > 5, current: step === 5 }
        ];
      case 'event':
        return [
          { label: 'Dettagli evento', completed: step > 1, current: step === 1 },
          { label: 'Partecipanti e agenda', completed: step > 2, current: step === 2 },
          { label: 'Media e pubblicazione', completed: step > 3, current: step === 3 }
        ];
      default:
        return [];
    }
  };

  const steps = getSteps();
  const title = type === 'job' ? 'Nuova offerta di lavoro' :
               type === 'promotion' ? 'Nuova promozione' :
               type === 'event' ? 'Nuovo evento' : 'Nuovo contenuto';

  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <Button variant="secondary" onClick={onCancel} className="!p-2" disabled={isSubmitting}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.label}>
            {index > 0 && <div className="h-1 w-12 bg-gray-200" />}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                ${step.completed ? 'bg-orange-500 border-orange-500 text-white' : 
                  step.current ? 'border-orange-500 text-orange-500' : 
                  'border-gray-300 text-gray-500'}`}
            >
              {step.completed ? '✓' : index + 1}
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`text-sm ${
              step.current ? 'text-orange-500 font-medium' : 'text-gray-500'
            }`}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}