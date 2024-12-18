import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContentPreview } from '../ContentPreview';
import { useAuth } from '../../../auth/hooks/useAuth';

jest.mock('../../../auth/hooks/useAuth');

describe('ContentPreview', () => {
  const mockUser = {
    brandName: 'Test Company'
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('renders title and subtitle', () => {
    render(
      <ContentPreview 
        title="Test Title" 
        subtitle="Test Subtitle" 
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    render(
      <ContentPreview 
        title="Test Title"
        image="https://example.com/image.jpg"
      />
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Title');
  });

  it('renders placeholder when no image provided', () => {
    render(
      <ContentPreview 
        title="Test Title" 
        type="job"
      />
    );
    
    expect(screen.getByText('Anteprima offerta di lavoro')).toBeInTheDocument();
  });

  it('renders type-specific labels', () => {
    const { rerender } = render(
      <ContentPreview title="Test" type="job" />
    );
    expect(screen.getByText('Anteprima offerta di lavoro')).toBeInTheDocument();

    rerender(<ContentPreview title="Test" type="event" />);
    expect(screen.getByText('Anteprima evento')).toBeInTheDocument();

    rerender(<ContentPreview title="Test" type="promotion" />);
    expect(screen.getByText('Anteprima promozione')).toBeInTheDocument();
  });

  it('renders company name from user context', () => {
    render(<ContentPreview title="Test Title" />);
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });
});