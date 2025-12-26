import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { categories } from './categories';
import { users } from './users';
import { state, timestamps } from './column.helpers';
import { media } from './media';

export const mods = sqliteTable('mods', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text({ length: 255 }).notNull().unique(),

  // Core fields
  name: text({ length: 255 }).notNull(),
  iconId: text().references(() => media.id),
  summary: text().notNull(),
  description: text().notNull().default(''),

  // Status & visibility
  status: text({ enum: ['draft', 'published'] }).notNull().default('draft'),
  visibility: text({ enum: ['public', 'unlisted', 'private'] }).notNull().default('public'),
  approved: integer({ mode: 'boolean' }).notNull().default(false),

  // License
  license: text({ length: 100 }),
  licenseUrl: text(),

  // External links
  issueTrackerUrl: text(),
  sourceCodeUrl: text(),
  wikiUrl: text(),
  discordInviteUrl: text(),
  donationUrls: text({ mode: 'json' }).$type<string[]>(),

  // Metadata
  downloads: integer().notNull().default(0),
  likes: integer().notNull().default(0),

  // Relationships
  ownerId: text().notNull().references(() => users.id, { onDelete: 'cascade' }),

  ...state,
  ...timestamps,
});

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

export const modCategories = sqliteTable('mod_categories',
  {
    modId: text().notNull().references(() => mods.id, { onDelete: 'cascade' }),
    categoryId: text().notNull().references(() => categories.id, { onDelete: 'cascade' }),
  },
  t => [primaryKey({ columns: [t.modId, t.categoryId] })],
);

export const modLikes = sqliteTable('mod_likes',
  {
    modId: text().notNull().references(() => mods.id, { onDelete: 'cascade' }),
    userId: text().references(() => users.id, { onDelete: 'set null' }),
  },
  t => [primaryKey({ columns: [t.modId, t.userId] })],
);
