import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { Content } from '../../../types/contentTypes';

const stockImages = [
  {
    id: 'student-1',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
    alt: 'Students studying together'
  },
  {
    id: 'student-2', 
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop',
    alt: 'Student with laptop'
  },
  {
    id: 'student-3',
    url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop',
    alt: 'University campus'
  },
  {
    id: 'student-4',
    url: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop',
    alt: 'Students in library'
  }
];

interface ContentStep4Props {
  data: Partial<Content>;
  onNext: (data: Partial<Content>) => void;
  onSaveDraft: () => void;
  onBack: () => void;
}

export function ContentStep4({ data, onNext, onSaveDraft, onBack }: ContentStep4Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(data.coverImage || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ coverImage: selectedImage });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Immagini</h3>
            <p className="text-sm text-gray-500">
              Scegli le immagini per il tuo contenuto
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
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={onBack}>
            Indietro
          </Button>
          <Button type="button" variant="secondary" onClick={onSaveDraft}>
            Salva come bozza
          </Button>
          <Button type="submit">
            Continua
          </Button>
        </div>
      </form>

      <div className="col-span-1">
        <ContentPreview
          title={data.title}
          subtitle={data.description}
          image={selectedImage}
        />
      </div>
    </div>
  );
}