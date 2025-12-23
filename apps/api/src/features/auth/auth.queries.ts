import { users } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { Database } from '../../utils/db';
import type { PrivateUser, RegisterRequest } from './auth.schemas';

/**
 * Database queries for auth feature
 *
 * All queries return API-ready types (PrivateUser) with proper transformations
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
 * Internal type for DB user with password (needed for login verification)
 */
export type UserWithPassword = PrivateUser & { password: string | null };

/**
 * Transform DB user to UserWithPassword (for login)
 */
function toUserWithPassword(
  user: typeof users.$inferSelect & {
    avatar?: typeof import('@craftedtales/db').media.$inferSelect | null;
  },
): UserWithPassword {
  return {
    ...toPrivateUser(user),
    password: user.password,
  };
}

export const authQueries = {
  /**
   * Find user by email (for login, password reset)
   * Returns UserWithPassword to allow password verification
   */
  async findUserByEmail(db: Database, email: string): Promise<UserWithPassword | null> {
    const user = await db.query.users.findFirst({
      where: { email, deleted: false },
      with: {
        avatar: {
          where: { deleted: false },
        },
      },
    });

    if (!user) {
      return null;
    }

    return toUserWithPassword(user);
  },

  /**
   * Find user by username (for registration check)
   */
  async findUserByUsername(db: Database, username: string): Promise<{ id: string } | null> {
    const user = await db.query.users.findFirst({
      where: { username, deleted: false },
      columns: { id: true },
    });

    return user ?? null;
  },

  /**
   * Find user by ID - returns PrivateUser
   */
  async findUserById(db: Database, userId: string): Promise<PrivateUser | null> {
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
   * Create a new user - returns PrivateUser
   */
  async createUser(
    db: Database,
    userId: string,
    data: RegisterRequest,
    hashedPassword: string,
  ): Promise<PrivateUser | null> {
    await db.insert(users).values({
      id: userId,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      bio: '',
      emailVerified: false,
      enabled: true,
      roles: ['user'],
    });

    return await authQueries.findUserById(db, userId);
  },

  /**
   * Update user password
   */
  async updatePassword(db: Database, userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  },

  /**
   * Mark email as verified
   */
  async markEmailVerified(db: Database, userId: string): Promise<void> {
    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, userId));
  },
};
