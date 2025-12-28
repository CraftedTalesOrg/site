import { eq } from 'drizzle-orm';
import { ModLike, schema } from '../schema';
import { batchInsert, logInsert } from './utils';
import { DrizzleD1 } from '..';

const { mods, modLikes } = schema;

/**
 * Seed mod likes and update denormalized counts
 */
export async function seedModLikes(
  db: DrizzleD1,
  modIds: string[],
  userIds: string[],
): Promise<void> {
  console.info('\n💖  Seeding mod likes...');

  const likes: ModLike[] = [];
  const likeCountByMod = new Map<string, number>();

  // Generate 200 likes distributed across mods
  for (let i = 0; i < 200; i++) {
    const modId = modIds[Math.floor(Math.random() * modIds.length)];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];

    // Avoid duplicate likes (same user + mod combo)
    const key = `${modId}-${userId}`;

    if (!likes.find(like => `${like.modId}-${like.userId}` === key)) {
      likes.push({ modId, userId });
      likeCountByMod.set(modId, (likeCountByMod.get(modId) || 0) + 1);
    }
  }

  await batchInsert(db, modLikes, likes);

  logInsert('mod_likes', likes.length);

  // Update denormalized like counts
  console.info('   ⟳ Updating mod like counts...');

  for (const [modId, count] of likeCountByMod.entries()) {
    await db.update(mods).set({ likes: count }).where(eq(mods.id, modId));
  }

  console.info(`   ✓ Updated ${likeCountByMod.size} mods with like counts`);
}
