import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const gameVersions = sqliteTable('game_versions', {
  id: text({ length: 100 }).primaryKey(),
  name: text({ length: 100 }).notNull().unique(),
});

export type GameVersion = typeof gameVersions.$inferInsert;
