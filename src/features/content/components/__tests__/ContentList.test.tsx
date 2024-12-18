import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContentList } from '../ContentList';
import { Content } from '../../../../types/content';

describe('ContentList', () => {
  const mockItems: Content[] = [
    {
      id: '1',
      title: 'Test Content',
      type: 'promotion',
      description: 'Test Description',
      status: 'published',
      createdAt: '2024-01-01',
      views: 100,
      engagement: 75
    }
  ];

  const mockOnItemClick = jest.fn();
  const mockOnPublish = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no items', () => {
    render(<ContentList items={[]} onItemClick={mockOnItemClick} />);
    
    expect(screen.getByText('Nessun contenuto')).toBeInTheDocument();
    expect(screen.getByText('Inizia creando il tuo primo contenuto')).toBeInTheDocument();
  });

  it('renders content items correctly', () => {
    render(<ContentList items={mockItems} onItemClick={mockOnItemClick} />);
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('100 visualizzazioni')).toBeInTheDocument();
    expect(screen.getByText('75% engagement')).toBeInTheDocument();
  });

  it('handles item click', () => {
    render(<ContentList items={mockItems} onItemClick={mockOnItemClick} />);
    
    fireEvent.click(screen.getByText('Test Content'));
    expect(mockOnItemClick).toHaveBeenCalledWith('1');
  });

  it('shows publish button for draft items', () => {
    const draftItem = {
      ...mockItems[0],
      status: 'draft'
    };

    render(
      <ContentList 
        items={[draftItem]} 
        onItemClick={mockOnItemClick}
        onPublish={mockOnPublish}
      />
    );
    
    const publishButton = screen.getByText('Pubblica');
    expect(publishButton).toBeInTheDocument();
    
    fireEvent.click(publishButton);
    expect(mockOnPublish).toHaveBeenCalledWith('1');
  });

  it('displays correct status badge', () => {
    const items = [
      { ...mockItems[0], status: 'published' },
      { ...mockItems[0], id: '2', status: 'draft' },
      { ...mockItems[0], id: '3', status: 'archived' }
    ];

    render(<ContentList items={items} onItemClick={mockOnItemClick} />);
    
    expect(screen.getByText('Pubblicato')).toBeInTheDocument();
    expect(screen.getByText('Bozza')).toBeInTheDocument();
    expect(screen.getByText('Archiviato')).toBeInTheDocument();
  });
});