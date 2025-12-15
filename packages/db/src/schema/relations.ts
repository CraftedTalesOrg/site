import { defineRelations } from 'drizzle-orm';
import { categories } from './categories';
import { modLikes, reports } from './interactions';
import { media } from './media';
import { modCategories, mods } from './mods';
import { users } from './users';
import { modVersions } from './modVersions';

export const relations = defineRelations(
  {
    users,
    categories,
    mods,
    modCategories,
    modVersions,
    modLikes,
    reports,
    media,
  },
  r => ({
    // ========================================================================
    // Users Relations
    // ========================================================================
    users: {
      avatar: r.one.media({
        from: r.users.avatarId,
        to: r.media.id,
      }),
      ownedMods: r.many.mods(),
      modLikes: r.many.modLikes(),
      submittedReports: r.many.reports({ alias: 'submittedReports' }),
      reviewedReports: r.many.reports({ alias: 'reviewedReports' }),
    },

    // ========================================================================
    // Categories Relations
    // ========================================================================
    categories: {
      modCategories: r.many.modCategories(),
    },

    // ========================================================================
    // Mods Relations
    // ========================================================================
    mods: {
      icon: r.one.media({
        from: r.mods.iconId,
        to: r.media.id,
      }),
      owner: r.one.users({
        from: r.mods.ownerId,
        to: r.users.id,
      }),
      modCategories: r.many.modCategories(),
      modVersions: r.many.modVersions(),
      modLikes: r.many.modLikes(),
    },

    // ========================================================================
    // Mod Categories (Junction) Relations
    // ========================================================================
    modCategories: {
      mod: r.one.mods({
        from: r.modCategories.modId,
        to: r.mods.id,
      }),
      category: r.one.categories({
        from: r.modCategories.categoryId,
        to: r.categories.id,
      }),
    },

    // ========================================================================
    // Mod Versions Relations
    // ========================================================================
    modVersions: {
      mod: r.one.mods({
        from: r.modVersions.modId,
        to: r.mods.id,
      }),
    },

    // ========================================================================
    // Mod Likes Relations
    // ========================================================================
    modLikes: {
      mod: r.one.mods({
        from: r.modLikes.modId,
        to: r.mods.id,
      }),
      user: r.one.users({
        from: r.modLikes.userId,
        to: r.users.id,
      }),
    },

    // ========================================================================
    // Media Relations
    // ========================================================================
    media: {
      userAvatars: r.many.users({
        from: r.media.id,
        to: r.users.avatarId,
      }),
      modIcons: r.many.mods({
        from: r.media.id,
        to: r.mods.iconId,
      }),
    },

    // ========================================================================
    // Reports Relations
    // ========================================================================
    reports: {
      reporter: r.one.users({
        from: r.reports.reporterId,
        to: r.users.id,
        alias: 'submittedReports',
      }),
      reviewer: r.one.users({
        from: r.reports.reviewedBy,
        to: r.users.id,
        alias: 'reviewedReports',
      }),
    },
  }),
);
