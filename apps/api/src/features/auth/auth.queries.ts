import { users } from '@craftedtales/db';
import { eq } from 'drizzle-orm';
import type { Database } from '../../utils/db';

export const authQueries = {
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
