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
  downloads: integer().notNull().default(0), // TODO Total downloads across all versions, should it be calculated?
  likes: integer().notNull().default(0), // TODO It is in a relation, should it be calculated?

  // Relationships
  ownerId: text().notNull().references(() => users.id, { onDelete: 'cascade' }),

  ...state,
  ...timestamps,
});

export const modCategories = sqliteTable('mod_categories',
  {
    modId: text().notNull().references(() => mods.id, { onDelete: 'cascade' }),
    categoryId: text().notNull().references(() => categories.id, { onDelete: 'cascade' }),
  },
  t => [primaryKey({ columns: [t.modId, t.categoryId] })],
);
