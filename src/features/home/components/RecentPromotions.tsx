import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ExternalLink, Users, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../auth/hooks/useAuth';
import { promotionRepository } from '../../../db';
import { Promotion } from '../../../types/database';

export function RecentPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadPromotions = async () => {
      if (!user?.id) return;
      try {
        const data = await promotionRepository.findByUser(user.id);
        setPromotions(data.slice(0, 3)); // Get only the 3 most recent
      } catch (error) {
        console.error('Error loading promotions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPromotions();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Le tue promozioni recenti
          </h3>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:p-6">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Plus className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nessuna promozione
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Inizia creando la tua prima promozione per raggiungere gli studenti
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/dashboard/new-promotion')}>
                <Plus className="w-5 h-5 mr-2" />
                Crea promozione
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Le tue promozioni recenti
        </h3>
        <Button onClick={() => navigate('/dashboard/promotions/new')}>
          <Plus className="w-5 h-5 mr-2" />
          Nuova promozione
        </Button>
      </div>
      <div className="divide-y divide-gray-200">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
            onClick={() => navigate(`/dashboard/promotions/${promo.id}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-orange-600 truncate">
                    {promo.title}
                  </p>
                  <span
                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      promo.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : promo.status === 'draft'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {promo.status === 'active'
                      ? 'Attiva'
                      : promo.status === 'draft'
                      ? 'Bozza'
                      : 'Scaduta'}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Users className="flex-shrink-0 mr-1.5 h-4 w-4" />
                  {promo.views} visualizzazioni
                  <Calendar className="flex-shrink-0 mx-1.5 h-4 w-4" />
                  Scade il {new Date(promo.validityPeriod.end).toLocaleDateString('it-IT')}
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}