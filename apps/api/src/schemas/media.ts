import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { media } from '@craftedtales/db';

/**
 * Media schemas for API validation
 */

// Base schemas from Drizzle
export const selectMediaSchema = createSelectSchema(media);
export const insertMediaSchema = createInsertSchema(media);

// Public media (excludes soft-delete fields)
export const mediaSchema = selectMediaSchema
  .omit({
    deleted: true,
    deletedAt: true,
  })
  .openapi('Media');

export type Media = z.infer<typeof mediaSchema>;

// Media upload response
export const mediaUploadResponseSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  filename: z.string(),
  size: z.number().int(),
  mimeType: z.string(),
}).openapi('MediaUploadResponse');

export type MediaUploadResponse = z.infer<typeof mediaUploadResponseSchema>;
