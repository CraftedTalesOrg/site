import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser, createTestMod } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { PrivateMod } from '../../../src/features/mods/mods.schemas';
import type { ErrorResponse } from '../../../src/features/_shared/common.schemas';

describe('PATCH /api/v1/mods/:id', () => {
  describe('success cases', () => {
    it('should update a mod name', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        name: 'Original Name',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Name',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      expect(data.name).toBe('Updated Name');
    });

    it('should update a mod summary', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        summary: 'Original summary',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          summary: 'Updated summary',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      expect(data.summary).toBe('Updated summary');
    });

    it('should update a mod description', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        description: 'Original description',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          description: 'Updated description',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      expect(data.description).toBe('Updated description');
    });

    it('should update a mod visibility', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        visibility: 'public',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          visibility: 'private',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      expect(data.visibility).toBe('private');
    });

    it('should update a mod status from draft to published', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        status: 'draft',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'published',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      expect(data.status).toBe('published');
    });

    it('should update multiple fields at once', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        name: 'Original',
        summary: 'Original summary',
        visibility: 'public',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Name',
          summary: 'Updated summary',
          visibility: 'unlisted',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      expect(data.name).toBe('Updated Name');
      expect(data.summary).toBe('Updated summary');
      expect(data.visibility).toBe('unlisted');
    });

    it('should allow partial updates', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        name: 'Original Name',
        summary: 'Original summary',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Only Name Updated',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      expect(data.name).toBe('Only Name Updated');
      expect(data.summary).toBe('Original summary');
    });

    it('should update slug', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        slug: 'original-slug',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          slug: 'new-slug',
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      expect(data.slug).toBe('new-slug');
    });
  });

  describe('authentication errors', () => {
    it('should reject unauthenticated requests', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      const res = await app.request(`/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Updated Name',
        }),
      }, env);

      expect(res.status).toBe(401);
    });
  });

  describe('authorization errors', () => {
    it('should reject update from non-owner', async () => {
      const owner = await createTestUser(env, { username: 'owner' });
      const otherUser = await createTestUser(env, { username: 'other' });
      const mod = await createTestMod(env, {
        ownerId: owner.id,
      });

      const res = await authenticatedRequest(app, env, otherUser, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Attempted Update',
        }),
      });

      expect(res.status).toBe(403);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('ACCESS_DENIED');
    });
  });

  describe('validation errors', () => {
    it('should reject invalid visibility value', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          visibility: 'invalid',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject invalid status value', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'invalid',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject empty name', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: '',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject empty slug', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          slug: '',
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe('business logic errors', () => {
    it('should return 404 for non-existent mod', async () => {
      const user = await createTestUser(env);

      // Use a valid UUID that doesn't exist
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${nonExistentId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Updated Name',
        }),
      });

      expect(res.status).toBe(404);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('MOD_NOT_FOUND');
    });

    it('should reject slug change to existing slug', async () => {
      const user = await createTestUser(env);

      await createTestMod(env, {
        ownerId: user.id,
        slug: 'existing-slug',
      });
      const mod2 = await createTestMod(env, {
        ownerId: user.id,
        slug: 'another-slug',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod2.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          slug: 'existing-slug',
        }),
      });

      expect(res.status).toBe(409);
    });
  });

  describe('edge cases', () => {
    it('should handle updating with no changes', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        name: 'Same Name',
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Same Name',
        }),
      });

      expect(res.status).toBe(200);
    });

    it('should handle empty update body', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(200);
    });

    it('should not allow updating ownerId', async () => {
      const user = await createTestUser(env);
      const otherUser = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ownerId: otherUser.id,
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      // Owner should remain unchanged
      expect(data.owner?.id).toBe(user.id);
    });

    it('should not allow updating downloads count', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          downloads: 999999,
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      // Downloads should remain at 0
      expect(data.downloads).toBe(0);
    });

    it('should not allow updating likes count', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          likes: 999999,
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      // Likes should remain at 0
      expect(data.likes).toBe(0);
    });

    it('should not allow updating approved status via regular update', async () => {
      const user = await createTestUser(env);
      const mod = await createTestMod(env, {
        ownerId: user.id,
        approved: false,
      });

      const res = await authenticatedRequest(app, env, user, `/api/v1/mods/${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          approved: true,
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json<PrivateMod>();

      // Approved should remain false (requires admin review)
      expect(data.approved).toBe(false);
    });
  });
});
