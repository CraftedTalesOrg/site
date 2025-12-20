import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { users } from '@craftedtales/db';

/**
 * User schemas for API validation
 */

// Base schemas from Drizzle
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

// Public user profile (excludes sensitive fields)
export const publicUserSchema = selectUserSchema
  .omit({
    password: true,
    emailVerified: true,
    twoFactorEnabled: true,
    twoFactorSecret: true,
    deleted: true,
    deletedAt: true,
  })
  .openapi('PublicUser');

export type PublicUser = z.infer<typeof publicUserSchema>;

// Minimal user info (for nested responses)
export const userSummarySchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  bio: z.string().nullable(),
  avatarId: z.string().nullable(),
  roles: z.array(z.string()),
}).openapi('UserSummary');

export type UserSummary = z.infer<typeof userSummarySchema>;

// Registration request
export const registerRequestSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  bio: z.string().max(500).optional(),
}).openapi('RegisterRequest');

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

// Login request
export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
}).openapi('LoginRequest');

export type LoginRequest = z.infer<typeof loginRequestSchema>;

// Update profile request
export const updateUserRequestSchema = z.object({
  bio: z.string().max(500).optional(),
}).openapi('UpdateUserRequest');

export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;

// Email verification request
export const verifyEmailRequestSchema = z.object({
  token: z.string().min(1),
}).openapi('VerifyEmailRequest');

export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;

// Password reset request
export const forgotPasswordRequestSchema = z.object({
  email: z.string().email(),
}).openapi('ForgotPasswordRequest');

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

// Password reset confirmation
export const resetPasswordRequestSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(128),
}).openapi('ResetPasswordRequest');

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

// Auth response with user and session
export const authResponseSchema = z.object({
  user: publicUserSchema,
  sessionId: z.string(),
}).openapi('AuthResponse');

export type AuthResponse = z.infer<typeof authResponseSchema>;
