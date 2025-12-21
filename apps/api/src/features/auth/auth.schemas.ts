import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { users } from '@craftedtales/db';

/**
 * User and Auth schemas for API validation
 *
 * Schema hierarchy:
 * - selectUserSchema: Base Drizzle schema (all DB fields)
 * - publicUserSchema: Public profiles - excludes sensitive fields
 * - privateUserSchema: Private/owner's profile - includes email/emailVerified
 * - userSummarySchema: Minimal nested info (e.g., in mod.owner)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Base User Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

/**
 * Public user schema - for public profiles
 * Excludes: password, email, emailVerified, twoFactorSecret, deleted
 */
export const publicUserSchema = selectUserSchema
  .omit({
    password: true,
    email: true,
    emailVerified: true,
    twoFactorSecret: true,
    deleted: true,
  })
  .extend({
    avatar: z.any().nullable().optional(),
  })
  .openapi('PublicUser');

export type PublicUser = z.infer<typeof publicUserSchema>;

/**
 * Private user schema - for authenticated user's own profile
 * Extends public schema with email/emailVerified/twoFactorEnabled
 */
export const privateUserSchema = selectUserSchema
  .omit({
    password: true,
    emailVerified: true,
    twoFactorSecret: true,
    deleted: true,
  })
  .extend({
    avatar: z.any().nullable().optional(),
  })
  .openapi('PrivateUser');

export type PrivateUser = z.infer<typeof privateUserSchema>;

/**
 * User summary schema - minimal user info for nested relations (e.g., mod.owner)
 * Omits: avatar, timestamps, enabled
 */
export const userSummarySchema = z
  .object({
    id: z.string().uuid(),
    username: z.string(),
    bio: z.string().nullable(),
    avatarId: z.string().uuid().nullable(),
    roles: z.array(z.string()),
  })
  .openapi('UserSummary');

export type UserSummary = z.infer<typeof userSummarySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Request/Response Schemas
// ─────────────────────────────────────────────────────────────────────────────

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

export const loginRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .openapi('LoginRequest');

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const authResponseSchema = z
  .object({
    user: privateUserSchema,
    sessionId: z.string(),
  })
  .openapi('AuthResponse');

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const verifyEmailRequestSchema = z
  .object({
    token: z.string(),
  })
  .openapi('VerifyEmailRequest');

export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;

export const forgotPasswordRequestSchema = z
  .object({
    email: z.string().email(),
  })
  .openapi('ForgotPasswordRequest');

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

export const resetPasswordRequestSchema = z
  .object({
    token: z.string(),
    newPassword: z.string().min(8).max(128),
  })
  .openapi('ResetPasswordRequest');

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// User Profile Schemas
// ─────────────────────────────────────────────────────────────────────────────

// TODO UPDATE REST OF FIELDS (AVATAR, USERNAME ETC)
export const updateProfileRequestSchema = z
  .object({
    bio: z.string().max(500).optional(),
  })
  .openapi('UpdateProfileRequest');

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
