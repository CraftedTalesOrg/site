import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './column.helpers';
import { users } from './users';

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
