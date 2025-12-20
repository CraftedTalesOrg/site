import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { mods } from './mods';
import { state, timestamps } from './column.helpers';

export const modVersions = sqliteTable('mod_versions', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  modId: text().notNull().references(() => mods.id, { onDelete: 'cascade' }),

  // Version info
  name: text({ length: 100 }).notNull(), // Semver: 1.2.0, 2.0.0-beta.1
  gameVersions: text({ mode: 'json' }).$type<string[]>().notNull().default([]),
  channel: text({ enum: ['release', 'beta', 'alpha'] }).notNull().default('release'),

  // File info
  url: text().notNull(),
  size: integer().notNull(), // Bytes

  // Metadata
  changelog: text().notNull().default(''),
  downloads: integer().notNull().default(0),

  ...state,
  ...timestamps,
  publishedAt: integer({ mode: 'timestamp' }),
});
