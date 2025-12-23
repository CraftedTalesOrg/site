import { z } from '@hono/zod-openapi';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { media } from '@craftedtales/db';

// ─────────────────────────────────────────────────────────────────────────────
// Base
// ─────────────────────────────────────────────────────────────────────────────

export const selectMediaSchema = createSelectSchema(media);
export const insertMediaSchema = createInsertSchema(media);

/**
 * Media schema
 */
export const mediaSchema = selectMediaSchema
  .omit({
    enabled: true,
    deleted: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .openapi('Media');

export type Media = z.infer<typeof mediaSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create media request
 */
export const createMediaRequestSchema = insertMediaSchema
  .omit({
    id: true,
    enabled: true,
    deleted: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .openapi('CreateMediaRequest');

export type CreateMediaRequest = z.infer<typeof createMediaRequestSchema>;
