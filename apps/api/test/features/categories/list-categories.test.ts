import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../../src/index';
import { createTestCategory } from '../../factories';
import type { ListCategoriesResponse } from '../../../src/features/categories/categories.schemas';

describe('GET /api/v1/categories', () => {
  describe('success cases', () => {
    it('should return empty array when no categories exist', async () => {
      // Act: Make request
      const res = await app.request('/api/v1/categories', {}, env);

      // Assert: Check response
      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data).toEqual({ data: [] });
    });

    it('should return a list of categories', async () => {
      // Arrange: Create test categories
      const category1 = await createTestCategory(env, {
        name: 'Tools',
        slug: 'tools',
      });
      const category2 = await createTestCategory(env, {
        name: 'Weapons',
        slug: 'weapons',
      });
      const category3 = await createTestCategory(env, {
        name: 'Armor',
        slug: 'armor',
      });

      // Act: Make request
      const res = await app.request('/api/v1/categories', {}, env);

      // Assert: Check response status and structure
      expect(res.status).toBe(200);
      const responseData = await res.json<ListCategoriesResponse>();

      // Verify response shape
      expect(responseData).toHaveProperty('data');
      expect(Array.isArray(responseData.data)).toBe(true);
      expect(responseData.data).toHaveLength(3);

      // Verify all categories are returned
      const categoryIds = responseData.data.map(cat => cat.id);

      expect(categoryIds).toContain(category1.id);
      expect(categoryIds).toContain(category2.id);
      expect(categoryIds).toContain(category3.id);
    });

    it('should return categories with correct structure', async () => {
      // Arrange: Create a test category
      const category = await createTestCategory(env, {
        name: 'Magic',
        slug: 'magic',
      });

      // Act: Make request
      const res = await app.request('/api/v1/categories', {}, env);

      // Assert: Check category structure
      expect(res.status).toBe(200);
      const responseData = await res.json<ListCategoriesResponse>();
      const returnedCategory = responseData.data[0];

      // Verify category has required fields
      expect(returnedCategory).toHaveProperty('id');
      expect(returnedCategory).toHaveProperty('name');
      expect(returnedCategory).toHaveProperty('slug');

      // Verify field values match
      expect(returnedCategory.id).toBe(category.id);
      expect(returnedCategory.name).toBe('Magic');
      expect(returnedCategory.slug).toBe('magic');
    });

    it('should return multiple categories in a stable order', async () => {
      // Arrange: Create multiple categories
      const categories = await Promise.all([
        createTestCategory(env, { name: 'Category A', slug: 'category-a' }),
        createTestCategory(env, { name: 'Category B', slug: 'category-b' }),
        createTestCategory(env, { name: 'Category C', slug: 'category-c' }),
        createTestCategory(env, { name: 'Category D', slug: 'category-d' }),
        createTestCategory(env, { name: 'Category E', slug: 'category-e' }),
      ]);

      // Act: Make request
      const res = await app.request('/api/v1/categories', {}, env);

      // Assert: Check all categories are returned
      expect(res.status).toBe(200);
      const responseData = await res.json<ListCategoriesResponse>();

      expect(responseData.data).toHaveLength(5);

      // Verify all created categories are present
      const returnedIds = responseData.data.map(cat => cat.id);

      categories.forEach((category) => {
        expect(returnedIds).toContain(category.id);
      });
    });
  });

  describe('response headers', () => {
    it('should return correct content-type header', async () => {
      // Act: Make request
      const res = await app.request('/api/v1/categories', {}, env);

      // Assert: Check content-type
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');
    });
  });

  describe('endpoint availability', () => {
    it('should be accessible without authentication', async () => {
      // Arrange: Create a category
      await createTestCategory(env);

      // Act: Make request without auth
      const res = await app.request('/api/v1/categories', {}, env);

      // Assert: Should succeed (public endpoint)
      expect(res.status).toBe(200);
      const data = await res.json<ListCategoriesResponse>();

      expect(data.data).toHaveLength(1);
    });
  });
});
