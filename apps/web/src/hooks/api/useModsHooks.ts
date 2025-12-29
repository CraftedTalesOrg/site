import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type {
  PublicMod,
  PrivateMod,
  PublicModVersion,
  ListModsQuery,
  CreateModRequest,
  UpdateModRequest,
} from '@craftedtales/api/schemas/mods';
import type { PaginatedResponse, PaginationQuery, SuccessResponse, ErrorResponse } from '@craftedtales/api/schemas/shared/common';
import { apiFetch, buildQueryUrl } from '../../utils/api';

/**
 * Fetch paginated mods list with filters
 * Endpoint: GET /mods
 */
export function useMods(params: Partial<ListModsQuery> = {}): UseQueryResult<PaginatedResponse<PublicMod>, ErrorResponse> {
  return useQuery({
    queryKey: ['mods', params],
    queryFn: async () => {
      const endpoint = buildQueryUrl('/mods', params);

      return apiFetch<PaginatedResponse<PublicMod>>(endpoint);
    },
  });
}

/**
 * Fetch single mod by slug
 * Endpoint: GET /mods/{slug}
 */
export function useMod(slug: string): UseQueryResult<PublicMod, ErrorResponse> {
  return useQuery({
    queryKey: ['mod', slug],
    queryFn: async () => apiFetch<PublicMod>(`/mods/${slug}`),
    enabled: !!slug,
  });
}

/**
 * Fetch versions for a mod
 * Endpoint: GET /mods/{slug}/versions
 */
export function useModVersions(
  slug: string,
  params: Partial<PaginationQuery> = {},
): UseQueryResult<PaginatedResponse<PublicModVersion>, ErrorResponse> {
  return useQuery({
    queryKey: ['mod-versions', slug, params],
    queryFn: async () => {
      const endpoint = buildQueryUrl(`/mods/${slug}/versions`, params);

      return apiFetch<PaginatedResponse<PublicModVersion>>(endpoint);
    },
    enabled: !!slug,
  });
}

/**
 * Create a new mod
 * Endpoint: POST /mods
 */
export function useCreateMod(): UseMutationResult<PrivateMod, ErrorResponse, CreateModRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateModRequest) =>
      apiFetch<PrivateMod>('/mods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Invalidate mods list to refetch
      queryClient.invalidateQueries({ queryKey: ['mods'] });
    },
  });
}

/**
 * Update a mod
 * Endpoint: PATCH /mods/{id}
 */
export function useUpdateMod(id: string): UseMutationResult<PrivateMod, ErrorResponse, UpdateModRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateModRequest) =>
      apiFetch<PrivateMod>(`/mods/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedMod) => {
      // Invalidate mods list and specific mod queries
      queryClient.invalidateQueries({ queryKey: ['mods'] });
      queryClient.invalidateQueries({ queryKey: ['mod', updatedMod.slug] });
    },
  });
}

/**
 * Delete a mod
 * Endpoint: DELETE /mods/{id}
 */
export function useDeleteMod(id: string): UseMutationResult<SuccessResponse, ErrorResponse, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      apiFetch<SuccessResponse>(`/mods/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      // Invalidate mods list
      queryClient.invalidateQueries({ queryKey: ['mods'] });
    },
  });
}

/**
 * Toggle like on a mod
 * Endpoint: POST /mods/{slug}/like
 */
export function useLikeMod(slug: string): UseMutationResult<SuccessResponse, ErrorResponse, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      apiFetch<SuccessResponse>(`/mods/${slug}/like`, {
        method: 'POST',
      }),
    onSuccess: () => {
      // Invalidate specific mod to refetch updated like count
      queryClient.invalidateQueries({ queryKey: ['mod', slug] });
      // Also invalidate mods list as it displays like counts
      queryClient.invalidateQueries({ queryKey: ['mods'] });
    },
  });
}
