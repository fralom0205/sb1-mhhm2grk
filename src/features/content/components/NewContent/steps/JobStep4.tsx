import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { JobContent } from '../../../../../types/content';

const stockImages = [
  {
    id: 'job-1',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop',
    alt: 'Professional workspace'
  },
  {
    id: 'job-2',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
    alt: 'Team meeting'
  },
  {
    id: 'job-3',
    url: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&auto=format&fit=crop',
    alt: 'Office workspace'
  },
  {
    id: 'job-4',
    url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop',
    alt: 'Team collaboration'
  }
];

interface JobStep4Props {
  data: Partial<JobContent>;
  onNext: (data: Partial<JobContent>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
  isDirty?: boolean;
}

export function JobStep4({ 
  data, 
  onNext, 
  onBack, 
  onSaveDraft,
  isSubmitting = false,
  isDirty = false 
}: JobStep4Props) {
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
              Scegli un'immagine di copertina per la tua offerta di lavoro
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
          type="job"
          data={data}
        />
      </div>
    </div>
  );
}