import { FastifyPluginAsync } from 'fastify';
import { findJobOffer, saveJobOffer } from '../controllers/jobOffersController';

export const jobOfferRoutes: FastifyPluginAsync = async (server) => {
  server.post('/save', saveJobOffer);
  server.get('/', findJobOffer);
};
