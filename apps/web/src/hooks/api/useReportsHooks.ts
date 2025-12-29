import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type {
  Report,
  CreateReportRequest,
  ResolveReportRequest,
  ReviewReportsQuery,
} from '@craftedtales/api/schemas/reports';
import type { PaginatedResponse, SuccessResponse, ErrorResponse } from '@craftedtales/api/schemas/shared/common';
import { apiFetch, buildQueryUrl } from '../../utils/api';

/**
 * Fetch reports (admin/moderator only)
 * Endpoint: GET /reports
 */
export function useReports(params: Partial<ReviewReportsQuery> = {}): UseQueryResult<PaginatedResponse<Report>, ErrorResponse> {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: async () => {
      const endpoint = buildQueryUrl('/reports', params);

      return apiFetch<PaginatedResponse<Report>>(endpoint);
    },
  });
}

/**
 * Create a report
 * Endpoint: POST /reports
 */
export function useCreateReport(): UseMutationResult<SuccessResponse, ErrorResponse, CreateReportRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReportRequest) =>
      apiFetch<SuccessResponse>('/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Invalidate reports list
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

/**
 * Resolve a report (admin/moderator only)
 * Endpoint: POST /reports/{id}/resolve
 */
export function useResolveReport(id: string): UseMutationResult<SuccessResponse, ErrorResponse, ResolveReportRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResolveReportRequest) =>
      apiFetch<SuccessResponse>(`/reports/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Invalidate reports list
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
