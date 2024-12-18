import React from 'react';
import { TrendingUp, Users, Calendar, Target, ShoppingBag, Share2 } from 'lucide-react';
import { StatCard } from './StatCard';

const stats = [
  { label: 'Promozioni attive', value: '12', icon: TrendingUp, trend: '+2 questa settimana' },
  { label: 'Studenti raggiunti', value: '2.4k', icon: Users, trend: '+20% dal mese scorso' },
  { label: 'Campagne in programma', value: '3', icon: Calendar, trend: 'Prossimo lancio in 5 giorni' },
  { label: 'Tasso di conversione', value: '3.2%', icon: Target, trend: '+0.8% questo mese' },
  { label: 'Acquisti effettuati', value: '156', icon: ShoppingBag, trend: '12 nelle ultime 24h' },
  { label: 'Condivisioni social', value: '432', icon: Share2, trend: '+28 oggi' },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}