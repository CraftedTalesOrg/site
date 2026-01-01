import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { categories } from './categories';
import { gameVersions } from './gameVersions';
import { users } from './users';
import { state, timestamps } from './column.helpers';
import { media } from './media';

export const mods = sqliteTable('mods', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text({ length: 255 }).notNull().unique(),

  // Core fields
  name: text({ length: 255 }).notNull(),
  iconId: text('icon_id').references(() => media.id),
  summary: text().notNull(),
  description: text().notNull().default(''),

  // Status & visibility
  status: text({ enum: ['draft', 'published'] }).notNull().default('draft'),
  visibility: text({ enum: ['public', 'unlisted', 'private'] }).notNull().default('public'),
  approved: integer({ mode: 'boolean' }).notNull().default(false),

  // License
  license: text({ length: 100 }),
  licenseUrl: text('license_url'),

  // External links
  issueTrackerUrl: text('issue_tracker_url'),
  sourceCodeUrl: text('source_code_url'),
  wikiUrl: text('wiki_url'),
  discordInviteUrl: text('discord_invite_url'),
  donationUrls: text('donation_urls', { mode: 'json' }).$type<string[]>(),

  // Metadata
  downloads: integer().notNull().default(0),
  likes: integer().notNull().default(0),

  // Relationships
  ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  ...state,
  ...timestamps,
});

export const modVersions = sqliteTable('mod_versions', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  modId: text('mod_id').notNull().references(() => mods.id, { onDelete: 'cascade' }),

  // Version info
  name: text({ length: 100 }).notNull(), // Semver: 1.2.0, 2.0.0-beta.1
  channel: text({ enum: ['release', 'beta', 'alpha'] }).notNull().default('release'),

  // File info
  url: text().notNull(),
  size: integer().notNull(), // Bytes

  // Metadata
  changelog: text().notNull().default(''),
  downloads: integer().notNull().default(0),

  ...state,
  ...timestamps,
  publishedAt: integer('published_at', { mode: 'timestamp' }),
});

export const modCategories = sqliteTable('mod_categories',
  {
    modId: text('mod_id').notNull().references(() => mods.id, { onDelete: 'cascade' }),
    categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  },
  t => [primaryKey({ columns: [t.modId, t.categoryId] })],
);

export const modLikes = sqliteTable('mod_likes',
  {
    modId: text('mod_id').notNull().references(() => mods.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  },
  t => [primaryKey({ columns: [t.modId, t.userId] })],
);

export const modVersionGameVersions = sqliteTable('mod_version_game_versions',
  {
    modVersionId: text('mod_version_id').notNull().references(() => modVersions.id, { onDelete: 'cascade' }),
    gameVersionId: text('game_version_id').notNull().references(() => gameVersions.id, { onDelete: 'cascade' }),
  },
  t => [primaryKey({ columns: [t.modVersionId, t.gameVersionId] })],
);

export type Mod = typeof mods.$inferInsert;
export type ModVersion = typeof modVersions.$inferInsert;
export type ModCategory = typeof modCategories.$inferInsert;
export type ModLike = typeof modLikes.$inferInsert;
export type ModVersionGameVersion = typeof modVersionGameVersions.$inferInsert;
