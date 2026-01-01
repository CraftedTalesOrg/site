import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { ListGameVersionsResponse } from '@craftedtales/api/schemas/game-versions';
import type { ErrorResponse } from '@craftedtales/api/schemas/shared/common';
import { apiFetch } from '../../utils/api';

/**
 * Fetch all game versions
 * Endpoint: GET /game-versions
 */
export function useGameVersions(): UseQueryResult<ListGameVersionsResponse, ErrorResponse> {
  return useQuery({
    queryKey: ['gameVersions'],
    queryFn: async () => apiFetch<ListGameVersionsResponse>('/game-versions'),
  });
}
