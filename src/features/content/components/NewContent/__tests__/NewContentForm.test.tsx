import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { NewContentForm } from '../NewContentForm';
import { useContentFormManager } from '../../../hooks/useContentFormManager';
import { useAutoSave } from '../../../hooks/useAutoSave';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../../../../auth/hooks/useAuth');
jest.mock('../../../hooks/useContentFormManager');
jest.mock('../../../hooks/useAutoSave');

describe('NewContentForm', () => {
  const mockNavigate = jest.fn();
  const mockUser = { id: 'test-user-123', name: 'Test User' };
  const mockOnCancel = jest.fn();
  const mockHandleNext = jest.fn();
  const mockHandleBack = jest.fn();
  const mockSaveDraft = jest.fn();
  const mockPublish = jest.fn();

  const mockFormManager = {
    step: 1,
    formData: {},
    error: null,
    isSubmitting: false,
    isDirty: false,
    handleNext: mockHandleNext,
    handleBack: mockHandleBack,
    saveDraft: mockSaveDraft,
    publish: mockPublish
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useContentFormManager as jest.Mock).mockReturnValue(mockFormManager);
    (useAutoSave as jest.Mock).mockImplementation(() => {});
  });

  it('renders form for promotion type', () => {
    render(<NewContentForm type="promotion" onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Nuova promozione')).toBeInTheDocument();
    expect(screen.getByText('Informazioni base')).toBeInTheDocument();
  });

  it('renders form for job type', () => {
    render(<NewContentForm type="job" onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Nuova offerta di lavoro')).toBeInTheDocument();
    expect(screen.getByText('Dettagli posizione')).toBeInTheDocument();
  });

  it('renders form for event type', () => {
    render(<NewContentForm type="event" onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Nuovo evento')).toBeInTheDocument();
    expect(screen.getByText('Dettagli evento')).toBeInTheDocument();
  });

  it('shows error message when present', () => {
    (useContentFormManager as jest.Mock).mockReturnValue({
      ...mockFormManager,
      error: 'Test error message',
      step: 2
    });

    render(<NewContentForm type="promotion" onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('does not show error message on step 1', () => {
    (useContentFormManager as jest.Mock).mockReturnValue({
      ...mockFormManager,
      error: 'Test error message',
      step: 1
    });

    render(<NewContentForm type="promotion" onCancel={mockOnCancel} />);
    
    expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
  });

  it('shows loading state when user is not available', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    render(<NewContentForm type="promotion" onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Loading user information...')).toBeInTheDocument();
  });

  it('initializes auto-save', () => {
    render(<NewContentForm type="promotion" onCancel={mockOnCancel} />);
    
    expect(useAutoSave).toHaveBeenCalledWith(
      mockFormManager.formData,
      mockFormManager.isDirty
    );
  });

  it('handles step navigation', async () => {
    render(<NewContentForm type="promotion" onCancel={mockOnCancel} />);
    
    const stepData = { title: 'Test Promotion' };
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText('Titolo della promozione'), {
      target: { value: stepData.title }
    });
    fireEvent.click(screen.getByText('Continua'));

    await waitFor(() => {
      expect(mockHandleNext).toHaveBeenCalledWith(stepData);
    });
  });

  it('disables form submission while submitting', () => {
    (useContentFormManager as jest.Mock).mockReturnValue({
      ...mockFormManager,
      isSubmitting: true
    });

    render(<NewContentForm type="promotion" onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Continua')).toBeDisabled();
  });

  it('shows draft save button when form is dirty', () => {
    (useContentFormManager as jest.Mock).mockReturnValue({
      ...mockFormManager,
      isDirty: true,
      step: 2
    });

    render(<NewContentForm type="promotion" onCancel={mockOnCancel} />);
    
    const draftButton = screen.getByText('Salva come bozza');
    expect(draftButton).toBeInTheDocument();
    
    fireEvent.click(draftButton);
    expect(mockSaveDraft).toHaveBeenCalled();
  });

  it('handles publish action', async () => {
    (useContentFormManager as jest.Mock).mockReturnValue({
      ...mockFormManager,
      step: 5
    });

    render(<NewContentForm type="promotion" onCancel={mockOnCancel} />);
    
    const publishButton = screen.getByText('Pubblica promozione');
    fireEvent.click(publishButton);

    await waitFor(() => {
      expect(mockPublish).toHaveBeenCalled();
    });
  });

  it('renders correct step component based on content type and step', () => {
    const { rerender } = render(<NewContentForm type="promotion" onCancel={mockOnCancel} />);
    expect(screen.getByText('Informazioni base')).toBeInTheDocument();

    (useContentFormManager as jest.Mock).mockReturnValue({
      ...mockFormManager,
      step: 2
    });
    rerender(<NewContentForm type="promotion" onCancel={mockOnCancel} />);
    expect(screen.getByText('Pubblico target')).toBeInTheDocument();
  });

  it('handles unsupported content type', () => {
    // @ts-ignore - Testing invalid type
    render(<NewContentForm type="invalid" onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Error: Unsupported content type')).toBeInTheDocument();
  });
});