import { users } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { Database } from '../../utils/db';
import type { PrivateUser, PublicUser } from '../auth/auth.schemas';
import type { PublicMod } from '../mods/mods.schemas';
import type { PaginatedResponse } from '../_shared/common.schemas';

/**
 * Database queries for users feature
 *
 * All queries return API-ready types (PrivateUser, PublicUser, PublicMod)
 */

/**
 * Transform DB user with avatar to PrivateUser
 */
function toPrivateUser(
  user: typeof users.$inferSelect & {
    avatar?: typeof import('@craftedtales/db').media.$inferSelect | null;
  },
): PrivateUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    twoFactorEnabled: !!user.twoFactorSecret,
    roles: user.roles,
    enabled: user.enabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    avatar: user.avatar ?? null,
  };
}

/**
 * Transform DB user with avatar to PublicUser
 */
function toPublicUser(
  user: typeof users.$inferSelect & {
    avatar?: typeof import('@craftedtales/db').media.$inferSelect | null;
  },
): PublicUser {
  return {
    id: user.id,
    username: user.username,
    bio: user.bio,
    twoFactorEnabled: !!user.twoFactorSecret,
    roles: user.roles,
    enabled: user.enabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    avatar: user.avatar ?? null,
  };
}

export const usersQueries = {
  /**
   * Get user by ID - returns PrivateUser
   */
  async getUserById(db: Database, userId: string): Promise<PrivateUser | null> {
    const user = await db.query.users.findFirst({
      where: { id: userId, deleted: false },
      with: {
        avatar: {
          where: { deleted: false },
        },
      },
    });

    if (!user) {
      return null;
    }

    return toPrivateUser(user);
  },

  /**
   * Get user by username - returns PublicUser
   */
  async getUserByUsername(db: Database, username: string): Promise<PublicUser | null> {
    const user = await db.query.users.findFirst({
      where: { username, deleted: false },
      with: {
        avatar: {
          where: { deleted: false },
        },
      },
    });

    if (!user) {
      return null;
    }

    return toPublicUser(user);
  },

  /**
   * Get user ID by username (lightweight query)
   */
  async getUserIdByUsername(db: Database, username: string): Promise<{ id: string } | null> {
    const user = await db.query.users.findFirst({
      where: { username, deleted: false },
      columns: { id: true },
    });

    return user ?? null;
  },

  /**
   * Update user profile (bio) - returns updated PrivateUser
   */
  async updateUserProfile(
    db: Database,
    userId: string,
    data: { bio?: string | null },
  ): Promise<PrivateUser | null> {
    await db
      .update(users)
      .set({
        bio: data.bio,
      })
      .where(eq(users.id, userId));

    return await usersQueries.getUserById(db, userId);
  },

  /**
   * Get user's published mods (paginated) - returns PublicMod[]
   */
  async getUserPublishedMods(
    db: Database,
    userId: string,
    options: { page: number; limit: number },
  ): Promise<PaginatedResponse<PublicMod>> {
    const { page, limit } = options;

    const userMods = await db.query.mods.findMany({
      where: {
        ownerId: userId,
        deleted: false,
        status: 'published',
        visibility: 'public',
      },
      with: {
        owner: {
          columns: {
            id: true,
            username: true,
            bio: true,
            roles: true,
          },
          with: {
            avatar: {
              where: { deleted: false },
            },
          },
        },
        icon: {
          where: { deleted: false },
        },
        modCategories: {
          with: {
            category: true,
          },
        },
        modVersions: {
          where: { deleted: false },
          orderBy: { createdAt: 'desc' },
        },
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    // Get total count
    const allMods = await db.query.mods.findMany({
      where: {
        ownerId: userId,
        deleted: false,
        status: 'published',
        visibility: 'public',
      },
      columns: { id: true },
    });

    const totalItems = allMods.length;

    // Transform to API format
    const data = userMods.map(mod => ({
      ...mod,
      icon: mod.icon ?? null,
      owner: mod.owner
        ? { ...mod.owner, avatar: mod.owner.avatar ?? null }
        : { id: '', username: '[deleted]', bio: null, roles: [], avatar: null },
      categories: mod.modCategories
        .map(mc => mc.category)
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null),
      versions: mod.modVersions,
    }));

    return { data, totalItems };
  },
};
