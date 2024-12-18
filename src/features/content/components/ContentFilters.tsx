import React from 'react';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { X } from 'lucide-react';
import { ContentFilter } from '../types/filterTypes';

interface ContentFiltersProps {
  filters: ContentFilter;
  onFilterChange: (filters: ContentFilter) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function ContentFilters({ filters, onFilterChange, onClose, isOpen }: ContentFiltersProps) {
  if (!isOpen) return null;

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Filtri</h3>
        <Button variant="secondary" onClick={onClose} className="!p-2">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Tipo di contenuto"
          name="type"
          value={filters.type || ''}
          onChange={(e) => onFilterChange({ ...filters, type: e.target.value as any })}
          options={[
            { value: '', label: 'Tutti i tipi' },
            { value: 'promotion', label: 'Promozioni' },
            { value: 'job', label: 'Offerte di lavoro' },
            { value: 'event', label: 'Eventi' }
          ]}
        />

        <Input
          type="date"
          label="Data inizio"
          value={filters.dateRange?.start || ''}
          onChange={(e) => handleDateChange('start', e.target.value)}
        />

        <Input
          type="date"
          label="Data fine"
          value={filters.dateRange?.end || ''}
          onChange={(e) => handleDateChange('end', e.target.value)}
        />
      </div>
    </div>
  );
}