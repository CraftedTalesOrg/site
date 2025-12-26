import { users, Database } from '@craftedtales/db';
import { eq } from 'drizzle-orm';

export const authQueries = {
  /**
   * Find user credentials for authentication (id and password only)
   */
  async findCredentialsByEmail(
    db: Database,
    email: string,
  ): Promise<{ id: string; password: string | null } | null> {
    const user = await db.query.users.findFirst({
      where: { email, deleted: false },
      columns: {
        id: true,
        password: true,
      },
    });

    return user ?? null;
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
