import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { schema } from '../schema';
import { TEST_PASSWORD } from './constants';
import { batchInsert, logInsert } from './utils';
import { DrizzleD1 } from '..';

const { users } = schema;

/**
 * Seed users table
 */
export async function seedUsers(
  db: DrizzleD1,
  avatarIds: string[],
): Promise<string[]> {
  console.info('\n👥 Seeding users...');

  // Hash password once and reuse for all users
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

  const userData = Array.from({ length: 30 }).map((_, index) => ({
    id: crypto.randomUUID(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: passwordHash,
    bio: faker.lorem.sentences(2),
    avatarId: index < avatarIds.length ? avatarIds[index] : null,
    roles: [],
    emailVerified: faker.helpers.arrayElement([true, true, true, false, false, false, false]), // 30% verified
    twoFactorEnabled: false,
    twoFactorSecret: null,
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: faker.date.recent({ days: 60 }),
    enabled: true,
    deleted: false,
    deletedAt: null,
  }));

  await batchInsert(db, users, userData);

  logInsert('users', userData.length);

  return userData.map(u => u.id);
}
