import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JobStep4 } from '../JobStep4';
import { useAuth } from '../../../../../../features/auth/hooks/useAuth';

jest.mock('../../../../../../features/auth/hooks/useAuth');

describe('JobStep4', () => {
  const mockData = {
    title: 'Test Job',
    description: 'Test Description',
    coverImage: null
  };

  const mockProps = {
    data: mockData,
    onNext: jest.fn(),
    onBack: jest.fn(),
    onSaveDraft: jest.fn(),
    isSubmitting: false,
    isDirty: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: { brandName: 'Test Company' } });
  });

  it('renders all form elements', () => {
    render(<JobStep4 {...mockProps} />);
    
    expect(screen.getByText('Media')).toBeInTheDocument();
    expect(screen.getByText('Immagine di copertina')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Professional workspace|Team meeting|Office workspace|Team collaboration/ })).toHaveLength(4);
  });

  it('shows validation error when trying to continue without selecting an image', async () => {
    render(<JobStep4 {...mockProps} />);
    
    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(screen.getByText('Seleziona un\'immagine di copertina')).toBeInTheDocument();
    });

    expect(mockProps.onNext).not.toHaveBeenCalled();
  });

  it('calls onNext with selected image', async () => {
    render(<JobStep4 {...mockProps} />);
    
    // Click the first image option
    const images = screen.getAllByRole('button');
    fireEvent.click(images[0]); // First stock image

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(mockProps.onNext).toHaveBeenCalledWith(
        expect.objectContaining({
          coverImage: expect.stringContaining('unsplash.com')
        })
      );
    });
  });

  it('shows save draft button when form is dirty', () => {
    render(<JobStep4 {...mockProps} isDirty={true} />);
    
    expect(screen.getByText('Salva come bozza')).toBeInTheDocument();
  });

  it('disables buttons when submitting', () => {
    render(<JobStep4 {...mockProps} isSubmitting={true} />);
    
    expect(screen.getByText('Salvataggio...')).toBeDisabled();
    expect(screen.getByText('Indietro')).toBeDisabled();
  });

  it('calls onBack when back button is clicked', () => {
    render(<JobStep4 {...mockProps} />);
    
    fireEvent.click(screen.getByText('Indietro'));
    expect(mockProps.onBack).toHaveBeenCalled();
  });

  it('calls onSaveDraft when save draft button is clicked', () => {
    render(<JobStep4 {...mockProps} isDirty={true} />);
    
    fireEvent.click(screen.getByText('Salva come bozza'));
    expect(mockProps.onSaveDraft).toHaveBeenCalled();
  });

  it('updates preview when image is selected', () => {
    render(<JobStep4 {...mockProps} />);
    
    const images = screen.getAllByRole('button');
    fireEvent.click(images[0]); // First stock image

    // Verify the selected image has the correct styling
    expect(images[0]).toHaveClass('border-orange-500');
  });

  it('maintains selected image when re-rendering', () => {
    const { rerender } = render(
      <JobStep4 
        {...mockProps} 
        data={{ 
          ...mockData, 
          coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'
        }} 
      />
    );

    // Verify the pre-selected image has the correct styling
    const images = screen.getAllByRole('button');
    expect(images[0]).toHaveClass('border-orange-500');

    // Rerender with same props
    rerender(
      <JobStep4 
        {...mockProps} 
        data={{ 
          ...mockData, 
          coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'
        }} 
      />
    );

    // Verify selection is maintained
    expect(images[0]).toHaveClass('border-orange-500');
  });
});