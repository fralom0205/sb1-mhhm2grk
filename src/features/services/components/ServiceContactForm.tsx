import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface ServiceContactFormProps {
  service: {
    title: string;
    description: string;
  };
  onClose: () => void;
}

export function ServiceContactForm({ service, onClose }: ServiceContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {submitted ? 'Richiesta inviata!' : `Richiedi ${service.title}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">
              Grazie per il tuo interesse! Ti contatteremo presto per discutere di {service.title}.
            </p>
            <Button onClick={onClose} fullWidth>
              Chiudi
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-gray-500 mb-6">
              {service.description}
            </p>

            <Input
              label="Nome dell'azienda"
              name="company"
              required
            />

            <Input
              label="Nome e cognome"
              name="name"
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              required
            />

            <Input
              label="Telefono"
              type="tel"
              name="phone"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Messaggio
              </label>
              <textarea
                name="message"
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder="Descrivi brevemente le tue esigenze..."
                required
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
                fullWidth
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? 'Invio in corso...' : 'Invia richiesta'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}