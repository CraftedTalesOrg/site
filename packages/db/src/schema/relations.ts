import { defineRelations } from 'drizzle-orm';
import { categories } from './categories';
import { gameVersions } from './gameVersions';
import { media } from './media';
import { mods, modVersions, modCategories, modLikes, modVersionGameVersions } from './mods';
import { users } from './users';
import { reports } from './reports';

export const relations = defineRelations(
  {
    users,
    categories,
    gameVersions,
    mods,
    modCategories,
    modVersions,
    modVersionGameVersions,
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
        where: { deleted: false },
      }),
      ownedMods: r.many.mods(),
      modLikes: r.many.modLikes(),
      submittedReports: r.many.reports({ alias: 'submitted_reports' }),
      reviewedReports: r.many.reports({ alias: 'reviewed_reports' }),
    },

    // ========================================================================
    // Mods Relations
    // ========================================================================
    mods: {
      icon: r.one.media({
        from: r.mods.iconId,
        to: r.media.id,
        where: { deleted: false },
      }),
      owner: r.one.users({
        from: r.mods.ownerId,
        to: r.users.id,
        where: { deleted: false },
      }),
      categories: r.many.categories({
        from: r.mods.id.through(r.modCategories.modId),
        to: r.categories.id.through(r.modCategories.categoryId),
      }),
      versions: r.many.modVersions({
        where: { deleted: false },
      }),
      modLikes: r.many.modLikes(),
    },

    // ========================================================================
    // Mod Versions Relations
    // ========================================================================
    modVersions: {
      mod: r.one.mods({
        from: r.modVersions.modId,
        to: r.mods.id,
      }),
      gameVersions: r.many.gameVersions({
        from: r.modVersions.id.through(r.modVersionGameVersions.modVersionId),
        to: r.gameVersions.id.through(r.modVersionGameVersions.gameVersionId),
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
        alias: 'submitted_reports',
      }),
      reviewer: r.one.users({
        from: r.reports.reviewedBy,
        to: r.users.id,
        alias: 'reviewed_reports',
      }),
    },

    // ========================================================================
    // Game Versions Relations
    // ========================================================================
    gameVersions: {
      modVersions: r.many.modVersions({
        from: r.gameVersions.id.through(r.modVersionGameVersions.gameVersionId),
        to: r.modVersions.id.through(r.modVersionGameVersions.modVersionId),
      }),
    },
  }),
);
