import { FastifyInstance } from 'fastify';

import { findJobOffer, saveJobOffer } from '../controllers/jobOffersController';

export async function jobOfferRoutes(server: FastifyInstance): Promise<void> {
  server.post('/save', saveJobOffer);
  server.get('/', findJobOffer);
}
