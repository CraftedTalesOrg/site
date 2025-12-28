import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { state, timestamps } from './column.helpers';
import { media } from './media';

export const users = sqliteTable('users', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),

  // Public fields
  username: text({ length: 255 }).notNull().unique(),
  bio: text().notNull().default(''),
  avatarId: text('avatar_id').references(() => media.id),
  // TODO ROLES CHECK AGAIN IMPLEMENTATION
  roles: text({ mode: 'json' }).$type<string[]>().notNull().default([]),

  // Internal fields
  email: text({ length: 255 }).notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  password: text(), // Nullable for OAuth-only accounts
  twoFactorEnabled: integer('two_factor_enabled', { mode: 'boolean' }).notNull().default(false),
  twoFactorSecret: text('two_factor_secret'),

  ...state,
  ...timestamps,
});

export type User = typeof users.$inferInsert;
