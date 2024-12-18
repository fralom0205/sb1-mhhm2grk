import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { getContentById, updateContent } from '../features/content/services';
import { Content } from '../features/content/types';
import { targetAudienceOptions, locationOptions } from '../constants/contentTypes';
import { ArrowLeft, Save } from 'lucide-react';

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

export function EditContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatDateForInput = (timestamp: any) => {
    if (!timestamp) return '';
    // Handle both Timestamp objects and ISO strings
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      try {
        const data = await getContentById(id);
        setContent(data);
        setSelectedImage(data?.coverImage || null);
      } catch (err) {
        setError('Errore nel caricamento del contenuto');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content?.id) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const updates = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      coverImage: selectedImage,
      validityPeriod: {
        start: formData.get('startDate') as string,
        end: formData.get('endDate') as string,
      },
      updatedAt: new Date().toISOString()
    };

    setIsSaving(true);
    try {
      await updateContent(content.id, updates);
      navigate(`/dashboard/content/${content.id}`, {
        state: { message: 'Contenuto aggiornato con successo' }
      });
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Errore durante il salvataggio');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error || 'Contenuto non trovato'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifica contenuto</h1>
            <p className="mt-1 text-sm text-gray-500">
              Modifica i dettagli del tuo contenuto
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate(`/dashboard/content/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna ai dettagli
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <Input
              label="Titolo"
              name="title"
              defaultValue={content.title}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrizione
              </label>
              <textarea
                name="description"
                rows={6}
                defaultValue={content.description}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <Select
              label="Dove riscattare"
              name="location"
              options={locationOptions}
              defaultValue={content.location}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Data inizio"
                type="date"
                name="startDate"
                defaultValue={formatDateForInput(content.validityPeriod?.start)}
                required
              />
              <Input
                label="Data fine"
                type="date"
                name="endDate"
                defaultValue={formatDateForInput(content.validityPeriod?.end)}
                required
              />
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
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/dashboard/content/${id}`)}
          >
            Annulla
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvataggio...' : 'Salva modifiche'}
          </Button>
        </div>
      </form>
    </div>
  );
}