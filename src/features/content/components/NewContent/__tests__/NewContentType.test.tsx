import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewContentType } from '../NewContentType';
import { ContentType } from '../../../types';

describe('NewContentType', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all content type options', () => {
    render(<NewContentType onSelect={mockOnSelect} />);
    
    expect(screen.getByText('Promozione')).toBeInTheDocument();
    expect(screen.getByText('Offerta di lavoro')).toBeInTheDocument();
    expect(screen.getByText('Evento')).toBeInTheDocument();
  });

  it('handles promotion selection', () => {
    render(<NewContentType onSelect={mockOnSelect} />);
    
    const promotionButton = screen.getByText('Promozione').closest('button');
    fireEvent.click(promotionButton!);
    
    expect(mockOnSelect).toHaveBeenCalledWith('promotion' as ContentType);
  });

  it('handles job selection', () => {
    render(<NewContentType onSelect={mockOnSelect} />);
    
    const jobButton = screen.getByText('Offerta di lavoro').closest('button');
    fireEvent.click(jobButton!);
    
    expect(mockOnSelect).toHaveBeenCalledWith('job' as ContentType);
  });

  it('handles event selection', () => {
    render(<NewContentType onSelect={mockOnSelect} />);
    
    const eventButton = screen.getByText('Evento').closest('button');
    fireEvent.click(eventButton!);
    
    expect(mockOnSelect).toHaveBeenCalledWith('event' as ContentType);
  });

  it('displays descriptions for each type', () => {
    render(<NewContentType onSelect={mockOnSelect} />);
    
    expect(screen.getByText('Crea una nuova promozione per gli studenti')).toBeInTheDocument();
    expect(screen.getByText('Pubblica una nuova opportunità lavorativa')).toBeInTheDocument();
    expect(screen.getByText('Organizza un evento per gli studenti')).toBeInTheDocument();
  });
});