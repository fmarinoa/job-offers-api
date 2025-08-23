import { readFileSync } from 'fs';
import { join } from 'path';
import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { getApp } from '../../setup';

let app: ReturnType<typeof getApp>;

beforeEach(() => {
  app = getApp();
});

describe('GET /status', () => {
  it('Return status info', async () => {
    // CONTEXT
    const { version, name } = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
    );
    const uptime = process.uptime().toFixed(0);

    // REQUEST
    const res = await supertest(app.server).get('/status');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: '👍',
      service: name,
      version: version,
      uptime: `${uptime}s`,
      env: 'test',
      timestamp: expect.any(String),
    });
  });
});
describe('Landing Page (GET /)', () => {
  it('should return landing page info with status 200', async () => {
    const res = await supertest(app.server).get('/');

    // status y headers
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);

    // contenido clave (sin validar todo el HTML)
    expect(res.text).toContain('✅ job-offers-api is running');
    expect(res.text).toContain('Welcome to job-offers-api service');
    expect(res.text).toContain('Version: 1.0.0');
    expect(res.text).toContain('fmarinoa');
  });
});
