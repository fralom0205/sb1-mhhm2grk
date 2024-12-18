import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EventStep2 } from '../EventStep2';
import { validateStep } from '../../../../../utils/contentValidation';

jest.mock('../../../../../utils/contentValidation');

describe('EventStep2', () => {
  const mockData = {
    title: 'Test Event',
    description: 'Test Description',
    targetAudience: []
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
    (validateStep as jest.Mock).mockReturnValue({ isValid: true, errors: {} });
  });

  it('renders all form elements', () => {
    render(<EventStep2 {...mockProps} />);
    
    expect(screen.getByText('Pubblico target')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(7); // 5 audience options + back + continue
  });

  it('shows validation error when no audience is selected', async () => {
    (validateStep as jest.Mock).mockReturnValue({
      isValid: false,
      errors: { targetAudience: 'Seleziona almeno un pubblico target' }
    });

    render(<EventStep2 {...mockProps} />);
    
    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(screen.getByText('Seleziona almeno un pubblico target')).toBeInTheDocument();
    });

    expect(mockProps.onNext).not.toHaveBeenCalled();
  });

  it('allows selecting multiple audience options', () => {
    render(<EventStep2 {...mockProps} />);
    
    const options = screen.getAllByRole('button').filter(button => 
      !['Indietro', 'Continua'].includes(button.textContent || '')
    );

    fireEvent.click(options[0]);
    fireEvent.click(options[1]);

    expect(options[0]).toHaveClass('border-orange-500');
    expect(options[1]).toHaveClass('border-orange-500');
  });

  it('calls onNext with selected audience', async () => {
    (validateStep as jest.Mock).mockReturnValue({ isValid: true, errors: {} });

    render(<EventStep2 {...mockProps} />);
    
    const option = screen.getByText('Studente universitario');
    fireEvent.click(option);
    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(mockProps.onNext).toHaveBeenCalledWith(
        expect.objectContaining({
          targetAudience: ['university_student']
        })
      );
    });
  });

  it('shows save draft button when form is dirty', () => {
    render(<EventStep2 {...mockProps} isDirty={true} />);
    
    expect(screen.getByText('Salva come bozza')).toBeInTheDocument();
  });

  it('disables buttons when submitting', () => {
    render(<EventStep2 {...mockProps} isSubmitting={true} />);
    
    expect(screen.getByText('Salvataggio...')).toBeDisabled();
    expect(screen.getByText('Indietro')).toBeDisabled();
    expect(screen.getByText('Salva come bozza')).toBeDisabled();
  });

  it('calls onBack when back button is clicked', () => {
    render(<EventStep2 {...mockProps} />);
    
    fireEvent.click(screen.getByText('Indietro'));
    expect(mockProps.onBack).toHaveBeenCalled();
  });

  it('calls onSaveDraft when save draft button is clicked', () => {
    render(<EventStep2 {...mockProps} isDirty={true} />);
    
    fireEvent.click(screen.getByText('Salva come bozza'));
    expect(mockProps.onSaveDraft).toHaveBeenCalled();
  });

  it('maintains selected audience when re-rendering', () => {
    const { rerender } = render(
      <EventStep2 
        {...mockProps} 
        data={{ 
          ...mockData, 
          targetAudience: ['university_student'] 
        }} 
      />
    );

    expect(screen.getByText('Studente universitario').closest('button'))
      .toHaveClass('border-orange-500');

    rerender(
      <EventStep2 
        {...mockProps} 
        data={{ 
          ...mockData, 
          targetAudience: ['university_student'] 
        }} 
      />
    );

    expect(screen.getByText('Studente universitario').closest('button'))
      .toHaveClass('border-orange-500');
  });

  it('updates preview when audience is selected', () => {
    render(<EventStep2 {...mockProps} />);
    
    const option = screen.getByText('Studente universitario');
    fireEvent.click(option);

    // Verify the preview shows the selected audience
    expect(screen.getByText('Studente universitario', { selector: '.text-gray-600' }))
      .toBeInTheDocument();
  });
});