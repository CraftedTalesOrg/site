import type { ProvidedEnv } from 'cloudflare:test';
import { createDb, users, categories, mods, modCategories, reports } from '@craftedtales/db';
import { hashPassword } from '../../src/utils/auth';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TestUser {
  id: string;
  username: string;
  email: string;
  password: string; // Plain text password for login tests
  roles: string[];
  emailVerified: boolean;
}

export interface TestCategory {
  id: string;
  name: string;
  slug: string;
}

export interface TestMod {
  id: string;
  slug: string;
  name: string;
  summary: string;
  ownerId: string;
  status: 'draft' | 'published';
  visibility: 'public' | 'unlisted' | 'private';
  approved: boolean;
}

export interface TestReport {
  id: string;
  reporterId: string | null;
  targetType: 'mod' | 'user';
  targetId: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
}

// ─────────────────────────────────────────────────────────────────────────────
// Counters for unique values
// ─────────────────────────────────────────────────────────────────────────────

let userCounter = 0;
let categoryCounter = 0;
let modCounter = 0;
let reportCounter = 0;

/**
 * Reset all counters between test suites if needed
 */
export function resetFactoryCounters(): void {
  userCounter = 0;
  categoryCounter = 0;
  modCounter = 0;
  reportCounter = 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// User Factory
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateTestUserOptions {
  username?: string;
  email?: string;
  password?: string;
  roles?: string[];
  emailVerified?: boolean;
  bio?: string;
}

/**
 * Create a test user in the database
 *
 * @example
 * const user = await createTestUser(env);
 * const admin = await createTestUser(env, { roles: ['admin'] });
 * const verified = await createTestUser(env, { emailVerified: true });
 */
export async function createTestUser(
  env: ProvidedEnv,
  options: CreateTestUserOptions = {},
): Promise<TestUser> {
  const db = createDb(env.craftedtales_db);
  const count = ++userCounter;

  const plainPassword = options.password ?? 'TestPassword123!';
  const hashedPassword = await hashPassword(plainPassword);

  const userData = {
    username: options.username ?? `testuser${count}`,
    email: options.email ?? `testuser${count}@example.com`,
    password: hashedPassword,
    roles: options.roles ?? [],
    emailVerified: options.emailVerified ?? false,
    bio: options.bio ?? '',
  };

  const [inserted] = await db.insert(users).values(userData).returning();

  return {
    id: inserted.id,
    username: inserted.username,
    email: inserted.email,
    password: plainPassword, // Return plain password for login tests
    roles: inserted.roles,
    emailVerified: inserted.emailVerified,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Category Factory
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateTestCategoryOptions {
  name?: string;
  slug?: string;
}

/**
 * Create a test category in the database
 *
 * @example
 * const category = await createTestCategory(env);
 * const tools = await createTestCategory(env, { name: 'Tools', slug: 'tools' });
 */
export async function createTestCategory(
  env: ProvidedEnv,
  options: CreateTestCategoryOptions = {},
): Promise<TestCategory> {
  const db = createDb(env.craftedtales_db);
  const count = ++categoryCounter;

  const categoryData = {
    name: options.name ?? `Category ${count}`,
    slug: options.slug ?? `category-${count}`,
  };

  const [inserted] = await db.insert(categories).values(categoryData).returning();

  return {
    id: inserted.id,
    name: inserted.name,
    slug: inserted.slug,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mod Factory
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateTestModOptions {
  slug?: string;
  name?: string;
  summary?: string;
  description?: string;
  ownerId: string; // Required - must reference an existing user
  status?: 'draft' | 'published';
  visibility?: 'public' | 'unlisted' | 'private';
  approved?: boolean;
  categoryIds?: string[];
}

/**
 * Create a test mod in the database
 *
 * @example
 * const user = await createTestUser(env);
 * const mod = await createTestMod(env, { ownerId: user.id });
 * const published = await createTestMod(env, { ownerId: user.id, status: 'published', approved: true });
 */
export async function createTestMod(
  env: ProvidedEnv,
  options: CreateTestModOptions,
): Promise<TestMod> {
  const db = createDb(env.craftedtales_db);
  const count = ++modCounter;

  const modData = {
    slug: options.slug ?? `test-mod-${count}`,
    name: options.name ?? `Test Mod ${count}`,
    summary: options.summary ?? `Summary for test mod ${count}`,
    description: options.description ?? `Description for test mod ${count}`,
    ownerId: options.ownerId,
    status: options.status ?? 'draft',
    visibility: options.visibility ?? 'public',
    approved: options.approved ?? false,
  };

  const [inserted] = await db.insert(mods).values(modData).returning();

  // Add category associations if provided
  if (options.categoryIds && options.categoryIds.length > 0) {
    await db.insert(modCategories).values(
      options.categoryIds.map(categoryId => ({
        modId: inserted.id,
        categoryId,
      })),
    );
  }

  return {
    id: inserted.id,
    slug: inserted.slug,
    name: inserted.name,
    summary: inserted.summary,
    ownerId: inserted.ownerId,
    status: inserted.status,
    visibility: inserted.visibility,
    approved: inserted.approved,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Report Factory
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateTestReportOptions {
  reporterId?: string | null;
  targetType: 'mod' | 'user';
  targetId: string;
  reason?: string;
  description?: string;
  status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
}

/**
 * Create a test report in the database
 *
 * @example
 * const reporter = await createTestUser(env);
 * const target = await createTestUser(env);
 * const report = await createTestReport(env, {
 *   reporterId: reporter.id,
 *   targetType: 'user',
 *   targetId: target.id,
 * });
 */
export async function createTestReport(
  env: ProvidedEnv,
  options: CreateTestReportOptions,
): Promise<TestReport> {
  const db = createDb(env.craftedtales_db);
  const count = ++reportCounter;

  const reportData = {
    reporterId: options.reporterId ?? null,
    targetType: options.targetType,
    targetId: options.targetId,
    reason: options.reason ?? 'spam',
    description: options.description ?? `Test report ${count} description`,
    status: options.status ?? 'pending',
  };

  const [inserted] = await db.insert(reports).values(reportData).returning();

  return {
    id: inserted.id,
    reporterId: inserted.reporterId,
    targetType: inserted.targetType,
    targetId: inserted.targetId,
    reason: inserted.reason,
    description: inserted.description,
    status: inserted.status,
  };
}
