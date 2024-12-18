import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EventStep3 } from '../EventStep3';
import { validateStep } from '../../../../../utils/contentValidation';

jest.mock('../../../../../utils/contentValidation');

describe('EventStep3', () => {
  const mockData = {
    title: 'Test Event',
    description: '',
    speakers: [],
    agenda: []
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
    render(<EventStep3 {...mockProps} />);
    
    expect(screen.getByText('Dettagli evento')).toBeInTheDocument();
    expect(screen.getByLabelText("Descrizione dell'evento")).toBeInTheDocument();
    expect(screen.getByText('Relatori')).toBeInTheDocument();
    expect(screen.getByText('Agenda')).toBeInTheDocument();
  });

  it('shows validation error when description is empty', async () => {
    (validateStep as jest.Mock).mockReturnValue({
      isValid: false,
      errors: { description: 'La descrizione è obbligatoria' }
    });

    render(<EventStep3 {...mockProps} />);
    
    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(screen.getByText('La descrizione è obbligatoria')).toBeInTheDocument();
    });

    expect(mockProps.onNext).not.toHaveBeenCalled();
  });

  it('allows adding and removing speakers', () => {
    render(<EventStep3 {...mockProps} />);
    
    const speakerInput = screen.getByPlaceholderText('Aggiungi un relatore');
    fireEvent.change(speakerInput, { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByText('Aggiungi'));

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Remove speaker
    fireEvent.click(screen.getByText('×'));
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('allows adding and removing agenda items', () => {
    render(<EventStep3 {...mockProps} />);
    
    const agendaInput = screen.getByPlaceholderText("Aggiungi un punto all'agenda");
    fireEvent.change(agendaInput, { target: { value: 'Opening Keynote' } });
    fireEvent.click(screen.getAllByText('Aggiungi')[1]); // Second 'Add' button is for agenda

    expect(screen.getByText('Opening Keynote')).toBeInTheDocument();

    // Remove agenda item
    fireEvent.click(screen.getByText('×'));
    expect(screen.queryByText('Opening Keynote')).not.toBeInTheDocument();
  });

  it('calls onNext with valid data', async () => {
    render(<EventStep3 {...mockProps} />);
    
    // Fill description
    fireEvent.change(screen.getByLabelText("Descrizione dell'evento"), {
      target: { value: 'Test Description' }
    });

    // Add speaker
    const speakerInput = screen.getByPlaceholderText('Aggiungi un relatore');
    fireEvent.change(speakerInput, { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByText('Aggiungi'));

    // Add agenda item
    const agendaInput = screen.getByPlaceholderText("Aggiungi un punto all'agenda");
    fireEvent.change(agendaInput, { target: { value: 'Opening Keynote' } });
    fireEvent.click(screen.getAllByText('Aggiungi')[1]);

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(mockProps.onNext).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        speakers: ['John Doe'],
        agenda: ['Opening Keynote']
      }));
    });
  });

  it('shows save draft button when form is dirty', () => {
    render(<EventStep3 {...mockProps} isDirty={true} />);
    expect(screen.getByText('Salva come bozza')).toBeInTheDocument();
  });

  it('disables buttons when submitting', () => {
    render(<EventStep3 {...mockProps} isSubmitting={true} />);
    
    expect(screen.getByText('Salvataggio...')).toBeDisabled();
    expect(screen.getByText('Indietro')).toBeDisabled();
    expect(screen.getByText('Salva come bozza')).toBeDisabled();
  });

  it('calls onBack when back button is clicked', () => {
    render(<EventStep3 {...mockProps} />);
    
    fireEvent.click(screen.getByText('Indietro'));
    expect(mockProps.onBack).toHaveBeenCalled();
  });

  it('calls onSaveDraft when save draft button is clicked', () => {
    render(<EventStep3 {...mockProps} isDirty={true} />);
    
    fireEvent.click(screen.getByText('Salva come bozza'));
    expect(mockProps.onSaveDraft).toHaveBeenCalled();
  });
});