import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { state, timestamps } from './column.helpers';

export const media = sqliteTable('media', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),

  // File info
  filename: text().notNull(),
  url: text().notNull(),
  size: integer().notNull(), // Bytes
  mimeType: text().notNull(), // e.g., image/png, image/jpeg, image/webp

  // Image dimensions
  width: integer(), // px
  height: integer(), // px

  ...state,
  ...timestamps,
});
