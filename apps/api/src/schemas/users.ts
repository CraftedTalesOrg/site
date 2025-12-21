import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { users } from '@craftedtales/db';
import { publicMediaSchema } from './media';

/**
 * User schemas for API validation
 *
 * Schema hierarchy:
 * - selectUserSchema: Base Drizzle schema (all DB fields)
 * - publicUserSchema: Public profile (excludes password, 2FA, deleted, includes avatar relation)
 * - ownerUserSchema: Owner profile (extends public, includes email, emailVerified for account settings)
 * - userSummarySchema: Minimal info for nested responses (derived from publicUserSchema)
 */

// Base schemas from Drizzle
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

/**
 * Public user schema - for viewing other users' profiles
 * Excludes: password, emailVerified, twoFactorEnabled, twoFactorSecret, email, deleted, deletedAt
 * Includes: avatar relation
 */
export const publicUserSchema = selectUserSchema
  .omit({
    password: true,
    email: true,
    emailVerified: true,
    twoFactorEnabled: true,
    twoFactorSecret: true,
    deleted: true,
    deletedAt: true,
  })
  .extend({
    avatar: publicMediaSchema.nullable(),
  })
  .openapi('PublicUser');

export type PublicUser = z.infer<typeof publicUserSchema>;

/**
 * Owner user schema - for viewing own profile
 * Extends publicUserSchema and includes email, emailVerified for account settings
 */
export const ownerUserSchema = publicUserSchema
  .extend({
    email: z.string().email(),
    emailVerified: z.boolean(),
    twoFactorEnabled: z.boolean(),
  })
  .openapi('OwnerUser');

export type OwnerUser = z.infer<typeof ownerUserSchema>;

/**
 * Minimal user info for nested responses (e.g., mod.owner)
 * Derived from publicUserSchema using .omit()
 */
export const userSummarySchema = publicUserSchema
  .omit({
    avatar: true,
    createdAt: true,
    updatedAt: true,
    enabled: true,
  })
  .openapi('UserSummary');

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
  user: ownerUserSchema,
  sessionId: z.string(),
}).openapi('AuthResponse');

export type AuthResponse = z.infer<typeof authResponseSchema>;
