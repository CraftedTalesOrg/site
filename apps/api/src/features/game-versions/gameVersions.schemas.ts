import { z } from '@hono/zod-openapi';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { gameVersions } from '@craftedtales/db';

// ─────────────────────────────────────────────────────────────────────────────
// Base
// ─────────────────────────────────────────────────────────────────────────────

export const selectGameVersionSchema = createSelectSchema(gameVersions);
export const insertGameVersionSchema = createInsertSchema(gameVersions);

/**
 * Game Version
 */
export const gameVersionSchema = selectGameVersionSchema.openapi('GameVersion');

export type GameVersion = z.infer<typeof gameVersionSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create game version request
 */
export const createGameVersionRequestSchema = insertGameVersionSchema
  .openapi('CreateGameVersionRequest');

export type CreateGameVersionRequest = z.infer<typeof createGameVersionRequestSchema>;

/**
 * Update game version request
 */
export const updateGameVersionRequestSchema = insertGameVersionSchema
  .partial()
  .openapi('UpdateGameVersionRequest');

export type UpdateGameVersionRequest = z.infer<typeof updateGameVersionRequestSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Responses
// ─────────────────────────────────────────────────────────────────────────────

export const listGameVersionsResponseSchema = z
  .object({
    data: z.array(gameVersionSchema),
  })
  .openapi('ListGameVersionsResponse');

export type ListGameVersionsResponse = z.infer<typeof listGameVersionsResponseSchema>;
