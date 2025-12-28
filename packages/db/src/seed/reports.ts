import { faker } from '@faker-js/faker';
import { Report, schema } from '../schema';
import { batchInsert, logInsert, weightedRandom } from './utils';
import { DrizzleD1 } from '..';

const { reports } = schema;

/**
 * Seed reports table
 */
export async function seedReports(
  db: DrizzleD1,
  modIds: string[],
  userIds: string[],
): Promise<void> {
  console.info('\n🚩 Seeding reports...');

  const reasons = [
    'Inappropriate content',
    'Malicious code detected',
    'Stolen/copied content',
    'Misleading description',
    'Broken download link',
  ];

  const reportData: Report[] = [];

  for (let i = 0; i < 10; i++) {
    const targetType = weightedRandom([
      { weight: 0.8, value: 'mod' as const },
      { weight: 0.2, value: 'user' as const },
    ]);

    const targetId = targetType === 'mod'
      ? modIds[Math.floor(Math.random() * modIds.length)]
      : userIds[Math.floor(Math.random() * userIds.length)];

    const status = weightedRandom([
      { weight: 0.4, value: 'pending' as const },
      { weight: 0.3, value: 'reviewed' as const },
      { weight: 0.2, value: 'resolved' as const },
      { weight: 0.1, value: 'dismissed' as const },
    ]);

    reportData.push({
      id: crypto.randomUUID(),
      reporterId: userIds[Math.floor(Math.random() * userIds.length)],
      targetType,
      targetId,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      description: faker.lorem.sentences(2),
      status,
      resolution: status !== 'pending' && Math.random() > 0.5 ? faker.lorem.sentence() : null,
      reviewedBy: status !== 'pending' && Math.random() > 0.5 ? userIds[Math.floor(Math.random() * userIds.length)] : null,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
    });
  }

  await batchInsert(db, reports, reportData);

  logInsert('reports', reportData.length);
}
