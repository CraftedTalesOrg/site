import { useMutation, UseMutationResult } from '@tanstack/react-query';
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@craftedtales/api/schemas/auth';
import type { SuccessResponse, ErrorResponse } from '@craftedtales/api/schemas/shared/common';
import { apiFetch } from '../../utils/api';

/**
 * Register a new user
 * Endpoint: POST /auth/register
 */
export function useRegister(): UseMutationResult<AuthResponse, ErrorResponse, RegisterRequest> {
  return useMutation({
    mutationFn: async (data: RegisterRequest) =>
      apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  });
}

/**
 * Login user
 * Endpoint: POST /auth/login
 */
export function useLogin(): UseMutationResult<AuthResponse, ErrorResponse, LoginRequest> {
  return useMutation({
    mutationFn: async (data: LoginRequest) =>
      apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  });
}

/**
 * Request password reset
 * Endpoint: POST /auth/forgot-password
 */
export function useForgotPassword(): UseMutationResult<SuccessResponse, ErrorResponse, ForgotPasswordRequest> {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) =>
      apiFetch<SuccessResponse>('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  });
}

/**
 * Reset password with token
 * Endpoint: POST /auth/reset-password
 */
export function useResetPassword(): UseMutationResult<SuccessResponse, ErrorResponse, ResetPasswordRequest> {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) =>
      apiFetch<SuccessResponse>('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  });
}

/**
 * Verify email with token
 * Endpoint: POST /auth/verify-email
 */
export function useVerifyEmail(): UseMutationResult<SuccessResponse, ErrorResponse, VerifyEmailRequest> {
  return useMutation({
    mutationFn: async (data: VerifyEmailRequest) =>
      apiFetch<SuccessResponse>('/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
  });
}

/**
 * Resend email verification
 * Endpoint: POST /auth/resend-verification
 */
export function useResendVerification(): UseMutationResult<SuccessResponse, ErrorResponse, void> {
  return useMutation({
    mutationFn: async () =>
      apiFetch<SuccessResponse>('/auth/resend-verification', {
        method: 'POST',
      }),
  });
}
