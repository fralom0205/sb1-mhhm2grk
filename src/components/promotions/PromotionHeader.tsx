import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProgressIndicator } from '../../types/promotion';

interface PromotionHeaderProps {
  onCancel: () => void;
  progress: ProgressIndicator[];
}

export function PromotionHeader({ onCancel, progress }: PromotionHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Nuova promozione</h2>
        <Button variant="secondary" onClick={onCancel} className="!p-2">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {progress.map((step, index) => (
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
        {progress.map((step, index) => (
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