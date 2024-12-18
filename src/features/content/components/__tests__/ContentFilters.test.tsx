import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContentFilters } from '../ContentFilters';
import { ContentFilter } from '../../types/filterTypes';

describe('ContentFilters', () => {
  const mockFilters: ContentFilter = {
    dateRange: {
      start: '',
      end: ''
    }
  };

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter inputs', () => {
    render(
      <ContentFilters 
        filters={mockFilters} 
        onFilterChange={mockOnFilterChange} 
      />
    );
    
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByLabelText('Da')).toBeInTheDocument();
    expect(screen.getByLabelText('A')).toBeInTheDocument();
  });

  it('handles type filter change', () => {
    render(
      <ContentFilters 
        filters={mockFilters} 
        onFilterChange={mockOnFilterChange} 
      />
    );
    
    const typeSelect = screen.getByLabelText('Tipo');
    fireEvent.change(typeSelect, { target: { value: 'promotion' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      type: 'promotion'
    });
  });

  it('handles date range changes', () => {
    render(
      <ContentFilters 
        filters={mockFilters} 
        onFilterChange={mockOnFilterChange} 
      />
    );
    
    const startDate = screen.getByLabelText('Da');
    fireEvent.change(startDate, { target: { value: '2024-01-01' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      dateRange: {
        ...mockFilters.dateRange,
        start: '2024-01-01'
      }
    });
  });
});