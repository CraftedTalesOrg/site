import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './column.helpers';
import { users } from './users';

export const reports = sqliteTable('reports', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),

  // Reporter - set null on delete to preserve report history
  reporterId: text('reporter_id').references(() => users.id, { onDelete: 'set null' }),

  // Target (can be mod or user)
  targetType: text('target_type', { enum: ['mod', 'user'] }).notNull(),
  targetId: text('target_id').notNull(),

  // Report details
  reason: text({ enum: ['spam', 'inappropriate', 'copyright', 'malware', 'harassment', 'other'] }).notNull(),
  description: text().notNull(),

  // Status
  status: text({ enum: ['pending', 'reviewed', 'resolved', 'dismissed'] }).notNull().default('pending'),
  // Reviewer - set null on delete to preserve review history
  reviewedBy: text('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
  resolution: text(),

  ...timestamps,
});

export type Report = typeof reports.$inferInsert;
