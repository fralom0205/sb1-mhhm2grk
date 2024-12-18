import { useState, useCallback, useEffect } from 'react';
import { ContentFilter } from '../types/filterTypes';
import { useSearchParams } from 'react-router-dom';

export function useContentFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ContentFilter>(() => ({
    type: searchParams.get('type') as ContentFilter['type'] || undefined,
    dateRange: {
      start: searchParams.get('start') || '',
      end: searchParams.get('end') || ''
    }
  }));

  // Sync filters with URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.dateRange?.start) params.set('start', filters.dateRange.start);
    if (filters.dateRange?.end) params.set('end', filters.dateRange.end);
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const updateFilters = useCallback((newFilters: Partial<ContentFilter>) => {
    setFilters(prev => {
      const updated = {
        ...prev,
        ...newFilters,
        dateRange: {
          ...prev.dateRange,
          ...(newFilters.dateRange || {})
        }
      };
      
      // Remove empty values
      if (!updated.type) delete updated.type;
      if (!updated.dateRange?.start && !updated.dateRange?.end) {
        delete updated.dateRange;
      }
      
      return updated;
    });
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters: useCallback(() => {
      setFilters({});
      setSearchParams({});
    }, [setSearchParams])
  };