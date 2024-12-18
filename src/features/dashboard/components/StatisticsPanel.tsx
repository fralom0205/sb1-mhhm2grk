import React, { useMemo } from 'react';
import { BarChart2, TrendingUp, Users, Target, ShoppingBag, Share2 } from 'lucide-react';
import { StatCard } from './StatCard';
import { useStats } from '../hooks/useStats';

export function StatisticsPanel() {
  const { stats, isLoading } = useStats();

  const statistics = useMemo(() => [
    {
      label: 'Totale studenti raggiunti',
      value: stats ? `${(stats.totalReach / 1000).toFixed(1)}k` : '0',
      trend: stats?.totalReach > 0 ? '+15% rispetto al mese scorso' : 'Nessun dato disponibile',
      icon: Users,
      color: 'orange'
    },
    {
      label: 'Engagement rate',
      value: stats ? `${stats.conversionRate.toFixed(1)}%` : '0%',
      trend: stats?.conversionRate > 0 ? '+5% rispetto alla media' : 'Nessun dato disponibile',
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Conversioni',
      value: stats?.totalPurchases.toString() || '0',
      trend: stats?.totalPurchases > 0 ? '150 nelle ultime 24h' : 'Nessun dato disponibile',
      icon: Target,
      color: 'blue'
    },
    {
      label: 'Acquisti effettuati',
      value: stats?.totalPurchases.toString() || '0',
      trend: stats?.totalPurchases > 0 ? '+12% questa settimana' : 'Nessun dato disponibile',
      icon: ShoppingBag,
      color: 'purple'
    },
    {
      label: 'Promozioni attive',
      value: stats?.activePromotions.toString() || '0',
      trend: stats?.activePromotions > 0 ? 'Ottimo andamento' : 'Nessuna promozione attiva',
      icon: BarChart2,
      color: 'indigo'
    },
    {
      label: 'Condivisioni social',
      value: stats?.socialShares.toString() || '0',
      trend: stats?.socialShares > 0 ? '+28% questo mese' : 'Nessuna condivisione',
      icon: Share2,
      color: 'pink'
    }
  ], [stats]);

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Statistiche generali
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Statistiche generali
        </h2>
        {!stats && !isLoading && (
          <p className="hidden sm:block text-sm text-gray-500">
            Inizia a creare promozioni per vedere le statistiche
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {statistics.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
          />
        ))}
      </div>
    </div>
  );
}