import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { EventContent } from '../../../../../types/content';
import { validateStep } from '../../../../../utils/contentValidation';

interface EventStep3Props {
  data: Partial<EventContent>;
  onNext: (data: Partial<EventContent>) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
  isDirty?: boolean;
}

export function EventStep3({ 
  data, 
  onNext, 
  onBack, 
  onSaveDraft,
  isSubmitting = false,
  isDirty = false 
}: EventStep3Props) {
  const [description, setDescription] = useState(data.description || '');
  const [speakers, setSpeakers] = useState<string[]>(data.speakers || []);
  const [agenda, setAgenda] = useState<string[]>(data.agenda || []);
  const [newSpeaker, setNewSpeaker] = useState('');
  const [newAgendaItem, setNewAgendaItem] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addSpeaker = () => {
    if (newSpeaker.trim()) {
      setSpeakers([...speakers, newSpeaker.trim()]);
      setNewSpeaker('');
    }
  };

  const addAgendaItem = () => {
    if (newAgendaItem.trim()) {
      setAgenda([...agenda, newAgendaItem.trim()]);
      setNewAgendaItem('');
    }
  };

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index));
  };

  const removeAgendaItem = (index: number) => {
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const stepData = {
      ...data,
      description,
      speakers,
      agenda
    };

    // Validate step data
    const validation = validateStep('event', 3, stepData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onNext(stepData);
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="col-span-2 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">Dettagli evento</h3>
            <p className="text-sm text-gray-500">
              Descrivi l'evento e aggiungi i dettagli
            </p>
          </div>
          <ProgressIndicator percentage={70} label="Compila tutti i dati necessari" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrizione dell'evento
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            placeholder="Descrivi il tuo evento in modo dettagliato..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relatori
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpeaker}
                onChange={(e) => setNewSpeaker(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder="Aggiungi un relatore"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpeaker())}
              />
              <Button type="button" onClick={addSpeaker}>
                Aggiungi
              </Button>
            </div>
            <ul className="space-y-2">
              {speakers.map((speaker, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-gray-600">{speaker}</span>
                  <button
                    type="button"
                    onClick={() => removeSpeaker(index)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agenda
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newAgendaItem}
                onChange={(e) => setNewAgendaItem(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder="Aggiungi un punto all'agenda"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAgendaItem())}
              />
              <Button type="button" onClick={addAgendaItem}>
                Aggiungi
              </Button>
            </div>
            <ul className="space-y-2">
              {agenda.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-gray-600">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeAgendaItem(index)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
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
          subtitle={description}
          image={data.coverImage}
          type="event"
          data={data}
        />
      </div>
    </div>
  );
}