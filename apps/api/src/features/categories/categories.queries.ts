import type { Database } from '../../utils/db';
import type { Category } from './categories.schemas';

/**
 * Database queries for categories feature
 */

export const categoriesQueries = {
  /**
   * Get all categories ordered by name
   */
  async listAll(db: Database): Promise<Category[]> {
    const categoriesList = await db.query.categories.findMany({
      orderBy: { name: 'asc' },
    });

    return categoriesList;
  },
};
