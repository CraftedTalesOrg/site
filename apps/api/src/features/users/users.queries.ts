import { users } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { Database } from '../../utils/db';
import type { PrivateUser, PublicUser, UpdateProfileRequest } from '../auth/auth.schemas';

export const usersQueries = {
  /**
   * Get user by ID
   */
  async getById(db: Database, userId: string): Promise<PrivateUser | null> {
    const user = await db.query.users.findFirst({
      where: { id: userId, deleted: false },
      columns: {
        id: true,
        username: true,
        email: true,
        bio: true,
        twoFactorEnabled: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        avatar: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  },

  /**
   * Get user by username
   */
  async getByUsername(db: Database, username: string): Promise<PublicUser | null> {
    const user = await db.query.users.findFirst({
      where: { username, deleted: false },
      columns: {
        id: true,
        username: true,
        bio: true,
        createdAt: true,
      },
      with: {
        avatar: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  },

  /**
   * Update user profile
   */
  async updateProfile(
    db: Database,
    userId: string,
    data: UpdateProfileRequest,
  ): Promise<PrivateUser | null> {
    await db
      .update(users)
      .set({
        avatarId: data.avatarId,
        username: data.username,
        email: data.email,
        bio: data.bio,
        twoFactorEnabled: data.twoFactorEnabled,
      })
      .where(eq(users.id, userId));

    return await usersQueries.getById(db, userId);
  },
};
