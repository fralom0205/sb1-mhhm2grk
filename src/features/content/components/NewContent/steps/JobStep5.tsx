import React from 'react';
import { Button } from '../../../../../components/ui/Button';
import { ProgressIndicator } from '../../ProgressIndicator';
import { ContentPreview } from '../../ContentPreview';
import { JobContent } from '../../../../../types/content';
import { jobTypeOptions, jobLocationOptions } from '../../../../../constants/contentTypes';

interface JobStep5Props {
  data: Partial<JobContent>;
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function JobStep5({ 
  data, 
  onBack, 
  onSaveDraft, 
  onPublish,
  isSubmitting,
  error 
}: JobStep5Props) {
  const mockAiPrediction = {
    score: 92,
    feedback: "L'offerta di lavoro ha un'alta probabilità di successo basata su dati storici di posizioni simili."
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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
              Verifica l'anteprima della tua offerta di lavoro
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
                {jobTypeOptions.find(opt => opt.value === data.jobType)?.label} · 
                {jobLocationOptions.find(opt => opt.value === data.jobLocation)?.label}
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
            
            {data.requirements && data.requirements.length > 0 && (
              <div className="border-t pt-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Requisiti:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {data.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.benefits && data.benefits.length > 0 && (
              <div className="border-t pt-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Benefit:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {data.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t pt-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {data.salary && (
                  <div>
                    <dt className="text-gray-500">Retribuzione</dt>
                    <dd className="text-gray-900">
                      {data.salary.min && data.salary.max
                        ? `${data.salary.min} - ${data.salary.max}`
                        : data.salary.min || data.salary.max} €/{data.salary.period}
                    </dd>
                  </div>
                )}
                {data.applicationDeadline && (
                  <div>
                    <dt className="text-gray-500">Scadenza candidature</dt>
                    <dd className="text-gray-900">
                      {formatDate(data.applicationDeadline)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
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
            {isSubmitting ? 'Pubblicazione...' : 'Pubblica offerta'}
          </Button>
        </div>
      </div>

      <div className="col-span-1">
        <ContentPreview
          title={data.title}
          subtitle={data.description}
          image={data.coverImage}
          type="job"
          data={data}
        />
      </div>
    </div>
  );
}