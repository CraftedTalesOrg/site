import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser, createTestMod, createTestCategory } from '../../factories';
import type { ErrorResponse, PaginatedResponse } from '../../../src/features/_shared/common.schemas';
import type { PublicMod } from '../../../src/features/mods/mods.schemas';

describe('GET /api/v1/users/{username}/mods', () => {
  describe('success cases', () => {
    it('should return empty list when user has no mods', async () => {
      // Arrange: Create user without mods
      await createTestUser(env, { username: 'nomoduser' });

      // Act: Make request
      const res = await app.request('/api/v1/users/nomoduser/mods', {}, env);

      // Assert: Check response
      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toEqual([]);
      expect(data.totalItems).toBe(0);
    });

    it('should return user mods', async () => {
      // Arrange: Create user and mods
      const user = await createTestUser(env, { username: 'modauthor' });
      const category = await createTestCategory(env, { name: 'Tools' });

      const mod1 = await createTestMod(env, {
        ownerId: user.id,
        categoryIds: [category.id],
        name: 'Mod One',
        slug: 'mod-one',
        status: 'published',
      });

      const mod2 = await createTestMod(env, {
        ownerId: user.id,
        categoryIds: [category.id],
        name: 'Mod Two',
        slug: 'mod-two',
        status: 'published',
      });

      // Act: Make request
      const res = await app.request('/api/v1/users/modauthor/mods', {}, env);

      // Assert: Check response
      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(2);
      expect(data.totalItems).toBe(2);

      const modIds = data.data.map(m => m.id);

      expect(modIds).toContain(mod1.id);
      expect(modIds).toContain(mod2.id);
    });

    it('should support pagination with page parameter', async () => {
      // Arrange: Create user with multiple mods
      const user = await createTestUser(env, { username: 'paginationuser' });
      const category = await createTestCategory(env);

      // Create 5 mods
      for (let i = 1; i <= 5; i++) {
        await createTestMod(env, {
          ownerId: user.id,
          categoryIds: [category.id],
          name: `Mod ${i}`,
          slug: `mod-${i}`,
          status: 'published',
        });
      }

      // Act: Request page 1 with limit 2
      const res = await app.request('/api/v1/users/paginationuser/mods?page=1&limit=2', {}, env);

      // Assert: Check pagination
      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(2);
      expect(data.totalItems).toBe(5);
    });

    it('should support pagination with page 2', async () => {
      // Arrange: Create user with multiple mods
      const user = await createTestUser(env, { username: 'page2user' });
      const category = await createTestCategory(env);

      // Create 5 mods
      for (let i = 1; i <= 5; i++) {
        await createTestMod(env, {
          ownerId: user.id,
          categoryIds: [category.id],
          name: `Mod ${i}`,
          slug: `page2-mod-${i}`,
          status: 'published',
        });
      }

      // Act: Request page 2 with limit 2
      const res = await app.request('/api/v1/users/page2user/mods?page=2&limit=2', {}, env);

      // Assert: Check pagination
      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(2);
      expect(data.totalItems).toBe(5);
    });

    it('should use default pagination when not specified', async () => {
      // Arrange: Create user with a mod
      const user = await createTestUser(env, { username: 'defaultpagination' });
      const category = await createTestCategory(env);

      await createTestMod(env, {
        ownerId: user.id,
        categoryIds: [category.id],
        slug: 'default-mod',
        status: 'published',
      });

      // Act: Request without pagination params
      const res = await app.request('/api/v1/users/defaultpagination/mods', {}, env);

      // Assert: Check default pagination
      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.totalItems).toBe(1);
    });

    it('should only return published mods for the specific user', async () => {
      // Arrange: Create two users
      const user1 = await createTestUser(env, { username: 'user1' });
      const user2 = await createTestUser(env, { username: 'user2' });
      const category = await createTestCategory(env);

      // Create mods for user1
      await createTestMod(env, {
        ownerId: user1.id,
        categoryIds: [category.id],
        slug: 'user1-mod',
        status: 'published',
      });

      // Create mods for user2
      await createTestMod(env, {
        ownerId: user2.id,
        categoryIds: [category.id],
        slug: 'user2-mod',
        status: 'published',
      });

      // Act: Request user1's mods
      const res = await app.request('/api/v1/users/user1/mods', {}, env);

      // Assert: Should only return user1's mods
      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(1);
      expect(data.data[0].slug).toBe('user1-mod');
    });
  });

  describe('not found errors', () => {
    it('should return 404 for non-existent user', async () => {
      // Act: Request mods for non-existent user
      const res = await app.request('/api/v1/users/nonexistentuser/mods', {}, env);

      // Assert: Should return 404
      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('USER_NOT_FOUND');
    });
  });

  describe('endpoint availability', () => {
    it('should be accessible without authentication', async () => {
      // Arrange: Create user
      await createTestUser(env, { username: 'publicmods' });

      // Act: Make request without auth
      const res = await app.request('/api/v1/users/publicmods/mods', {}, env);

      // Assert: Should succeed (public endpoint)
      expect(res.status).toBe(200);
    });
  });

  describe('response headers', () => {
    it('should return correct content-type header', async () => {
      // Arrange: Create user
      await createTestUser(env, { username: 'headeruser' });

      // Act: Make request
      const res = await app.request('/api/v1/users/headeruser/mods', {}, env);

      // Assert: Check content-type
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');
    });
  });
});
