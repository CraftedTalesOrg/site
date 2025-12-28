import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import {
  createTestUser,
  createTestMod,
  createTestCategory,
  createTestModVersion,
  softDeleteMod,
} from '../../factories';
import type { PublicModVersion } from '../../../src/features/mods/mods.schemas';
import type { ErrorResponse, PaginatedResponse } from '../../../src/features/_shared/common.schemas';

describe('GET /api/v1/mods/{slug}/versions', () => {
  describe('success cases', () => {
    it('should return empty list when mod has no versions', async () => {
      const user = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        categoryIds: [category.id],
        slug: 'test-mod',
        status: 'published',
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}/versions`, {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicModVersion>>();

      expect(data.data).toEqual([]);
      expect(data.totalItems).toBe(0);
    });

    it('should return list of versions for a mod', async () => {
      const user = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        categoryIds: [category.id],
        slug: 'versioned-mod',
        status: 'published',
      });

      // Create versions using factory
      await createTestModVersion(env, {
        modId: mod.id,
        name: '1.0.0',
        gameVersions: ['1.0', '1.1'],
        changelog: 'Initial release',
      });

      await createTestModVersion(env, {
        modId: mod.id,
        name: '1.1.0',
        gameVersions: ['1.1', '1.2'],
        changelog: 'Bug fixes',
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}/versions`, {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicModVersion>>();

      expect(data.data).toHaveLength(2);
      expect(data.totalItems).toBe(2);
      expect(data.data[0].name).toBeDefined();
      expect(data.data[0].modId).toBe(mod.id);
      expect(data.data[0].gameVersions).toBeDefined();
    });

    it('should paginate versions correctly', async () => {
      const user = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        categoryIds: [category.id],
        slug: 'paginated-versions',
        status: 'published',
      });

      // Create 5 versions
      for (let i = 1; i <= 5; i++) {
        await createTestModVersion(env, {
          modId: mod.id,
          name: `${i}.0.0`,
          changelog: `Version ${i}`,
        });
      }

      const res = await app.request(
        `/api/v1/mods/${mod.slug}/versions?page=1&limit=2`,
        {},
        env,
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicModVersion>>();

      expect(data.data).toHaveLength(2);
      expect(data.totalItems).toBe(5);
    });

    it('should not include deleted or disabled versions', async () => {
      const user = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        categoryIds: [category.id],
        slug: 'filtered-versions',
        status: 'published',
      });

      // Create normal version
      await createTestModVersion(env, {
        modId: mod.id,
        name: '1.0.0',
        changelog: 'Normal version',
      });

      // Create deleted version
      await createTestModVersion(env, {
        modId: mod.id,
        name: '2.0.0',
        changelog: 'Deleted version',
        deleted: true,
      });

      // Create disabled version
      await createTestModVersion(env, {
        modId: mod.id,
        name: '3.0.0',
        changelog: 'Disabled version',
        enabled: false,
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}/versions`, {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicModVersion>>();

      expect(data.data).toHaveLength(1);
      expect(data.data[0].name).toBe('1.0.0');
    });
  });

  describe('error cases', () => {
    it('should return 404 for non-existent mod', async () => {
      const res = await app.request('/api/v1/mods/non-existent-mod/versions', {}, env);

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('NOT_FOUND');
    });

    it('should return 404 for deleted mod', async () => {
      const user = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        categoryIds: [category.id],
        slug: 'deleted-mod',
        status: 'published',
      });

      // Soft delete the mod using helper
      await softDeleteMod(env, mod.id);

      const res = await app.request(`/api/v1/mods/${mod.slug}/versions`, {}, env);

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('NOT_FOUND');
    });
  });

  describe('validation', () => {
    it('should validate pagination parameters', async () => {
      const user = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        categoryIds: [category.id],
        slug: 'test-mod',
        status: 'published',
      });

      const res = await app.request(
        `/api/v1/mods/${mod.slug}/versions?page=-1&limit=0`,
        {},
        env,
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should use default pagination when not provided', async () => {
      const user = await createTestUser(env);
      const category = await createTestCategory(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        categoryIds: [category.id],
        slug: 'default-pagination',
        status: 'published',
      });

      const res = await app.request(`/api/v1/mods/${mod.slug}/versions`, {}, env);

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicModVersion>>();

      expect(data.totalItems).toBe(0);
    });
  });
});
