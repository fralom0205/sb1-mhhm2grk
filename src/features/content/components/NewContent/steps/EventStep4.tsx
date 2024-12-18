import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { EventContent } from '../../../../../types/content';

const stockImages = [
  {
    id: 'event-1',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    alt: 'Conference hall'
  },
  {
    id: 'event-2',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
    alt: 'Workshop space'
  },
  {
    id: 'event-3',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop',
    alt: 'Networking event'
  },
  {
    id: 'event-4',
    url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop',
    alt: 'Event space'
  }
];

interface EventStep4Props {
  data: Partial<EventContent>;
  onNext: (data: Partial<EventContent>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
  isDirty?: boolean;
}

export function EventStep4({ 
  data, 
  onNext, 
  onBack, 
  onSaveDraft,
  isSubmitting = false,
  isDirty = false 
}: EventStep4Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(data.coverImage || null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedImage) {
      setError('Seleziona un\'immagine di copertina');
      return;
    }

    onNext({ coverImage: selectedImage });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Media</h3>
            <p className="text-sm text-gray-500">
              Scegli un'immagine di copertina per il tuo evento
            </p>
          </div>
          <ProgressIndicator percentage={80} label="Compila tutti i dati necessari" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Immagine di copertina
          </label>
          <div className="grid grid-cols-2 gap-4">
            {stockImages.map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImage(image.url)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === image.url
                    ? 'border-orange-500 ring-2 ring-orange-500 ring-opacity-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onBack}
            disabled={isSubmitting}
          >
            Indietro
          </Button>
          {isDirty && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onSaveDraft}
              disabled={isSubmitting}
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
          title={data.title}
          subtitle={data.description}
          image={selectedImage}
          type="event"
          data={data}
        />
      </div>
    </div>
  );
}