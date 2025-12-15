import { integer } from 'drizzle-orm/sqlite-core';

export const state = {
  enabled: integer({ mode: 'boolean' }).notNull().default(true),
  deleted: integer({ mode: 'boolean' }).notNull().default(false),
};

export const timestamps = {
  createdAt: integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
  deletedAt: integer({ mode: 'timestamp' }),
};
