import { where, orderBy, limit, QueryConstraint } from 'firebase/firestore';
import { ContentFilters, PaginationOptions } from './types';

const DEFAULT_PAGE_SIZE = 20;

export function buildContentQuery(
  userId: string,
  filters?: ContentFilters,
  pagination?: PaginationOptions
): QueryConstraint[] {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ];

  if (filters?.type) {
    constraints.push(where('type', '==', filters.type));
  }

  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }

  const pageSize = pagination?.limit || DEFAULT_PAGE_SIZE;
  if (pagination?.page && pagination.page > 1) {
    const offset = (pagination.page - 1) * pageSize;
    constraints.push(limit(offset + pageSize));
  } else {
    constraints.push(limit(pageSize));
  }

  return constraints;
}