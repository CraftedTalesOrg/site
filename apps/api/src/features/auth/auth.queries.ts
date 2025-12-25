import { users } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { Database } from '../../utils/db';
import type { PrivateUser, RegisterRequest } from './auth.schemas';

export const authQueries = {
  /**
   * Find user by email
   */
  async findUserByEmail(db: Database, email: string): Promise<PrivateUser | null> {
    const user = await db.query.users.findFirst({
      where: { email, deleted: false },
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

    return user ?? null;
  },

  /**
   * Find user by username
   */
  async findUserByUsername(db: Database, username: string): Promise<{ id: string } | null> {
    const user = await db.query.users.findFirst({
      // Not filtering with deleted: false to allow checking usernames of deleted accounts
      where: { username },
      columns: { id: true },
    });

    return user ?? null;
  },

  /**
   * Find user by ID
   */
  async findUserById(db: Database, userId: string): Promise<PrivateUser | null> {
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

    return user ?? null;
  },

  /**
   * Create a new user
   */
  async createUser(
    db: Database,
    data: RegisterRequest,
    hashedPassword: string,
  ): Promise<PrivateUser | null> {
    const [insertedUser] = await db.insert(users).values({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    }).returning({ id: users.id });

    return await authQueries.findUserById(db, insertedUser.id);
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
