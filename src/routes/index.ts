import { FastifyInstance } from 'fastify';

import { healthRoutes } from './health';
import { jobOfferRoutes } from './jobOffers';

export async function registerRoutes(server: FastifyInstance): Promise<void> {
  await server.register(jobOfferRoutes, { prefix: '/job-offers' });
  await server.register(healthRoutes);
}
