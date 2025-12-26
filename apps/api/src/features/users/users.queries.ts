import { users, Database } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { RegisterRequest } from '../auth/auth.schemas';
import type { PrivateUser, PublicUser, UpdateProfileRequest } from './users.schemas';

export const usersQueries = {
  /**
   * Find user by ID
   */
  async findById(db: Database, userId: string): Promise<PrivateUser | null> {
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
   * Find user by email
   */
  async findByEmail(db: Database, email: string): Promise<PrivateUser | null> {
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
  async findByUsername(db: Database, username: string): Promise<PublicUser | null> {
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

    return user ?? null;
  },

  /**
   * Check if username exists
   */
  async existsUsername(db: Database, username: string): Promise<boolean> {
    const user = await db.query.users.findFirst({
      // Not filtering with deleted: false to allow checking usernames of deleted accounts
      where: { username },
      columns: { id: true },
    });

    return !!user;
  },

  /**
   * Create a new user
   */
  async create(
    db: Database,
    data: RegisterRequest,
    hashedPassword: string,
  ): Promise<PrivateUser | null> {
    const [insertedUser] = await db.insert(users).values({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    }).returning({ id: users.id });

    return await usersQueries.findById(db, insertedUser.id);
  },

  /**
   * Update user profile
   */
  async update(
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

    return await usersQueries.findById(db, userId);
  },

  /**
   * Set a user's enabled state
   */
  async setEnabled(
    db: Database,
    userId: string,
    enabled: boolean,
  ): Promise<void> {
    await db
      .update(users)
      .set({ enabled })
      .where(eq(users.id, userId));
  },
};
