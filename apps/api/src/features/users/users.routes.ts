import type { OpenAPIHono } from '@hono/zod-openapi';
import type { Env, JwtPayload } from '../../env.d';
import { createDb } from '../../utils/db';
import {
  getMeRoute,
  updateMeRoute,
  getUserByUsernameRoute,
  getUserModsRoute,
  userActionRoute,
} from './users.openapi';
import { usersQueries } from './users.queries';
import { modsQueries } from '../mods/mods.queries';
import { PrivateUser, PublicUser, UpdateProfileRequest } from './users.schemas';
import { PaginationQuery,
  UsernameParam } from '../_shared/common.schemas';

/**
 * Register users routes
 */
export const registerUsersRoutes = (app: OpenAPIHono<Env>): void => {
  app.openapi(getMeRoute, async (c) => {
    const db = createDb(c.env);
    const { userId }: JwtPayload = c.get('jwtPayload');

    const user: PrivateUser | null = await usersQueries.findById(db, userId);

    if (!user) {
      return c.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, 404);
    }

    return c.json({ user }, 200);
  });

  app.openapi(updateMeRoute, async (c) => {
    const db = createDb(c.env);
    const { userId }: JwtPayload = c.get('jwtPayload');
    const body: UpdateProfileRequest = c.req.valid('json');

    const updatedUser: PrivateUser | null = await usersQueries.update(db, userId, body);

    if (!updatedUser) {
      return c.json({ error: 'Failed to update profile', code: 'UPDATE_FAILED' }, 500);
    }

    return c.json({ user: updatedUser }, 200);
  });

  app.openapi(getUserByUsernameRoute, async (c) => {
    const db = createDb(c.env);
    const { username }: UsernameParam = c.req.valid('param');

    const user: PublicUser | null = await usersQueries.findByUsername(db, username);

    if (!user) {
      return c.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, 404);
    }

    return c.json({ user }, 200);
  });

  app.openapi(getUserModsRoute, async (c) => {
    const db = createDb(c.env);
    const { username }: UsernameParam = c.req.valid('param');
    const { page, limit }: PaginationQuery = c.req.valid('query');

    // Find user
    const user = await usersQueries.findByUsername(db, username);

    if (!user) {
      return c.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, 404);
    }

    // Get user's mods
    const mods = await modsQueries.listByOwner(db, user.id, { page, limit });

    return c.json(mods, 200);
  });

  app.openapi(userActionRoute, async (c) => {
    const db = createDb(c.env);
    const { userId: adminId }: JwtPayload = c.get('jwtPayload');
    const { id: userId, action } = c.req.valid('param');
    const { reason } = c.req.valid('json');

    // Validate target user exists and is active
    const targetUser: PrivateUser | null = await usersQueries.findById(db, userId);

    if (!targetUser) {
      return c.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, 404);
    }

    // Prevent admin from acting on themselves
    if (targetUser.id === adminId) {
      return c.json({ error: 'Cannot perform action on yourself', code: 'SELF_ACTION' }, 403);
    }

    const enabled: boolean = action === 'unsuspend';

    await usersQueries.setEnabled(db, userId, enabled);

    // TODO Temporary audit log via console; consider persisting later
    if (!enabled) {
      console.info(
        `[AUDIT] User ${userId} suspended by ${adminId}. Reason: ${reason ?? 'No reason provided'}`,
      );

      return c.json({ success: true, message: 'User suspended successfully' }, 200);
    } else {
      console.info(`[AUDIT] User ${userId} unsuspended by ${adminId}`);

      return c.json({ success: true, message: 'User unsuspended successfully' }, 200);
    }
  });
};
