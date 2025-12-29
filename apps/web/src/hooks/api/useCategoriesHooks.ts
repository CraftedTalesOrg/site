import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { Category } from '@craftedtales/api/schemas/categories';
import type { ErrorResponse } from '@craftedtales/api/schemas/shared/common';
import { apiFetch } from '../../utils/api';

/**
 * Fetch all categories
 * Endpoint: GET /categories
 */
export function useCategories(): UseQueryResult<Category[], ErrorResponse> {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => apiFetch<Category[]>('/categories'),
  });
}
