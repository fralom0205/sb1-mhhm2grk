import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContentStep5 } from '../ContentStep5';
import { validateContent } from '../../../../../utils/contentValidation';

jest.mock('../../../../../utils/contentValidation');

describe('ContentStep5', () => {
  const mockData = {
  };

  const mockProps = {
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (validateContent as jest.Mock).mockReturnValue({ isValid: true, errors: {} });
  });

  it('renders content preview correctly', () => {
  });

  it('calls onPublish when publish button clicked', () => {
    (validateContent as jest.Mock).mockReturnValue({ isValid: true, errors: {} });
    render(<ContentStep5 {...mockProps} />);
    
    fireEvent.click(screen.getByText('Pubblica contenuto'));
    expect(mockProps.onPublish).toHaveBeenCalled();
  });

  it('shows validation errors before publishing', () => {
    (validateContent as jest.Mock).mockReturnValue({
      isValid: false,
      errors: { title: 'Title is required' }
    });
    
    render(<ContentStep5 {...mockProps} />);
    fireEvent.click(screen.getByText('Pubblica contenuto'));
    
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(mockProps.onPublish).not.toHaveBeenCalled();
  });
});