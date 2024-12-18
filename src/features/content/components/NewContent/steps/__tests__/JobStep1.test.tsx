import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JobStep1 } from '../JobStep1';
import { useAuth } from '../../../../../../features/auth/hooks/useAuth';

jest.mock('../../../../../../features/auth/hooks/useAuth');

describe('JobStep1', () => {
  const mockData = {
    title: '',
    jobType: '',
    jobLocation: '',
    department: '',
    salary: {
      min: undefined,
      max: undefined,
      period: 'year'
    },
    applicationDeadline: ''
  };

  const mockOnNext = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnSaveDraft = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: { brandName: 'Test Company' } });
  });

  it('renders all form fields', () => {
    render(
      <JobStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Titolo della posizione')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo di contratto')).toBeInTheDocument();
    expect(screen.getByLabelText('Modalità di lavoro')).toBeInTheDocument();
    expect(screen.getByLabelText('Dipartimento')).toBeInTheDocument();
    expect(screen.getByLabelText('Scadenza candidature')).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(
      <JobStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(screen.getByText('Il titolo è obbligatorio')).toBeInTheDocument();
      expect(screen.getByText('Seleziona un tipo di lavoro')).toBeInTheDocument();
      expect(screen.getByText('Seleziona una modalità di lavoro')).toBeInTheDocument();
      expect(screen.getByText('Seleziona una data di scadenza')).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('validates application deadline is in future', async () => {
    render(
      <JobStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    // Fill required fields
    fireEvent.change(screen.getByLabelText('Titolo della posizione'), {
      target: { value: 'Software Engineer' }
    });
    fireEvent.change(screen.getByLabelText('Tipo di contratto'), {
      target: { value: 'full-time' }
    });
    fireEvent.change(screen.getByLabelText('Modalità di lavoro'), {
      target: { value: 'remote' }
    });

    // Set past date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    fireEvent.change(screen.getByLabelText('Scadenza candidature'), {
      target: { value: yesterday.toISOString().split('T')[0] }
    });

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(screen.getByText('La data di scadenza deve essere futura')).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('calls onNext with valid data', async () => {
    render(
      <JobStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    // Fill all required fields
    fireEvent.change(screen.getByLabelText('Titolo della posizione'), {
      target: { value: 'Software Engineer' }
    });
    fireEvent.change(screen.getByLabelText('Tipo di contratto'), {
      target: { value: 'full-time' }
    });
    fireEvent.change(screen.getByLabelText('Modalità di lavoro'), {
      target: { value: 'remote' }
    });

    // Set future date
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    fireEvent.change(screen.getByLabelText('Scadenza candidature'), {
      target: { value: futureDate.toISOString().split('T')[0] }
    });

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Software Engineer',
        jobType: 'full-time',
        jobLocation: 'remote',
        applicationDeadline: expect.any(String)
      }));
    });
  });

  it('handles salary range inputs', async () => {
    render(
      <JobStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Min'), {
      target: { value: '30000' }
    });
    fireEvent.change(screen.getByPlaceholderText('Max'), {
      target: { value: '50000' }
    });

    // Fill other required fields
    fireEvent.change(screen.getByLabelText('Titolo della posizione'), {
      target: { value: 'Software Engineer' }
    });
    fireEvent.change(screen.getByLabelText('Tipo di contratto'), {
      target: { value: 'full-time' }
    });
    fireEvent.change(screen.getByLabelText('Modalità di lavoro'), {
      target: { value: 'remote' }
    });

    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    fireEvent.change(screen.getByLabelText('Scadenza candidature'), {
      target: { value: futureDate.toISOString().split('T')[0] }
    });

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith(expect.objectContaining({
        salary: {
          min: 30000,
          max: 50000,
          period: 'year'
        }
      }));
    });
  });
});