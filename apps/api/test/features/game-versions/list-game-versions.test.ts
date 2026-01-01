import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestGameVersion } from '../../factories';
import type { ListGameVersionsResponse } from '../../../src/features/game-versions/game-versions.schemas';

describe('GET /api/v1/game-versions', () => {
  describe('success cases', () => {
    it('should return empty array when no game versions exist', async () => {
      // Act: Make request
      const res = await app.request('/api/v1/game-versions', {}, env);

      // Assert: Check response
      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data).toEqual({ data: [] });
    });

    it('should return a list of game versions', async () => {
      // Arrange: Create test game versions
      const version1 = await createTestGameVersion(env, {
        id: '1.0.0',
        name: '1.0.0',
      });
      const version2 = await createTestGameVersion(env, {
        id: '1.1.0',
        name: '1.1.0',
      });
      const version3 = await createTestGameVersion(env, {
        id: '2.0.0-beta.1',
        name: '2.0.0-beta.1',
      });

      // Act: Make request
      const res = await app.request('/api/v1/game-versions', {}, env);

      // Assert: Check response status and structure
      expect(res.status).toBe(200);
      const responseData = await res.json<ListGameVersionsResponse>();

      // Verify response shape
      expect(responseData).toHaveProperty('data');
      expect(Array.isArray(responseData.data)).toBe(true);
      expect(responseData.data).toHaveLength(3);

      // Verify all game versions are returned
      const versionIds = responseData.data.map(v => v.id);

      expect(versionIds).toContain(version1.id);
      expect(versionIds).toContain(version2.id);
      expect(versionIds).toContain(version3.id);

      // Verify data structure of first version
      const firstVersion = responseData.data[0];

      expect(firstVersion).toHaveProperty('id');
      expect(firstVersion).toHaveProperty('name');
      expect(typeof firstVersion.id).toBe('string');
      expect(typeof firstVersion.name).toBe('string');
    });

    it('should return game versions sorted by id in ascending order', async () => {
      // Arrange: Create test game versions in random order
      await createTestGameVersion(env, { id: '2.0.0', name: '2.0.0' });
      await createTestGameVersion(env, { id: '1.0.0', name: '1.0.0' });
      await createTestGameVersion(env, { id: '1.5.0', name: '1.5.0' });

      // Act: Make request
      const res = await app.request('/api/v1/game-versions', {}, env);

      // Assert: Verify ordering
      expect(res.status).toBe(200);
      const responseData = await res.json<ListGameVersionsResponse>();

      expect(responseData.data).toHaveLength(3);

      // Should be sorted alphabetically by id (note: not semver sorted)
      expect(responseData.data[0].id).toBe('2.0.0');
      expect(responseData.data[1].id).toBe('1.5.0');
      expect(responseData.data[2].id).toBe('1.0.0');
    });
  });

  describe('response format', () => {
    it('should have correct content-type header', async () => {
      // Arrange
      await createTestGameVersion(env);

      // Act
      const res = await app.request('/api/v1/game-versions', {}, env);

      // Assert
      expect(res.headers.get('content-type')).toContain('application/json');
    });

    it('should return valid JSON', async () => {
      // Act
      const res = await app.request('/api/v1/game-versions', {}, env);

      // Assert
      expect(res.status).toBe(200);
      expect(async () => await res.json()).not.toThrow();
    });
  });
});
