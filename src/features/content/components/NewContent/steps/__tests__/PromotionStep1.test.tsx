import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PromotionStep1 } from '../PromotionStep1';
import { useAuth } from '../../../../../../features/auth/hooks/useAuth';

jest.mock('../../../../../../features/auth/hooks/useAuth');

describe('PromotionStep1', () => {
  const mockData = {
    title: '',
    promotionType: '',
    location: '',
    validityPeriod: {
      start: '',
      end: ''
    }
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
      <PromotionStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Titolo della promozione')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo di promozione')).toBeInTheDocument();
    expect(screen.getByLabelText('Dove riscattare la promo?')).toBeInTheDocument();
    expect(screen.getByLabelText('Data inizio')).toBeInTheDocument();
    expect(screen.getByLabelText('Data fine')).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(
      <PromotionStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(screen.getByText('Il titolo è obbligatorio')).toBeInTheDocument();
      expect(screen.getByText('Seleziona un tipo di promozione')).toBeInTheDocument();
      expect(screen.getByText('Seleziona dove riscattare la promo')).toBeInTheDocument();
      expect(screen.getByText('Seleziona una data di inizio')).toBeInTheDocument();
      expect(screen.getByText('Seleziona una data di fine')).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('validates validity period dates', async () => {
    render(
      <PromotionStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    // Fill required fields
    fireEvent.change(screen.getByLabelText('Titolo della promozione'), {
      target: { value: 'Test Promotion' }
    });
    fireEvent.change(screen.getByLabelText('Tipo di promozione'), {
      target: { value: 'discount' }
    });
    fireEvent.change(screen.getByLabelText('Dove riscattare la promo?'), {
      target: { value: 'online' }
    });

    // Set end date before start date
    fireEvent.change(screen.getByLabelText('Data inizio'), {
      target: { value: '2024-02-01' }
    });
    fireEvent.change(screen.getByLabelText('Data fine'), {
      target: { value: '2024-01-01' }
    });

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(screen.getByText('La data di fine deve essere successiva alla data di inizio')).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('calls onNext with valid data', async () => {
    render(
      <PromotionStep1
        data={mockData}
        onNext={mockOnNext}
        onCancel={mockOnCancel}
      />
    );

    // Fill all required fields
    fireEvent.change(screen.getByLabelText('Titolo della promozione'), {
      target: { value: 'Test Promotion' }
    });
    fireEvent.change(screen.getByLabelText('Tipo di promozione'), {
      target: { value: 'discount' }
    });
    fireEvent.change(screen.getByLabelText('Dove riscattare la promo?'), {
      target: { value: 'online' }
    });
    fireEvent.change(screen.getByLabelText('Data inizio'), {
      target: { value: '2024-01-01' }
    });
    fireEvent.change(screen.getByLabelText('Data fine'), {
      target: { value: '2024-12-31' }
    });

    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Promotion',
        promotionType: 'discount',
        location: 'online',
        validityPeriod: {
          start: '2024-01-01',
          end: '2024-12-31'
        }
      }));
    });
  });
});