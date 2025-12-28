import type { Category } from './categories.schemas';
import { Database } from '@craftedtales/db';

export const categoriesQueries = {
  /**
   * List categories
   */
  async list(db: Database): Promise<Category[]> {
    const categoriesList = await db.query.categories.findMany({
      orderBy: { id: 'asc' },
    });

    return categoriesList;
  },
};
