import { FastifyInstance } from 'fastify';
import { jobOfferRoutes } from './jobOffers';

export async function registerRoutes(server: FastifyInstance) {
  server.register(jobOfferRoutes, { prefix: '/job-offers' });
}
