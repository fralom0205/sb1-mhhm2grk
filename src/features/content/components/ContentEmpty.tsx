import React from 'react';
import { Settings, Briefcase, Calendar } from 'lucide-react';
import { ContentType } from '../types/contentTypes';

interface ContentTypeCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: (type: ContentType) => void;
  type: ContentType;
}

function ContentTypeCard({ icon: Icon, title, description, onClick }: ContentTypeCardProps) {
  return (
    <button
      onClick={() => onClick(type)}
      className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-left w-full"
    >
      <Icon className="w-8 h-8 text-orange-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  );
}

interface ContentEmptyProps {
  onCreateNew: (type: ContentType) => void;
}

export function ContentEmpty({ onCreateNew }: ContentEmptyProps) {
  return (
    <div className="text-center">
      <h2 className="text-lg font-medium text-gray-900 mb-2">
        Crea nuovo contenuto
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Seleziona il tipo di contenuto che vuoi pubblicare
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContentTypeCard
          icon={Settings}
          title="Promozione"
          description="Crea una nuova promozione per gli studenti"
          onClick={() => onCreateNew('promotion')}
          type="promotion"
        />
        <ContentTypeCard
          icon={Briefcase}
          title="Offerta di lavoro"
          description="Pubblica una nuova opportunità lavorativa"
          onClick={() => onCreateNew('job')}
          type="job"
        />
        <ContentTypeCard
          icon={Calendar}
          title="Evento"
          description="Organizza un evento per gli studenti"
          onClick={() => onCreateNew('event')}
          type="event"
        />
      </div>
    </div>
  );
}