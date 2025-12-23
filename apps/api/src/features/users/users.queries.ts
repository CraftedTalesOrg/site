import { users } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { Database } from '../../utils/db';

/**
 * Database queries for users feature
 */

export const usersQueries = {
  /**
   * Get user by ID with avatar relation
   */
  async getUserById(db: Database, userId: string): Promise<typeof users.$inferSelect | undefined> {
    return await db.query.users.findFirst({
      where: { id: userId, deleted: false },
      with: {
        avatar: {
          where: { deleted: false },
        },
      },
    });
  },

  /**
   * Get user by username with avatar relation
   */
  async getUserByUsername(db: Database, username: string): Promise<typeof users.$inferSelect | undefined> {
    return await db.query.users.findFirst({
      where: { username, deleted: false },
      with: {
        avatar: {
          where: { deleted: false },
        },
      },
    });
  },

  /**
   * Get user ID by username (lightweight query)
   */
  async getUserIdByUsername(db: Database, username: string): Promise<{ id: string } | undefined> {
    return await db.query.users.findFirst({
      where: { username, deleted: false },
      columns: { id: true },
    });
  },

  /**
   * Update user profile (bio)
   */
  async updateUserProfile(
    db: Database,
    userId: string,
    data: { bio?: string | null },
  ): Promise<void> {
    await db
      .update(users)
      .set({
        bio: data.bio,
      })
      .where(eq(users.id, userId));
  },

  /**
   * Get user's published mods (paginated)
   */
  async getUserPublishedMods(
    db: Database,
    userId: string,
    options: { page: number; limit: number },
  ): Promise<Awaited<ReturnType<typeof db.query.mods.findMany>>> {
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
            avatarId: true,
            roles: true,
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
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

    return userMods;
  },

  /**
   * Count user's published mods
   */
  async countUserPublishedMods(db: Database, userId: string): Promise<number> {
    const result = await db.query.mods.findMany({
      where: {
        ownerId: userId,
        deleted: false,
        status: 'published',
        visibility: 'public',
      },
      columns: { id: true },
    });

    return result.length;
  },
};
