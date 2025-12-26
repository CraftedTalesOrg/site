export * from './users';
export * from './categories';
export * from './mods';
export * from './media';
export * from './reports';
export * from './column.helpers';
export * from './relations';

import { users } from './users';
import { categories } from './categories';
import { mods, modCategories, modLikes, modVersions } from './mods';
import { media } from './media';
import { reports } from './reports';

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
