import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text({ length: 100 }).notNull().unique(),
  slug: text({ length: 100 }).notNull().unique(),
});
