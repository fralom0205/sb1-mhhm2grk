import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EventStep1 } from '../EventStep1';
import { useAuth } from '../../../../../../features/auth/hooks/useAuth';

jest.mock('../../../../../../features/auth/hooks/useAuth');

describe('EventStep1', () => {
  const mockData = {
    title: '',
    eventType: '',
    eventLocation: '',
    venue: '',
    eventDate: '',
    endDate: '',
    capacity: undefined,
    registrationDeadline: '',
    registrationUrl: ''
  };

  const mockOnNext = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: { brandName: 'Test Company' } });
  });

  it('renders all form fields', () => {
    render(
      <EventStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText("Titolo dell'evento")).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo di evento')).toBeInTheDocument();
    expect(screen.getByLabelText('Modalità')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Data inizio')).toBeInTheDocument();
    expect(screen.getByLabelText('Data fine')).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(
      <EventStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(screen.getByText('Il titolo è obbligatorio')).toBeInTheDocument();
      expect(screen.getByText('Seleziona un tipo di evento')).toBeInTheDocument();
      expect(screen.getByText('Seleziona una modalità')).toBeInTheDocument();
      expect(screen.getByText('Inserisci una location')).toBeInTheDocument();
      expect(screen.getByText('Seleziona una data')).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('validates event date is in future', async () => {
    render(
      <EventStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    // Fill required fields
    fireEvent.change(screen.getByLabelText("Titolo dell'evento"), {
      target: { value: 'Test Event' }
    });
    fireEvent.change(screen.getByLabelText('Tipo di evento'), {
      target: { value: 'workshop' }
    });
    fireEvent.change(screen.getByLabelText('Modalità'), {
      target: { value: 'in-person' }
    });
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: 'Test Venue' }
    });

    // Set past date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    fireEvent.change(screen.getByLabelText('Data inizio'), {
      target: { value: yesterday.toISOString().split('T')[0] }
    });

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(screen.getByText("La data dell'evento deve essere futura")).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('calls onNext with valid data', async () => {
    render(
      <EventStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    // Fill all required fields
    fireEvent.change(screen.getByLabelText("Titolo dell'evento"), {
      target: { value: 'Test Event' }
    });
    fireEvent.change(screen.getByLabelText('Tipo di evento'), {
      target: { value: 'workshop' }
    });
    fireEvent.change(screen.getByLabelText('Modalità'), {
      target: { value: 'in-person' }
    });
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: 'Test Venue' }
    });

    // Set future date
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    fireEvent.change(screen.getByLabelText('Data inizio'), {
      target: { value: futureDate.toISOString().split('T')[0] }
    });

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Event',
        eventType: 'workshop',
        eventLocation: 'in-person',
        venue: 'Test Venue',
        eventDate: expect.any(String)
      }));
    });
  });
});