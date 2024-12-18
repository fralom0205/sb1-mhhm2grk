import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { PromotionContent } from '../../../../../types/content';

const stockImages = [
  {
    id: 'promo-1',
    url: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&auto=format&fit=crop',
    alt: 'Student discount'
  },
  {
    id: 'promo-2',
    url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&auto=format&fit=crop',
    alt: 'Special offer'
  },
  {
    id: 'promo-3',
    url: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=800&auto=format&fit=crop',
    alt: 'Student event'
  },
  {
    id: 'promo-4',
    url: 'https://images.unsplash.com/photo-1556742208-999815fca738?w=800&auto=format&fit=crop',
    alt: 'Student promotion'
  }
];

interface PromotionStep4Props {
  data?: Partial<PromotionContent>;
  onNext: (data: Partial<PromotionContent>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
}

export function PromotionStep4({ data = {}, onNext, onBack, onSaveDraft }: PromotionStep4Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(data.coverImage || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      // Preserve all existing data and add new data
      ...data,
      coverImage: selectedImage || undefined
    });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Immagini</h3>
            <p className="text-sm text-gray-500">
              Scegli un'immagine per la tua promozione
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