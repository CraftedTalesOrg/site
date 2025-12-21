import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { categories } from '@craftedtales/db';

/**
 * Category schemas for API validation
 *
 * Schema hierarchy:
 * - selectCategorySchema: Base Drizzle schema (all DB fields)
 * - publicCategorySchema: Public API response (no exclusions, categories have no sensitive fields)
 * - ownerCategorySchema: Not needed (categories are managed by admins only)
 */

// Base schemas from Drizzle
export const selectCategorySchema = createSelectSchema(categories);
export const insertCategorySchema = createInsertSchema(categories);

/**
 * Public category schema - for use in mod.categories array
 * No exclusions (categories have no sensitive or soft-delete fields)
 */
export const publicCategorySchema = selectCategorySchema.openapi('PublicCategory');

export type PublicCategory = z.infer<typeof publicCategorySchema>;

// Create category request (admin only)
export const createCategoryRequestSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
}).openapi('CreateCategoryRequest');

export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>;

// Update category request (admin only)
export const updateCategoryRequestSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(500).optional(),
}).openapi('UpdateCategoryRequest');

export type UpdateCategoryRequest = z.infer<typeof updateCategoryRequestSchema>;
