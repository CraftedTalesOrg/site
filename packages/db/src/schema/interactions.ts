import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './column.helpers';
import { mods } from './mods';
import { users } from './users';

export const modLikes = sqliteTable('mod_likes', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  modId: text().notNull().references(() => mods.id, { onDelete: 'cascade' }),
  // userId becomes nullable when user is soft-deleted
  // API must filter out likes where userId is null when counting active likes
  userId: text().references(() => users.id, { onDelete: 'set null' }),
  ...timestamps,
});

export const reports = sqliteTable('reports', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),

  // Reporter - set null on delete to preserve report history
  reporterId: text().references(() => users.id, { onDelete: 'set null' }),

  // Target (can be mod or user)
  targetType: text({ enum: ['mod', 'user'] }).notNull(),
  targetId: text().notNull(),

  // Report details
  reason: text({ length: 100 }).notNull(), // Predefined reason
  description: text().notNull(),

  // Status
  status: text({ enum: ['pending', 'reviewed', 'resolved', 'dismissed'] }).notNull().default('pending'),
  // Reviewer - set null on delete to preserve review history
  reviewedBy: text().references(() => users.id, { onDelete: 'set null' }),
  resolution: text(),

  ...timestamps,
});
