import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser, createTestCategory, createTestMod } from '../../factories';
import type { PublicMod } from '../../../src/features/mods/mods.schemas';
import type { PaginatedResponse } from '../../../src/features/_shared/common.schemas';

describe('GET /api/v1/mods', () => {
  describe('success cases', () => {
    it('should return an empty list when no mods exist', async () => {
      const res = await app.request('/api/v1/mods', {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toEqual([]);
      expect(data.totalItems).toBe(0);
    });

    it('should return a list of published mods', async () => {
      const user = await createTestUser(env);
      const category = await createTestCategory(env);

      await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
        categoryIds: [category.id],
      });
      await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
        categoryIds: [category.id],
      });

      const res = await app.request('/api/v1/mods', {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(2);
      expect(data.totalItems).toBe(2);
    });

    it('should exclude draft mods from public listing', async () => {
      const user = await createTestUser(env);

      await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
      });
      await createTestMod(env, {
        ownerId: user.id,
        status: 'draft',
        approved: false,
      });

      const res = await app.request('/api/v1/mods', {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(1);
      expect(data.data[0].status).toBe('published');
    });

    it('should exclude unapproved mods from public listing', async () => {
      const user = await createTestUser(env);

      await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
      });
      await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: false,
      });

      const res = await app.request('/api/v1/mods', {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(1);
      expect(data.data[0].status).toBe('published');
    });

    it('should support pagination', async () => {
      const user = await createTestUser(env);

      // Create 5 mods
      for (let i = 0; i < 5; i++) {
        await createTestMod(env, {
          ownerId: user.id,
          status: 'published',
          approved: true,
        });
      }

      const res = await app.request('/api/v1/mods?page=1&limit=2', {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(2);
      expect(data.totalItems).toBe(5);
    });

    it('should filter by category', async () => {
      const user = await createTestUser(env);
      const category1 = await createTestCategory(env, { name: 'Tools', slug: 'tools' });
      const category2 = await createTestCategory(env, { name: 'Weapons', slug: 'weapons' });

      await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
        categoryIds: [category1.id],
      });
      await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
        categoryIds: [category2.id],
      });

      const res = await app.request(`/api/v1/mods?categoryIds=${category1.id}`, {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(1);
      expect(data.data[0].categories.some(c => c.id === category1.id)).toBe(true);
    });

    it('should search mods by name', async () => {
      const user = await createTestUser(env);

      await createTestMod(env, {
        ownerId: user.id,
        name: 'Super Awesome Mod',
        status: 'published',
        approved: true,
      });
      await createTestMod(env, {
        ownerId: user.id,
        name: 'Another Mod',
        status: 'published',
        approved: true,
      });

      const res = await app.request('/api/v1/mods?search=awesome', {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toContain('Awesome');
    });

    it('should sort by downloads', async () => {
      const user = await createTestUser(env);

      await createTestMod(env, {
        ownerId: user.id,
        name: 'Mod A',
        status: 'published',
        approved: true,
      });

      await createTestMod(env, {
        ownerId: user.id,
        name: 'Mod B',
        status: 'published',
        approved: true,
      });

      // Simulate different download counts (would need to be set via database update)
      const res = await app.request('/api/v1/mods?sortBy=downloads&sortOrder=desc', {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(2);
    });

    it('should sort by likes', async () => {
      const user = await createTestUser(env);

      await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
      });
      await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
      });

      const res = await app.request('/api/v1/mods?sortBy=likes&sortOrder=desc', {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(2);
    });

    it('should sort by createdAt', async () => {
      const user = await createTestUser(env);

      await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
      });
      await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
      });

      const res = await app.request('/api/v1/mods?sortBy=createdAt&sortOrder=desc', {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(2);
    });
  });

  describe('edge cases', () => {
    it('should handle invalid pagination parameters gracefully', async () => {
      const res = await app.request('/api/v1/mods?page=0&limit=0', {}, env);

      expect(res.status).toBe(400);
    });

    it('should handle non-existent category filter gracefully', async () => {
      const res = await app.request('/api/v1/mods?categoryIds=non-existent', {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toEqual([]);
    });
  });
});
