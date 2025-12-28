import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser, createTestCategory, createTestMod } from '../../factories';
import type { PublicMod } from '../../../src/features/mods/mods.schemas';
import type { ErrorResponse } from '../../../src/features/_shared/common.schemas';

describe('GET /api/v1/mods/:slug', () => {
  describe('success cases', () => {
    it('should return a mod by slug', async () => {
      const user = await createTestUser(env, { username: 'modauthor' });
      const category = await createTestCategory(env, { name: 'Tools', slug: 'tools' });
      const mod = await createTestMod(env, {
        ownerId: user.id,
        slug: 'awesome-mod',
        name: 'Awesome Mod',
        summary: 'An awesome test mod',
        status: 'published',
        approved: true,
        categoryIds: [category.id],
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}`, {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PublicMod>();

      expect(data.slug).toBe('awesome-mod');
      expect(data.name).toBe('Awesome Mod');
      expect(data.summary).toBe('An awesome test mod');
      expect(data.owner?.username).toBe('modauthor');
      expect(data.categories).toHaveLength(1);
      expect(data.categories[0].id).toBe('tools');
    });

    it('should return mod with owner information', async () => {
      const user = await createTestUser(env, {
        username: 'creator',
        bio: 'I create mods',
      });
      const mod = await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}`, {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PublicMod>();

      expect(data.owner).toBeDefined();
      expect(data.owner?.username).toBe('creator');
      expect(data.owner?.bio).toBe('I create mods');
    });

    it('should return mod with multiple categories', async () => {
      const user = await createTestUser(env);
      const category1 = await createTestCategory(env, { name: 'Tools', slug: 'tools' });
      const category2 = await createTestCategory(env, { name: 'Weapons', slug: 'weapons' });
      const mod = await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
        categoryIds: [category1.id, category2.id],
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}`, {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PublicMod>();

      expect(data.categories).toHaveLength(2);
      const categorySlugs = data.categories.map(c => c.id);

      expect(categorySlugs).toContain('tools');
      expect(categorySlugs).toContain('weapons');
    });

    it('should return mod with versions array', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}`, {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PublicMod>();

      expect(data.versions).toBeDefined();
      expect(Array.isArray(data.versions)).toBe(true);
    });

    it('should return mod statistics', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}`, {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PublicMod>();

      expect(data.downloads).toBeDefined();
      expect(data.likes).toBeDefined();
      expect(typeof data.downloads).toBe('number');
      expect(typeof data.likes).toBe('number');
    });
  });

  describe('error cases', () => {
    it('should return 404 when mod does not exist', async () => {
      const res = await app.request('/api/v1/mods/non-existent-mod', {}, env);

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('MOD_NOT_FOUND');
    });

    it('should return 404 for draft mods accessed by slug', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        slug: 'draft-mod',
        status: 'draft',
        approved: false,
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}`, {}, env);

      expect(res.status).toBe(404);
    });

    it('should return 404 for unapproved published mods', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        slug: 'unapproved-mod',
        status: 'published',
        approved: false,
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}`, {}, env);

      expect(res.status).toBe(404);
    });

    it('should return 404 for private visibility mods', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        slug: 'private-mod',
        status: 'published',
        approved: true,
        visibility: 'private',
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}`, {}, env);

      expect(res.status).toBe(404);
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in slug', async () => {
      const res = await app.request('/api/v1/mods/mod-with-special-chars-!@#', {}, env);

      expect(res.status).toBe(404);
    });

    it('should be case-sensitive for slug matching', async () => {
      const user = await createTestUser(env);

      await createTestMod(env, {
        ownerId: user.id,
        slug: 'lowercase-mod',
        status: 'published',
        approved: true,
      });

      const res = await app.request('/api/v1/mods/LOWERCASE-MOD', {}, env);

      // Slug matching should be case-sensitive
      expect(res.status).toBe(404);
    });
  });
});
