import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { state, timestamps } from './column.helpers';

export const media = sqliteTable('media', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),

  // File info
  fileName: text().notNull(),
  fileUrl: text().notNull(),
  fileSize: integer().notNull(), // Bytes
  mimeType: text().notNull(), // e.g., image/png, image/jpeg, image/webp

  // Image dimensions
  width: integer(), // px
  height: integer(), // px

  ...state,
  ...timestamps,
});
