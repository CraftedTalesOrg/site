export * from './users';
export * from './categories';
export * from './gameVersions';
export * from './mods';
export * from './media';
export * from './reports';
export * from './column.helpers';
export * from './relations';

import { users } from './users';
import { categories } from './categories';
import { gameVersions } from './gameVersions';
import { mods, modCategories, modLikes, modVersions, modVersionGameVersions } from './mods';
import { media } from './media';
import { reports } from './reports';

export const schema = {
  users,
  categories,
  gameVersions,
  mods,
  modCategories,
  modVersions,
  modVersionGameVersions,
  media,
  modLikes,
  reports,
};
