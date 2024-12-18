import React from 'react';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { NotificationFilter, NotificationType } from '../types/notificationTypes';

interface NotificationFiltersProps {
  filters: NotificationFilter & {
    type: string;
    read?: boolean;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  onFilterChange: (filters: NotificationFilter) => void;
}

export function NotificationFilters({ filters, onFilterChange }: NotificationFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Select
        label="Tipo"
        name="type"
        value={filters?.type || ''}
        onChange={(e) => onFilterChange({ 
          ...filters, 
          type: e.target.value as NotificationType | ''
        })}
        options={[
          { value: '', label: 'Tutti i tipi' },
          { value: 'info', label: 'Informazioni' },
          { value: 'success', label: 'Successo' },
          { value: 'warning', label: 'Avviso' },
          { value: 'error', label: 'Errore' },
        ]}
      />

      <Select
        label="Stato"
        name="read"
        value={filters?.read?.toString() || ''}
        onChange={(e) => onFilterChange({ 
          ...filters, 
          read: e.target.value === '' ? undefined : e.target.value === 'true'
        })}
        options={[
          { value: '', label: 'Tutti gli stati' },
          { value: 'false', label: 'Non letti' },
          { value: 'true', label: 'Letti' },
        ]}
      />

      <Input
        type="date"
        label="Da"
        value={filters?.dateRange?.start || ''}
        onChange={(e) =>
          onFilterChange({
            ...filters,
            dateRange: { 
              ...filters.dateRange,
              start: e.target.value 
            },
          })
        }
      />

      <Input
        type="date"
        label="A"
        value={filters?.dateRange?.end || ''}
        onChange={(e) =>
          onFilterChange({
            ...filters,
            dateRange: { 
              ...filters.dateRange,
              end: e.target.value 
            },
          })
        }
      />
    </div>
  );
}