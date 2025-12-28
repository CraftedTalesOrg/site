/**
 * Utility functions for seeding
 */

/**
 * Weighted random selection
 */
export function weightedRandom<T>(items: Array<{ weight: number; value: T }>): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * total;

  for (const item of items) {
    random -= item.weight;

    if (random <= 0) {
      return item.value;
    }
  }

  return items[items.length - 1].value;
}

/**
 * Random sample from array
 */
export function sample<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, count);
}

/**
 * D1 has a limit of 100 bound parameters per query.
 * https://developers.cloudflare.com/d1/platform/limits/
 */
const D1_MAX_BOUND_PARAMS = 100;

/**
 * Batch insert helper that chunks data to respect D1's parameter limit
 * Automatically calculates safe batch size based on column count
 */
export async function batchInsert<T extends Record<string, unknown>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any,
  items: T[],
): Promise<void> {
  if (items.length === 0) {
    return;
  }

  // Count columns from the first item
  const columnsPerRow = Object.keys(items[0]).length;

  // Calculate max rows per batch: floor(100 / columnsPerRow)
  // Leave a safety margin by using 95 instead of 100
  const maxRowsPerBatch = Math.max(1, Math.floor((D1_MAX_BOUND_PARAMS - 5) / columnsPerRow));

  // Chunk and insert
  for (let i = 0; i < items.length; i += maxRowsPerBatch) {
    const batch = items.slice(i, i + maxRowsPerBatch);

    await db.insert(table).values(batch);
  }
}

/**
 * Log batch insert with count
 */
export function logInsert(tableName: string, count: number): void {
  console.info(`   ✓ Inserted ${count} ${tableName}`);
}
