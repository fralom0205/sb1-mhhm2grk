import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { User } from '../../auth/types/authTypes';

interface WelcomeHeaderProps {
  user: User | null;
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Benvenuto, {user?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestisci le tue promozioni e raggiungi gli studenti in tutta Italia
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => {}}>
            <Download className="w-5 h-5 mr-2" />
            Report
          </Button>
          <Button onClick={() => navigate('/dashboard/new-promotion')}>
            <Plus className="w-5 h-5 mr-2" />
            Nuova promozione
          </Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Oggi', 'Questa settimana', 'Questo mese', 'Totale'].map((period) => (
          <div key={period} className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm font-medium text-orange-600">{period}</p>
            <p className="mt-1 text-2xl font-semibold text-orange-900">
              {period === 'Oggi' && '125'}
              {period === 'Questa settimana' && '842'}
              {period === 'Questo mese' && '2.4k'}
              {period === 'Totale' && '12.5k'}
            </p>
            <p className="mt-1 text-sm text-orange-600">studenti raggiunti</p>
          </div>
        ))}
      </div>
    </div>
  );
}