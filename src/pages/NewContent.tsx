import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NewContentType } from '../features/content/components/NewContent/NewContentType';
import { NewContentForm } from '../features/content/components/NewContent/NewContentForm';
import { ContentType } from '../types/content';
import { useLocation } from 'react-router-dom';

export function NewContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state?.type as ContentType;

  const handleCancel = () => {
    navigate('/dashboard/content');
  };

  const handleSelectType = (type: ContentType) => {
    navigate('/dashboard/content/new', { state: { type } });
  };

  if (type) {
    return <NewContentForm type={type} onCancel={handleCancel} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Inserisci contenuto
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Seleziona il tipo di contenuto che vuoi pubblicare
        </p>
      </div>

      <NewContentType onSelect={handleSelectType} />
    </div>
  );
}