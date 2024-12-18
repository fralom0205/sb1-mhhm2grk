import { buildContentQuery } from '../../content/queries';
import { where, orderBy, limit } from 'firebase/firestore';
import { ContentFilters, PaginationOptions } from '../../content/types';

jest.mock('firebase/firestore', () => ({
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn()
}));

describe('Content Queries', () => {
  const mockUserId = 'test-user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    (where as jest.Mock).mockImplementation((...args) => ({ where: args }));
    (orderBy as jest.Mock).mockImplementation((...args) => ({ orderBy: args }));
    (limit as jest.Mock).mockImplementation((value) => ({ limit: value }));
  });

  it('should build basic query with required constraints', () => {
    const constraints = buildContentQuery(mockUserId);

    expect(where).toHaveBeenCalledWith('userId', '==', mockUserId);
    expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(limit).toHaveBeenCalledWith(20); // Default page size
    expect(constraints).toHaveLength(3);
  });

  it('should add type filter when specified', () => {
    const filters: ContentFilters = { type: 'promotion' };
    const constraints = buildContentQuery(mockUserId, filters);

    expect(where).toHaveBeenCalledWith('type', '==', 'promotion');
    expect(constraints).toHaveLength(4);
  });

  it('should add status filter when specified', () => {
    const filters: ContentFilters = { status: 'published' };
    const constraints = buildContentQuery(mockUserId, filters);

    expect(where).toHaveBeenCalledWith('status', '==', 'published');
    expect(constraints).toHaveLength(4);
  });

  it('should handle pagination options', () => {
    const pagination: PaginationOptions = {
      page: 2,
      limit: 10
    };
    const constraints = buildContentQuery(mockUserId, undefined, pagination);

    expect(limit).toHaveBeenCalledWith(20); // 10 items * 2 pages
    expect(constraints).toHaveLength(3);
  });

  it('should combine all filters and pagination', () => {
    const filters: ContentFilters = {
      type: 'promotion',
      status: 'published'
    };
    const pagination: PaginationOptions = {
      page: 2,
      limit: 10
    };
    const constraints = buildContentQuery(mockUserId, filters, pagination);

    expect(where).toHaveBeenCalledWith('userId', '==', mockUserId);
    expect(where).toHaveBeenCalledWith('type', '==', 'promotion');
    expect(where).toHaveBeenCalledWith('status', '==', 'published');
    expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(limit).toHaveBeenCalledWith(20);
    expect(constraints).toHaveLength(5);
  });

  it('should handle date range filters', () => {
    const filters: ContentFilters = {
      dateRange: {
        start: '2024-01-01',
        end: '2024-12-31'
      }
    };
    const constraints = buildContentQuery(mockUserId, filters);

    expect(where).toHaveBeenCalledWith('createdAt', '>=', '2024-01-01');
    expect(where).toHaveBeenCalledWith('createdAt', '<=', '2024-12-31');
    expect(constraints).toHaveLength(5);
  });

  it('should handle invalid pagination values', () => {
    const pagination: PaginationOptions = {
      page: -1,
      limit: 0
    };
    const constraints = buildContentQuery(mockUserId, undefined, pagination);

    expect(limit).toHaveBeenCalledWith(20); // Should use default values
    expect(constraints).toHaveLength(3);
  });
});