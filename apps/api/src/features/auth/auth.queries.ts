import { users } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { Database } from '../../utils/db';
import type { RegisterRequest } from './auth.schemas';

/**
 * Database queries for auth feature
 */

export const authQueries = {
  /**
   * Find user by email (for login, password reset, registration check)
   */
  async findUserByEmail(db: Database, email: string): Promise<typeof users.$inferSelect | undefined> {
    return await db.query.users.findFirst({
      where: { email, deleted: false },
      with: {
        avatar: {
          where: { deleted: false },
        },
      },
    });
  },

  /**
   * Find user by username (for registration check)
   */
  async findUserByUsername(db: Database, username: string): Promise<{ id: string } | undefined> {
    return await db.query.users.findFirst({
      where: { username, deleted: false },
      columns: { id: true },
    });
  },

  /**
   * Find user by ID
   */
  async findUserById(db: Database, userId: string): Promise<typeof users.$inferSelect | undefined> {
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
   * Create a new user
   */
  async createUser(
    db: Database,
    userId: string,
    data: RegisterRequest,
    hashedPassword: string,
  ): Promise<typeof users.$inferSelect | undefined> {
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
