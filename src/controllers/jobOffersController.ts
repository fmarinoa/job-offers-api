import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../prisma/client';
import { jobOfferSchema } from '../schemas/jobOfferSchema';
import { validateBody } from '../helpers/validate';

export const createJobOffer = async (request: FastifyRequest, reply: FastifyReply) => {
  const value = validateBody(jobOfferSchema, request, reply);

  try {
    const job = await prisma.jobOffer.create({ data: value });
    return reply.code(201).send(job);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: 'Error saving job offer' });
  }
};
