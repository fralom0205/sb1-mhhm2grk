import React from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ContentType } from '../types/contentTypes';

interface ContentHeaderProps {
  onCreateNew: (type: ContentType) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export function ContentHeader({ onCreateNew, onToggleFilters, showFilters }: ContentHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">I tuoi contenuti</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestisci e monitora tutti i tuoi contenuti pubblicati
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="secondary" 
            onClick={onToggleFilters}
            className={showFilters ? 'bg-gray-100' : ''}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtri
          </Button>
          <Button onClick={() => onCreateNew('promotion')}>
            <Plus className="w-5 h-5 mr-2" />
            Nuovo contenuto
          </Button>
        </div>
      </div>
    </div>
  );
}