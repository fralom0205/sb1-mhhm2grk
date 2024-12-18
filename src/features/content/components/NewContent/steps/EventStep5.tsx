import React from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { EventContent } from '../../../../../types/content';
import { eventTypeOptions, eventLocationOptions } from '../../../../../constants/contentTypes';

interface EventStep5Props {
  data: Partial<EventContent>;
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function EventStep5({ 
  data, 
  onBack, 
  onSaveDraft, 
  onPublish,
  isSubmitting,
  error 
}: EventStep5Props) {
  const mockAiPrediction = {
    score: 88,
    feedback: "L'evento ha un'alta probabilità di successo basata su eventi simili nella stessa area."
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              Verifica l'anteprima del tuo evento
            </p>
          </div>
          <ProgressIndicator 
            percentage={95} 
            label="Compila tutti i dati necessari" 
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">{data.title}</h4>
              <p className="text-sm text-gray-500">
                {eventTypeOptions.find(opt => opt.value === data.eventType)?.label} · 
                {eventLocationOptions.find(opt => opt.value === data.eventLocation)?.label}
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
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{data.description}</p>
            
            <div className="border-t pt-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Dettagli evento:</h5>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Data inizio</dt>
                  <dd className="text-gray-900">{formatDate(data.eventDate)}</dd>
                </div>
                {data.endDate && (
                  <div>
                    <dt className="text-gray-500">Data fine</dt>
                    <dd className="text-gray-900">{formatDate(data.endDate)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500">Location</dt>
                  <dd className="text-gray-900">{data.venue}</dd>
                </div>
                {data.capacity && (
                  <div>
                    <dt className="text-gray-500">Capacità</dt>
                    <dd className="text-gray-900">{data.capacity} partecipanti</dd>
                  </div>
                )}
              </dl>
            </div>

            {data.speakers && data.speakers.length > 0 && (
              <div className="border-t pt-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Relatori:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {data.speakers.map((speaker, index) => (
                    <li key={index}>{speaker}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.agenda && data.agenda.length > 0 && (
              <div className="border-t pt-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Agenda:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {data.agenda.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
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
          </div>
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
            {isSubmitting ? 'Pubblicazione...' : 'Pubblica evento'}
          </Button>
        </div>
      </div>

      <div className="col-span-1">
        <ContentPreview
          title={data.title}
          subtitle={data.description}
          image={data.coverImage}
          type="event"
          data={data}
        />
      </div>
    </div>
  );
}