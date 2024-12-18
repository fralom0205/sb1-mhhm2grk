import React from 'react';
import { Eye, BarChart2, Calendar, ExternalLink } from 'lucide-react';
import { Content } from '../../../types/content';

interface ContentListProps {
  items: Content[];
  onItemClick: (id: string) => void;
  onPublish?: (id: string) => Promise<void>;
}

export function ContentList({ items, onItemClick, onPublish }: ContentListProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <ExternalLink className="h-full w-full" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Nessun contenuto
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Inizia creando il tuo primo contenuto
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            onClick={() => onItemClick(item.id)}
          >
            <div className="flex items-center">
              {item.coverImage && (
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="h-16 w-16 object-cover rounded-lg mr-4"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <span
                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      item.status || 'draft'
                    )}`}
                  >
                    {item.status === 'published'
                      ? 'Pubblicato'
                      : item.status === 'draft'
                      ? 'Bozza'
                      : 'Archiviato'}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(item.createdAt)}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {item.views} visualizzazioni
                  </span>
                  <span className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    {item.engagement}% engagement
                  </span>
                </div>
                {item.status === 'draft' && onPublish && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPublish(item.id);
                    }}
                    className="mt-2 text-sm text-orange-600 hover:text-orange-700"
                  >
                    Pubblica
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}