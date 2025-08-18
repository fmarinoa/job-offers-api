import { FastifyReply, FastifyRequest } from 'fastify';
import { readFileSync } from 'fs';
import { StatusCodes } from 'http-status-codes';
import { join } from 'path';

import { getEnv } from '../helpers/envs';
import { getPathTemplates, replaceTemplateString } from '../helpers/stringUtils';

const { version, name } = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));

export const landingInfo = async (
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<never> => {
  return reply
    .code(StatusCodes.OK)
    .type('text/html')
    .send(
      replaceTemplateString(readFileSync(getPathTemplates('infoServer.html'), 'utf-8'), {
        name,
        version,
      })
    );
};

export const status = async (_request: FastifyRequest, reply: FastifyReply): Promise<never> => {
  return reply.code(StatusCodes.OK).send(
    JSON.parse(
      replaceTemplateString(readFileSync(getPathTemplates('statusServer.json'), 'utf-8'), {
        currentTime: new Date().toISOString(),
        env: getEnv(),
        name,
        uptime: process.uptime().toFixed(0),
        version,
      })
    )
  );
};
