import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type {
  PublicUser,
  PrivateUser,
  UpdateProfileRequest,
} from '@craftedtales/api/schemas/users';
import type { PublicMod } from '@craftedtales/api/schemas/mods';
import type { PaginatedResponse, PaginationQuery, SuccessResponse, ErrorResponse } from '@craftedtales/api/schemas/shared/common';
import { apiFetch, buildQueryUrl } from '../../utils/api';

/**
 * Fetch current authenticated user
 * Endpoint: GET /users/me
 */
export function useMe(): UseQueryResult<PrivateUser, ErrorResponse> {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: async () => apiFetch<PrivateUser>('/users/me'),
  });
}

/**
 * Update current user profile
 * Endpoint: PATCH /users/me
 */
export function useUpdateMe(): UseMutationResult<PrivateUser, ErrorResponse, UpdateProfileRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) =>
      apiFetch<PrivateUser>('/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Invalidate current user query
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}

/**
 * Fetch user by username
 * Endpoint: GET /users/{username}
 */
export function useUser(username: string): UseQueryResult<PublicUser, ErrorResponse> {
  return useQuery({
    queryKey: ['users', username],
    queryFn: async () => apiFetch<PublicUser>(`/users/${username}`),
    enabled: !!username,
  });
}

/**
 * Fetch mods by username
 * Endpoint: GET /users/{username}/mods
 */
export function useUserMods(
  username: string,
  params: Partial<PaginationQuery> = {},
): UseQueryResult<PaginatedResponse<PublicMod>, ErrorResponse> {
  return useQuery({
    queryKey: ['users', username, 'mods', params],
    queryFn: async () => {
      const endpoint = buildQueryUrl(`/users/${username}/mods`, params);

      return apiFetch<PaginatedResponse<PublicMod>>(endpoint);
    },
    enabled: !!username,
  });
}

/**
 * Perform admin action on user (suspend/unsuspend)
 * Endpoint: POST /users/{id}/{action}
 */
export function useUserAction(
  id: string,
  action: 'suspend' | 'unsuspend',
): UseMutationResult<SuccessResponse, ErrorResponse, { reason?: string }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { reason?: string }) =>
      apiFetch<SuccessResponse>(`/users/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
