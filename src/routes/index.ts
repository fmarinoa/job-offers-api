import { FastifyPluginAsync } from 'fastify';

import { jobOfferRoutes } from './jobOffers';

export const registerRoutes: FastifyPluginAsync = async (server) => {
  server.register(jobOfferRoutes, { prefix: '/job-offers' });
};
