import { z } from '@hono/zod-openapi';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { users } from '@craftedtales/db';
import { mediaSchema } from '../_shared/media.schemas';

// ─────────────────────────────────────────────────────────────────────────────
// Base
// ─────────────────────────────────────────────────────────────────────────────

export const selectUserSchema = createSelectSchema(users, {
  // cannot infer roles because it is saved as json so we define it manually
  roles: z.array(z.string()).default([]),
});
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
    accessToken: z.string(),
  })
  .openapi('AuthResponse');

export type AuthResponse = z.infer<typeof authResponseSchema>;
