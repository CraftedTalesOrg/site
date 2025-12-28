import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text({ length: 100 }).primaryKey(),
  name: text({ length: 100 }).notNull().unique(),
});

export type Category = typeof categories.$inferInsert;
