export * from './users';
export * from './categories';
export * from './mods';
export * from './modVersions';
export * from './media';
export * from './interactions';
export * from './column.helpers';
export * from './relations';

import { users } from './users';
import { categories } from './categories';
import { mods, modCategories } from './mods';
import { modVersions } from './modVersions';
import { media } from './media';
import { modLikes, reports } from './interactions';

export const schema = {
  users,
  categories,
  mods,
  modCategories,
  modVersions,
  media,
  modLikes,
  reports,
};
