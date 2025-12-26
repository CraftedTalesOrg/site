import { z } from '@hono/zod-openapi';
import { privateUserSchema } from '../users/users.schemas';

// ─────────────────────────────────────────────────────────────────────────────
// Requests
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Register request
 */
export const registerRequestSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[a-zA-Z0-9_-]+$/),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  })
  .openapi('RegisterRequest');

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

/**
 * Login request
 */
export const loginRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .openapi('LoginRequest');

export type LoginRequest = z.infer<typeof loginRequestSchema>;

/**
 * Verify email request
 */
export const verifyEmailRequestSchema = z
  .object({
    token: z.string(),
  })
  .openapi('VerifyEmailRequest');

export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;

/**
 * Forgot password request
 */
export const forgotPasswordRequestSchema = z
  .object({
    email: z.string().email(),
  })
  .openapi('ForgotPasswordRequest');

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

/**
 * Reset password request
 */
export const resetPasswordRequestSchema = z
  .object({
    token: z.string(),
    newPassword: z.string().min(8).max(128),
  })
  .openapi('ResetPasswordRequest');

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Responses
// ─────────────────────────────────────────────────────────────────────────────

export const authResponseSchema = z
  .object({
    user: privateUserSchema,
    accessToken: z.string(),
  })
  .openapi('AuthResponse');

export type AuthResponse = z.infer<typeof authResponseSchema>;
