import type { Database } from '../../utils/db';
import type { Category } from './categories.schemas';

export const categoriesQueries = {
  /**
   * List categories
   */
  async list(db: Database): Promise<Category[]> {
    const categoriesList = await db.query.categories.findMany({
      orderBy: { name: 'asc' },
    });

    return categoriesList;
  },
};
