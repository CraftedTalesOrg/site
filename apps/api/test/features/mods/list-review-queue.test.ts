import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser, createTestMod, createTestCategory, softDeleteMod } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { PublicMod } from '../../../src/features/mods/mods.schemas';
import type { ErrorResponse, PaginatedResponse } from '../../../src/features/_shared/common.schemas';

describe('GET /api/v1/admin/mods/review-queue', () => {
  describe('success cases', () => {
    it('should allow admin to access review queue', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/admin/mods/review-queue',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should allow moderator to access review queue', async () => {
      const moderator = await createTestUser(env, { roles: ['moderator'] });

      const res = await authenticatedRequest(
        app,
        env,
        moderator,
        '/api/v1/admin/mods/review-queue',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toBeDefined();
    });

    it('should return only unapproved mods by default', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);

      // Create approved mod
      await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'approved-mod',
        status: 'published',
        approved: true,
      });

      // Create unapproved mod
      const unapprovedMod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'unapproved-mod',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/admin/mods/review-queue',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(1);
      expect(data.data[0].slug).toBe(unapprovedMod.slug);
    });

    it('should filter by approved=true', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);

      // Create approved mod
      const approvedMod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'approved-filter',
        status: 'published',
        approved: true,
      });

      // Create unapproved mod
      await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'unapproved-filter',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/admin/mods/review-queue?approved=true',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data.length).toBeGreaterThan(0);
      expect(data.data.some((mod: PublicMod) => mod.slug === approvedMod.slug)).toBe(true);
    });

    it('should show all mods when approved=all', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);

      // Create approved mod
      await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'all-approved',
        status: 'published',
        approved: true,
      });

      // Create unapproved mod
      await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'all-unapproved',
        status: 'published',
        approved: false,
      });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/admin/mods/review-queue?approved=all',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should paginate results correctly', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);

      // Create multiple unapproved mods
      for (let i = 1; i <= 5; i++) {
        await createTestMod(env, {
          ownerId: author.id,
          categoryIds: [category.id],
          slug: `review-mod-${i}`,
          status: 'published',
          approved: false,
        });
      }

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/admin/mods/review-queue?page=1&limit=2',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data).toHaveLength(2);
      expect(data.totalItems).toBeGreaterThanOrEqual(5);
    });

    it('should not include deleted mods in review queue', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });
      const author = await createTestUser(env);
      const category = await createTestCategory(env);

      // Create unapproved mod
      const mod = await createTestMod(env, {
        ownerId: author.id,
        categoryIds: [category.id],
        slug: 'deleted-review-mod',
        status: 'published',
        approved: false,
      });

      // Soft delete it
      await softDeleteMod(env, mod.id);

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/admin/mods/review-queue',
      );

      expect(res.status).toBe(200);
      const data = await res.json<PaginatedResponse<PublicMod>>();

      expect(data.data.every((item: PublicMod) => item.slug !== mod.slug)).toBe(true);
    });
  });

  describe('authorization errors', () => {
    it('should deny access to regular users', async () => {
      const user = await createTestUser(env, { roles: ['user'] });

      const res = await authenticatedRequest(
        app,
        env,
        user,
        '/api/v1/admin/mods/review-queue',
      );

      expect(res.status).toBe(403);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('ACCESS_DENIED');
    });

    it('should deny access to unauthenticated requests', async () => {
      const res = await app.request('/api/v1/admin/mods/review-queue', {}, env);

      expect(res.status).toBe(401);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('validation', () => {
    it('should validate approved parameter', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/admin/mods/review-queue?approved=invalid',
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate pagination parameters', async () => {
      const admin = await createTestUser(env, { roles: ['admin'] });

      const res = await authenticatedRequest(
        app,
        env,
        admin,
        '/api/v1/admin/mods/review-queue?page=-1&limit=0',
      );

      expect(res.status).toBe(400);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('VALIDATION_ERROR');
    });
  });
});
