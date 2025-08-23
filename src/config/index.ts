import cors from '@fastify/cors';
import Fastify, { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { getEnv, getPort } from '../helpers/envs';
import { ApplicationError } from '../helpers/errors';
import { registerRoutes } from '../routes';
import { corsOptions, loggerOptions } from './configuration';

export async function startServer(): Promise<void> {
  const server: FastifyInstance = createServer();
  const port: number = getPort();

  try {
    await registerCors(server);
    await registerRoutes(server);

    await server.ready();
    await server.listen({ port, host: '0.0.0.0' });
  } catch (error) {
    server.log.error({ err: error }, 'Error starting server');
  }
}

async function registerCors(server: FastifyInstance): Promise<void> {
  await server.register(cors, {
    origin: corsOptions.origin,
  });
}

export function createServer(): FastifyInstance {
  return Fastify({
    logger: getEnv() !== 'test' && loggerOptions, // if testing environment no logs
    genReqId: () => uuidv4(),
  }).setErrorHandler(
    (
      error: FastifyError | ApplicationError,
      request: FastifyRequest,
      reply: FastifyReply
    ): void => {
      request.log.error(error);

      if (error instanceof ApplicationError) {
        reply.status(error.statusCode).send({
          statusCode: error.statusCode,
          code: error.code,
          message: error.message,
          details: error.details,
        });
      } else {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }
  );
}
