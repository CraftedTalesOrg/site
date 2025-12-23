import { z } from '@hono/zod-openapi';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { mods, modVersions } from '@craftedtales/db';
import { privateUserSchema,
  publicUserSchema } from '../auth/auth.schemas';
import { categorySchema } from '../categories/categories.schemas';
import { mediaSchema } from '../_shared/media.schemas';
import { paginationQuerySchema } from '../_shared/common.schemas';

// ─────────────────────────────────────────────────────────────────────────────
// Base
// ─────────────────────────────────────────────────────────────────────────────

export const selectModSchema = createSelectSchema(mods);
export const insertModSchema = createInsertSchema(mods);
export const selectModVersionSchema = createSelectSchema(modVersions);
export const insertModVersionSchema = createInsertSchema(modVersions);

/**
 * Public mod version
 */
export const publicModVersionSchema = selectModVersionSchema
  .omit({
    enabled: true,
    deleted: true,
    // Use publishedAt for display
    createdAt: true,
    deletedAt: true,
  })
  .openapi('PublicModVersion');

export type PublicModVersion = z.infer<typeof publicModVersionSchema>;

/**
 * Private mod version
 */
export const privateModVersionSchema = selectModVersionSchema
  .omit({
    enabled: true,
    deleted: true,
    deletedAt: true,
  })
  .openapi('PrivateModVersion');

export type PrivateModVersion = z.infer<typeof privateModVersionSchema>;

/**
 * Public mod
 */
export const publicModSchema = selectModSchema
  .omit({
    enabled: true,
    deleted: true,
    deletedAt: true,
    approved: true,
    visibility: true,
    iconId: true,
    ownerId: true,
  })
  .extend({
    owner: publicUserSchema,
    icon: mediaSchema.nullable(),
    categories: z.array(categorySchema),
    versions: z.array(publicModVersionSchema),
  })
  .openapi('PublicMod');

export type PublicMod = z.infer<typeof publicModSchema>;

/**
 * Private mod
 */
export const privateModSchema = selectModSchema
  .omit({
    enabled: true,
    deleted: true,
    deletedAt: true,
    iconId: true,
    ownerId: true,
  })
  .extend({
    owner: privateUserSchema,
    icon: mediaSchema.nullable(),
    categories: z.array(categorySchema),
    versions: z.array(privateModVersionSchema),
  })
  .openapi('PrivateMod');

export type PrivateMod = z.infer<typeof privateModSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create mod request
 */
export const createModRequestSchema = insertModSchema
  .pick({
    name: true,
    slug: true,
    visibility: true,
    summary: true,
  })
  .openapi('CreateModRequest');

export type CreateModRequest = z.infer<typeof createModRequestSchema>;

/**
 * Update mod request
 */
export const updateModRequestSchema = insertModSchema
  .omit({
    id: true,
    ownerId: true,
    downloads: true,
    likes: true,
    approved: true,
    enabled: true,
    deleted: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    categoryIds: z.array(categorySchema).min(1).max(5).optional(),
  })
  .partial()
  .openapi('UpdateModRequest');

export type UpdateModRequest = z.infer<typeof updateModRequestSchema>;

/**
 * Create mod version request
 * Note: modId is from path param, url and size are from upload handler
 * TODO CHECK FURTHER
 */
export const createModVersionRequestSchema = insertModVersionSchema
  .pick({
    name: true,
    gameVersions: true,
    channel: true,
    changelog: true,
    publishedAt: true,
  })
  .openapi('CreateModVersionRequest');

export type CreateModVersionRequest = z.infer<
  typeof createModVersionRequestSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List mods query
 */
export const listModsQuerySchema = z
  .object({
    categoryIds: z.array(categorySchema).optional(),
    gameVersions: z.array(z.string().max(50)).optional(),
    search: z.string().max(255).optional(),
    sortBy: z
      .enum(['downloads', 'likes', 'createdAt', 'updatedAt'])
      .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .merge(paginationQuerySchema)
  .openapi('ListModsQuery');

export type ListModsQuery = z.infer<typeof listModsQuerySchema>;

/**
 * Review mods query
 */
export const reviewModsQuerySchema = z
  .object({
    approved: z.enum(['true', 'false', 'all']).default('false'),
  })
  .merge(paginationQuerySchema)
  .openapi('ReviewModsQuery');

export type ReviewModsQuery = z.infer<typeof reviewModsQuerySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Responses
// ─────────────────────────────────────────────────────────────────────────────

export const likeToggleResponseSchema = z
  .object({
    liked: z.boolean(),
    likes: z.number().int(),
  })
  .openapi('LikeToggleResponse');

export type LikeToggleResponse = z.infer<typeof likeToggleResponseSchema>;
