import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestUser } from '../../factories';
import { authenticatedRequest } from '../../helpers/auth';
import type { PrivateMod } from '../../../src/features/mods/mods.schemas';
import type { ErrorResponse } from '../../../src/features/_shared/common.schemas';

describe('POST /api/v1/mods', () => {
  describe('success cases', () => {
    it('should create a mod with valid data', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'My New Mod',
          slug: 'my-new-mod',
          summary: 'A great mod for Hytale',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(201);
      const data = await res.json<PrivateMod>();

      expect(data.name).toBe('My New Mod');
      expect(data.slug).toBe('my-new-mod');
      expect(data.summary).toBe('A great mod for Hytale');
      expect(data.visibility).toBe('public');
      expect(data.status).toBe('draft');
      expect(data.approved).toBe(false);
      expect(data.owner?.id).toBe(user.id);
    });

    it('should create a mod with minimal required fields', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Minimal Mod',
          slug: 'minimal-mod',
          summary: 'Summary',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(201);
      const data = await res.json<PrivateMod>();

      expect(data.name).toBe('Minimal Mod');
      expect(data.slug).toBe('minimal-mod');
    });

    it('should create a mod with unlisted visibility', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Unlisted Mod',
          slug: 'unlisted-mod',
          summary: 'An unlisted mod',
          visibility: 'unlisted',
        }),
      });

      expect(res.status).toBe(201);
      const data = await res.json<PrivateMod>();

      expect(data.visibility).toBe('unlisted');
    });

    it('should create a mod with private visibility', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Private Mod',
          slug: 'private-mod',
          summary: 'A private mod',
          visibility: 'private',
        }),
      });

      expect(res.status).toBe(201);
      const data = await res.json<PrivateMod>();

      expect(data.visibility).toBe('private');
    });

    it('should set creator as owner', async () => {
      const user = await createTestUser(env, { username: 'modcreator' });

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'My Mod',
          slug: 'my-mod',
          summary: 'My awesome mod',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(201);
      const data = await res.json<PrivateMod>();

      expect(data.owner?.username).toBe('modcreator');
    });
  });

  describe('authentication errors', () => {
    it('should reject unauthenticated requests', async () => {
      const res = await app.request('/api/v1/mods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'My Mod',
          slug: 'my-mod',
          summary: 'A mod',
          visibility: 'public',
        }),
      }, env);

      expect(res.status).toBe(401);
    });

    it('should reject requests with invalid token', async () => {
      const res = await app.request('/api/v1/mods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer invalid-token',
        },
        body: JSON.stringify({
          name: 'My Mod',
          slug: 'my-mod',
          summary: 'A mod',
          visibility: 'public',
        }),
      }, env);

      expect(res.status).toBe(401);
    });
  });

  describe('validation errors', () => {
    it('should reject missing name field', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          slug: 'my-mod',
          summary: 'A mod',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject missing slug field', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'My Mod',
          summary: 'A mod',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject missing summary field', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'My Mod',
          slug: 'my-mod',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject missing visibility field', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'My Mod',
          slug: 'my-mod',
          summary: 'A mod',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject invalid visibility value', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'My Mod',
          slug: 'my-mod',
          summary: 'A mod',
          visibility: 'invalid',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject empty name', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
          slug: 'my-mod',
          summary: 'A mod',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject empty slug', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'My Mod',
          slug: '',
          summary: 'A mod',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(400);
    });

    it('should reject slug with invalid characters', async () => {
      const user = await createTestUser(env);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'My Mod',
          slug: 'my mod!',
          summary: 'A mod',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(400);
    });
  });

  describe('business logic errors', () => {
    it('should reject duplicate slug', async () => {
      const user = await createTestUser(env);

      // Create first mod
      await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'First Mod',
          slug: 'duplicate-slug',
          summary: 'First mod',
          visibility: 'public',
        }),
      });

      // Try to create second mod with same slug
      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Second Mod',
          slug: 'duplicate-slug',
          summary: 'Second mod',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(409);
      const error = await res.json<ErrorResponse>();

      expect(error.code).toBe('SLUG_EXISTS');
      expect(error.error).toBe('Slug already exists');
    });

    it('should reject duplicate slug from different users', async () => {
      const user1 = await createTestUser(env);
      const user2 = await createTestUser(env);

      // User 1 creates mod
      await authenticatedRequest(app, env, user1, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'User 1 Mod',
          slug: 'shared-slug',
          summary: 'User 1 mod',
          visibility: 'public',
        }),
      });

      // User 2 tries to use same slug
      const res = await authenticatedRequest(app, env, user2, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'User 2 Mod',
          slug: 'shared-slug',
          summary: 'User 2 mod',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(409);
    });
  });

  describe('edge cases', () => {
    it('should handle very long mod names within limit', async () => {
      const user = await createTestUser(env);
      const longName = 'A'.repeat(200);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: longName,
          slug: 'long-name-mod',
          summary: 'A mod with a long name',
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(201);
    });

    it('should handle very long summaries within limit', async () => {
      const user = await createTestUser(env);
      const longSummary = 'S'.repeat(500);

      const res = await authenticatedRequest(app, env, user, '/api/v1/mods', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Long Summary Mod',
          slug: 'long-summary-mod',
          summary: longSummary,
          visibility: 'public',
        }),
      });

      expect(res.status).toBe(201);
    });
  });
});
