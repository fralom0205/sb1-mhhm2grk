import React, { useEffect } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../hooks/useContent';

export function ContentOverview() {
  const navigate = useNavigate();
  const { content, isLoading, error, refresh } = useContent();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="animate-pulse flex justify-between items-center">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Contenuti recenti
          </h2>
          <Button onClick={() => navigate('/dashboard/content/new')} className="hidden sm:flex">
            <Plus className="w-5 h-5 mr-2" />
            Nuovo contenuto
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {content.map((item) => (
          <div
            key={item.id}
            className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            onClick={() => navigate(`/dashboard/content/${item.id}`)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      item.status
                    )}`}
                  >
                    {item.status === 'published' ? 'Pubblicato' : 
                     item.status === 'draft' ? 'Bozza' : 
                     'Archiviato'}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {item.views} visualizzazioni · {item.engagement}% engagement
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {content.length > 0 && <div className="px-6 py-4 border-t border-gray-200">
        <button
          onClick={() => navigate('/dashboard/content')}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Vedi tutti i contenuti
        </button>
      </div>}
    </div>
  );
}