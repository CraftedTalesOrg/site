import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import app from '../../src/index';

describe('GET /health', () => {
  it('should return ok status', async () => {
    const res = await app.request('/health', {}, env);

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data).toEqual({ ok: true });
  });
});
