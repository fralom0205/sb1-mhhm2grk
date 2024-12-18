import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Content } from '../../../types/content';
import { getTypeLabel, getDateInfo } from '../utils/contentFormatters';

interface ContentPreviewProps {
  title?: string;
  subtitle?: string;
  image?: string | null;
  details?: React.ReactNode;
  type?: Content['type'];
  data?: Partial<Content>;
}

export function ContentPreview({ 
  title, 
  subtitle, 
  image, 
  details,
  type, 
  data 
}: ContentPreviewProps) {
  const { user } = useAuth();

  const typeLabel = type ? getTypeLabel(type, data) : '';
  const dateInfo = data ? getDateInfo(type, data) : '';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {image ? (
        <div className="aspect-video w-full">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">
            {type === 'job' ? 'Anteprima offerta di lavoro' :
             type === 'event' ? 'Anteprima evento' :
             'Anteprima promozione'}
          </span>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-orange-500 mb-2 line-clamp-2">
          {title || 'Titolo contenuto'}
        </h3>
        
        {getTypeLabel() && (
          <p className="text-sm text-gray-600 mb-2">
            {getTypeLabel()}
          </p>
        )}
        {subtitle && (
          <p className="text-gray-600 line-clamp-3 mb-2">
            {subtitle}
          </p>
        )}
        {details && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {details}
          </div>
        )}
        {dateInfo && (
          <p className="text-sm text-gray-500 mb-4">
            {dateInfo}
          </p>
        )}
        
        <div className="flex items-center pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {user?.brandName || 'Company name'}
          </span>
        </div>
      </div>
    </div>
  );
}