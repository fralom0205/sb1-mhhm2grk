import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { StatisticsPanel } from '../features/dashboard/components/StatisticsPanel';
import { ContentOverview } from '../features/dashboard/components/ContentOverview';

export function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Benvenuto, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Ecco una panoramica delle tue performance
        </p>
      </div>

      <StatisticsPanel />
      <ContentOverview />
    </div>
  );
}