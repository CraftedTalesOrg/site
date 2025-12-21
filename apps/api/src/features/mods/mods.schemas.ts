import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { mods, modVersions } from '@craftedtales/db';
import { userSummarySchema } from '../auth/auth.schemas';
import { categorySchema as publicCategorySchema } from '../categories/categories.schemas';
import { publicMediaSchema } from '../_shared/media.schemas';

/**
 * Mod schemas for API validation
 *
 * Schema hierarchy:
 * - selectModSchema: Base Drizzle schema (all DB fields)
 * - publicModSchema: Public API response (excludes deleted/deletedAt, includes relations)
 * - privateModSchema: Private/owner API response (same as public, all fields visible to owner)
 */

// ============================================================================
// Base Drizzle Schemas
// ============================================================================

export const selectModSchema = createSelectSchema(mods);
export const insertModSchema = createInsertSchema(mods);
export const selectModVersionSchema = createSelectSchema(modVersions);

// ============================================================================
// Public Mod Version Schema
// ============================================================================

export const publicModVersionSchema = selectModVersionSchema
  .omit({
    deleted: true,
    deletedAt: true,
  })
  .openapi('PublicModVersion');

export type PublicModVersion = z.infer<typeof publicModVersionSchema>;

// ============================================================================
// Public Mod Schema
// ============================================================================

/**
 * Public mod schema - for use in list and detail views
 * Excludes: deleted, deletedAt
 * Includes: owner, icon, categories, versions (all relations)
 */
export const publicModSchema = selectModSchema
  .omit({
    deleted: true,
    deletedAt: true,
  })
  .extend({
    owner: userSummarySchema,
    icon: publicMediaSchema.nullable(),
    categories: z.array(publicCategorySchema),
    versions: z.array(publicModVersionSchema),
  })
  .openapi('PublicMod');

export type PublicMod = z.infer<typeof publicModSchema>;

/**
 * Private mod schema - for use when the authenticated user is the owner
 * Same as publicModSchema (all fields are visible to owner)
 */
export const privateModSchema = publicModSchema.openapi('PrivateMod');

export type PrivateMod = z.infer<typeof privateModSchema>;

// ============================================================================
// Request Schemas
// ============================================================================

export const createModRequestSchema = insertModSchema
  .omit({
    id: true,
    ownerId: true,
    iconId: true,
    downloads: true,
    likes: true,
    approved: true,
    deleted: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    categoryIds: z.array(z.string().uuid()).min(1).max(5),
  })
  .openapi('CreateModRequest');

export type CreateModRequest = z.infer<typeof createModRequestSchema>;

export const updateModRequestSchema = insertModSchema
  .omit({
    id: true,
    ownerId: true,
    iconId: true,
    downloads: true,
    likes: true,
    approved: true,
    deleted: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    categoryIds: z.array(z.string().uuid()).min(1).max(5).optional(),
  })
  .partial()
  .openapi('UpdateModRequest');

export type UpdateModRequest = z.infer<typeof updateModRequestSchema>;

export const modFiltersSchema = z
  .object({
    categoryId: z.string().uuid().optional(),
    ownerId: z.string().uuid().optional(),
    search: z.string().max(255).optional(),
    sortBy: z
      .enum(['downloads', 'likes', 'createdAt', 'updatedAt'])
      .default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .openapi('ModFilters');

export type ModFilters = z.infer<typeof modFiltersSchema>;
