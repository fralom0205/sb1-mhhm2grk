import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useContent } from '../hooks/useContent';
import { ContentList } from '../features/content/components/ContentList';
import { ContentFilters } from '../features/content/components/ContentFilters';
import { useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { updateContent } from '../features/content/services/contentService';

export function Content() {
  const navigate = useNavigate();
  const location = useLocation();
  const { content, isLoading, error, refresh } = useContent();
  const [showFilters, setShowFilters] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateRange: {
      start: '',
      end: ''
    } 
  });

  const handlePublish = async (id: string) => {
    setIsPublishing(true);
    try {
      await updateContent(id, {
        status: 'published',
        publishDate: new Date().toISOString()
      });
      refresh();
    } catch (err) {
      console.error('Error publishing content:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">I tuoi contenuti</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestisci e monitora tutti i tuoi contenuti pubblicati
            </p>
          </div>
          <div>
            <Button variant="secondary" onClick={() => setShowFilters(true)}>
              <Filter className="w-5 h-5 mr-2" />
              Filtri
            </Button>
            <Button onClick={() => navigate('/dashboard/content/new')}>
              <Plus className="w-5 h-5 mr-2" />
              Nuovo contenuto
            </Button>
          </div>
        </div>
      </div>

      {location.state?.message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-700">{location.state.message}</p>
        </div>
      )}

      <ContentFilters
        filters={filters}
        onFilterChange={setFilters}
        onClose={() => setShowFilters(false)}
        isOpen={showFilters}
      />

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ContentList
          items={content}
          onItemClick={(id) => navigate(`/dashboard/content/${id}`)}
          onPublish={handlePublish}
        />
      )}
    </div>
  );
}