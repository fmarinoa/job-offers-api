import { FastifyInstance } from 'fastify';
import { saveJobOffer } from '../controllers/jobOffersController';

export async function jobOfferRoutes(server: FastifyInstance) {
  server.post('/save', saveJobOffer);
}
