import React from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';

interface ContentPreviewProps {
  title: string;
  subtitle?: string;
  image?: string;
}

export function ContentPreview({ title, subtitle, image }: ContentPreviewProps) {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {image && (
        <div className="aspect-video w-full">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-orange-500 mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-gray-600 mb-4">
            {subtitle}
          </p>
        )}
        
        <div className="flex items-center mt-6 pt-4 border-t border-gray-100">
          {user?.companyLogo ? (
            <img 
              src={user.companyLogo}
              alt={user.brandName || 'Company logo'}
              className="h-8 object-contain"
            />
          ) : (
            <span className="text-sm text-gray-500">
              {user?.brandName || 'Company name'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}