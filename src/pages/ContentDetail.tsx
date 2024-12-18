import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart2, Eye, Calendar, Clock, Edit, Save, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getContentById, updateContent } from '../features/content/services';
import { Content } from '../features/content/types';

export function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      try {
        const data = await getContentById(id);
        if (!data) {
          setError('Content not found');
          return;
        }
        setContent(data);
      } catch (err) {
        setError('Errore nel caricamento del contenuto');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [id]);

  const handlePublish = async () => {
    if (!content?.id) return;
    
    setIsUpdating(true);
    try {
      await updateContent(content.id, {
        ...content,
        status: 'published',
        publishDate: new Date().toISOString()
      });
      
      navigate('/dashboard/content', {
        state: { message: 'Contenuto pubblicato con successo' }
      });
    } catch (err) {
      console.error('Error publishing content:', err);
      setError('Errore durante la pubblicazione');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!content?.id) return;
    
    setIsUpdating(true);
    try {
      await updateContent(content.id, {
        ...content,
        status: 'draft'
      });
      
      navigate('/dashboard/content', {
        state: { message: 'Bozza salvata con successo' }
      });
    } catch (err) {
      console.error('Error saving draft:', err);
      setError('Errore durante il salvataggio');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error || 'Contenuto non trovato'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(content.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {content.views} visualizzazioni
              </span>
              <span className="flex items-center gap-1">
                <BarChart2 className="w-4 h-4" />
                {content.engagement}% engagement
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                content.status === 'published' ? 'bg-green-100 text-green-800' :
                content.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {content.status === 'published' ? 'Pubblicato' :
                 content.status === 'draft' ? 'Bozza' : 'Archiviato'}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            {content.status === 'draft' && (
              <Button onClick={handlePublish} disabled={isUpdating}>
                <Send className="w-4 h-4 mr-2" />
                Pubblica
              </Button>
            )}
            <Button variant="secondary" onClick={() => navigate(`/dashboard/content/${id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              Modifica
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          {content.coverImage && (
            <img
              src={content.coverImage}
              alt={content.title}
              className="w-full aspect-video rounded-lg object-cover"
            />
          )}
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Descrizione</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{content.description}</p>
          </div>

          {content.type === 'promotion' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Dettagli promozione</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                  <dd className="mt-1 text-sm text-gray-900">{content.promotionType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Dove utilizzare</dt>
                  <dd className="mt-1 text-sm text-gray-900">{content.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Validità</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {content.type === 'promotion' ? content.validityPeriod ? (
                      <>
                        Dal {formatDate(content.validityPeriod.start)} al{' '}
                        {formatDate(content.validityPeriod.end)}
                      </>
                    ) : (
                      'Non specificata'
                    ) : 'Non specificata'}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiche</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Visualizzazioni totali</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{content.views}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tasso di engagement</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">{content.engagement}%</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ultima modifica</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {content.updatedAt ? new Date(content.updatedAt).toLocaleString() : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}