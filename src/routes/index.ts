import { FastifyInstance } from 'fastify';

import { jobOfferRoutes } from './jobOffers';

export async function registerRoutes(server: FastifyInstance): Promise<void> {
  await server.register(jobOfferRoutes, { prefix: '/job-offers' });
}
