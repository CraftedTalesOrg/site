import { z } from '@hono/zod-openapi';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { users } from '@craftedtales/db';
import { mediaSchema } from '../_shared/media.schemas';

// ─────────────────────────────────────────────────────────────────────────────
// Base
// ─────────────────────────────────────────────────────────────────────────────

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

/**
 * Public user
 */
export const publicUserSchema = selectUserSchema
  .omit({
    password: true,
    email: true,
    emailVerified: true,
    twoFactorEnabled: true,
    twoFactorSecret: true,
    enabled: true,
    deleted: true,
    updatedAt: true,
    deletedAt: true,
    avatarId: true,
    roles: true,
  })
  .extend({
    avatar: mediaSchema.nullable(),
  })
  .openapi('PublicUser');

export type PublicUser = z.infer<typeof publicUserSchema>;

/**
 * Private user
 */
export const privateUserSchema = selectUserSchema
  .omit({
    password: true,
    emailVerified: true,
    twoFactorSecret: true,
    enabled: true,
    deleted: true,
    deletedAt: true,
    avatarId: true,
  })
  .extend({
    avatar: mediaSchema.nullable(),
  })
  .openapi('PrivateUser');

export type PrivateUser = z.infer<typeof privateUserSchema>;

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

/**
 * Update profile request
 */
export const updateProfileRequestSchema = insertUserSchema
  .omit({
    id: true,
    password: true,
    emailVerified: true,
    twoFactorSecret: true,
    enabled: true,
    deleted: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    roles: true,
  })
  .partial()
  .openapi('UpdateProfileRequest');

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Responses
// ─────────────────────────────────────────────────────────────────────────────

export const authResponseSchema = z
  .object({
    user: privateUserSchema,
    sessionId: z.string(),
  })
  .openapi('AuthResponse');

export type AuthResponse = z.infer<typeof authResponseSchema>;
