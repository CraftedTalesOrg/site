import { integer } from 'drizzle-orm/sqlite-core';

export const state = {
  enabled: integer({ mode: 'boolean' }).notNull().default(true),
  deleted: integer({ mode: 'boolean' }).notNull().default(false),
};

export const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
};
