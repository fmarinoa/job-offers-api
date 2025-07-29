import { ObjectSchema } from 'joi';
import { FastifyReply, FastifyRequest } from 'fastify';

export function validateBody<T>(
  schema: ObjectSchema<T>,
  request: FastifyRequest,
  reply: FastifyReply
): T | null {
  const { error, value } = schema.validate(request.body);

  if (error) {
    reply.status(400).send({ error: error.details[0].message });
    return null;
  }

  return value;
}
