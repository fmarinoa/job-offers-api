import cors from '@fastify/cors';
import Fastify, { FastifyInstance } from 'fastify';

import { corsOptions, loggerOptions } from './configuration';

export async function registerCors(server: FastifyInstance): Promise<void> {
  await server.register(cors, {
    origin: corsOptions.origin,
  });
}

export function getServer(): FastifyInstance {
  return Fastify({ logger: loggerOptions });
}
