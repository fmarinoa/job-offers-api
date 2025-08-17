import { FastifyInstance } from 'fastify';

import { landingInfo, status } from '../controllers/healthController';

export async function healthRoutes(server: FastifyInstance): Promise<void> {
  server.get('/', landingInfo);
  server.get('/status', status);
}
