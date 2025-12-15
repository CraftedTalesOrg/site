import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { state, timestamps } from './column.helpers';
import { media } from './media';

export const users = sqliteTable('users', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),

  // Public fields
  username: text({ length: 255 }).notNull().unique(),
  bio: text(),
  avatarId: text().references(() => media.id),
  // TODO ROLES CHECK AGAIN IMPLEMENTATION
  roles: text({ mode: 'json' }).$type<string[]>().notNull().default([]),

  // Internal fields
  email: text({ length: 255 }).notNull().unique(),
  emailVerified: integer({ mode: 'boolean' }).notNull().default(false),
  password: text(), // Nullable for OAuth-only accounts
  twoFactorEnabled: integer({ mode: 'boolean' }).notNull().default(false),
  twoFactorSecret: text(),

  ...state,
  ...timestamps,
});
