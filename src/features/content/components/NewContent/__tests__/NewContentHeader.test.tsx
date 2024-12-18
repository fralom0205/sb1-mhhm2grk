import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewContentHeader } from '../NewContentHeader';

describe('NewContentHeader', () => {
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correct title for promotion', () => {
    render(
      <NewContentHeader 
        type="promotion"
        step={1}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );
    
    expect(screen.getByText('Nuova promozione')).toBeInTheDocument();
  });

  it('renders correct title for job', () => {
    render(
      <NewContentHeader 
        type="job"
        step={1}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );
    
    expect(screen.getByText('Nuova offerta di lavoro')).toBeInTheDocument();
  });

  it('renders correct title for event', () => {
    render(
      <NewContentHeader 
        type="event"
        step={1}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );
    
    expect(screen.getByText('Nuovo evento')).toBeInTheDocument();
  });

  it('handles cancel action', () => {
    render(
      <NewContentHeader 
        type="promotion"
        step={1}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );
    
    const cancelButton = screen.getByRole('button');
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows correct step indicators', () => {
    render(
      <NewContentHeader 
        type="promotion"
        step={2}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );
    
    // First step should be completed
    const steps = screen.getAllByRole('presentation');
    expect(steps[0]).toHaveClass('bg-orange-500');
    // Current step should be highlighted
    expect(steps[1]).toHaveClass('border-orange-500');
  });

  it('disables cancel button when submitting', () => {
    render(
      <NewContentHeader 
        type="promotion"
        step={1}
        onCancel={mockOnCancel}
        isSubmitting={true}
      />
    );
    
    const cancelButton = screen.getByRole('button');
    expect(cancelButton).toBeDisabled();
  });

  it('shows correct number of steps for each content type', () => {
    const { rerender } = render(
      <NewContentHeader 
        type="promotion"
        step={1}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );
    
    // Promotion should have 5 steps
    expect(screen.getAllByRole('presentation')).toHaveLength(5);

    rerender(
      <NewContentHeader 
        type="job"
        step={1}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );
    
    // Job should have 5 steps
    expect(screen.getAllByRole('presentation')).toHaveLength(5);

    rerender(
      <NewContentHeader 
        type="event"
        step={1}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );
    
    // Event should have 3 steps
    expect(screen.getAllByRole('presentation')).toHaveLength(3);
  });

  it('shows correct step labels', () => {
    render(
      <NewContentHeader 
        type="promotion"
        step={1}
        onCancel={mockOnCancel}
        isSubmitting={false}
      />
    );
    
    expect(screen.getByText('Informazioni base')).toBeInTheDocument();
    expect(screen.getByText('Pubblico target')).toBeInTheDocument();
    expect(screen.getByText('Contenuto')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
    expect(screen.getByText('Revisione')).toBeInTheDocument();
  });
});