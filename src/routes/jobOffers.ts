import { FastifyInstance } from 'fastify';
import { createJobOffer } from '../controllers/jobOffersController';

export async function jobOfferRoutes(server: FastifyInstance) {
  server.post('/', createJobOffer);
}
