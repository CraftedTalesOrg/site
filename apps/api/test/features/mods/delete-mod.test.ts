import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser, createTestMod } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { SuccessResponse, ErrorResponse } from '../../../src/features/_shared/common.schemas';
import type { PublicMod } from '../../../src/features/mods/mods.schemas';

describe('DELETE /api/v1/mods/:id', () => {
  describe('success cases', () => {
    it('should delete a mod', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        slug: 'mod-to-delete',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
      expect(data.message).toBe('Mod deleted successfully');
    });

    it('should soft delete (mod still exists in database but marked as deleted)', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        slug: 'soft-delete-mod',
      });

      const deleteRes = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
      });

      expect(deleteRes.status).toBe(200);

      // Try to fetch the deleted mod
      const getRes = await app.request(`/api/v1/mods/${mod.slug}`, {}, env);

      // Should return 404 for public access
      expect(getRes.status).toBe(404);
    });

    it('should delete draft mod', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        status: 'draft',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
    });

    it('should delete published mod', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        status: 'published',
        approved: true,
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
    });

    it('should delete private mod', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        visibility: 'private',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
    });

    it('should delete unlisted mod', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        visibility: 'unlisted',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      const data = await res.json<SuccessResponse>();

      expect(data.success).toBe(true);
    });
  });

  describe('authentication errors', () => {
    it('should reject unauthenticated requests', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      const res = await app.request(`/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
      }, env);

      expect(res.status).toBe(401);
    });

    it('should reject requests with invalid token', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      const res = await app.request(`/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      }, env);

      expect(res.status).toBe(401);
    });
  });

  describe('authorization errors', () => {
    it('should reject delete from non-owner', async () => {
      const owner = await createTestUser(env, { username: 'owner' });
      const otherUser = await createTestUser(env, { username: 'other' });
      const mod = await createTestMod(env, {
        ownerId: owner.id,
      });

      const res = await authenticatedRequest(app, env, otherUser, `/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(403);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('ACCESS_DENIED');
      expect(error.error).toBe('Not owner of mod');
    });

    it('should only allow owner to delete their own mod', async () => {
      const user1 = await createTestUser(env);
      const user2 = await createTestUser(env);
      const mod1 = await createTestMod(env, {
        ownerId: user1.id,
        slug: 'user1-mod',
      });
      const mod2 = await createTestMod(env, {
        ownerId: user2.id,
        slug: 'user2-mod',
      });

      // User 1 can delete their own mod
      const res1 = await authenticatedRequest(app, env, user1, `/api/v1/mods/${mod1.id}`, {
        method: 'DELETE',
      });

      expect(res1.status).toBe(200);

      // But cannot delete user 2's mod
      const res2 = await authenticatedRequest(app, env, user1, `/api/v1/mods/${mod2.id}`, {
        method: 'DELETE',
      });

      expect(res2.status).toBe(403);
    });
  });

  describe('error cases', () => {
    it('should return 404 for non-existent mod', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods/non-existent-mod', {
        method: 'DELETE',
      });

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('MOD_NOT_FOUND');
      expect(error.error).toBe('Mod not found');
    });

    it('should return 404 when trying to delete already deleted mod', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      // Delete once
      await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
      });

      // Try to delete again
      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(404);
    });
  });

  describe('edge cases', () => {
    it('should handle deleting mod with special characters in slug', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        slug: 'mod-with-dashes-123',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
    });

    it('should not affect other mods when deleting one mod', async () => {
      const user = await createTestUser(env);
      const mod1 = await createTestMod(env, {
        ownerId: user.id,
        slug: 'mod-1',
        status: 'published',
        approved: true,
      });
      const mod2 = await createTestMod(env, {
        ownerId: user.id,
        slug: 'mod-2',
        status: 'published',
        approved: true,
      });

      // Delete mod 1
      const deleteRes = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod1.id}`, {
        method: 'DELETE',
      });

      expect(deleteRes.status).toBe(200);

      // Mod 2 should still be accessible
      const getRes = await app.request(`/api/v1/mods/${mod2.slug}`, {}, env);

      expect(getRes.status).toBe(200);
      const data = await getRes.json<PublicMod>();

      expect(data.slug).toBe('mod-2');
    });
  });
});
