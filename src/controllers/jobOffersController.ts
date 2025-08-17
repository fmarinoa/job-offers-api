import { FastifyReply, FastifyRequest } from 'fastify';

import { buildJobOfferFilters } from '../helpers/buildFilters';
import { JobOffer } from '../models/JobOffer';
import { jobOfferQuerySchema, jobOfferSchema } from '../schemas/jobOfferSchema';
import { BuildFilter } from '../types/jobOffer';

export const saveJobOffer = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<never> => {
  try {
    if (!request.body) return reply.code(400).send({ error: 'Job offer data is required' });

    const { error, value } = jobOfferSchema.validate(request.body, { abortEarly: false });

    if (error)
      return reply.code(400).send({
        error: 'Validation failed',
        details: error.details.map((d) => d.message),
      });

    const saved = await new JobOffer(value).save();

    if (!saved) return reply.code(500).send({ error: 'Failed to save job offer' });

    const id = saved._id.toString();

    if (!id) return reply.code(500).send({ error: 'Failed to retrieve job offer ID' });

    return reply.code(201).send({
      message: 'Job offer saved successfully',
      id: id,
    });
  } catch (err) {
    return reply.code(500).send({
      error: 'Error saving job offer',
      details: `${err instanceof Error ? err.message : 'Unknown error'}`,
    });
  }
};

export const findJobOffer = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<never> => {
  try {
    const { error, value } = jobOfferQuerySchema.validate(request.query, { abortEarly: false });

    if (error)
      return reply.code(400).send({
        error: 'Invalid query parameters',
        details: error.details.map((d) => d.message),
      });

    const { titleJob, employer, page = 1, limit = 10, sort = 'desc' } = value;
    const skip = (page - 1) * limit;
    const filters: BuildFilter = buildJobOfferFilters({ titleJob, employer });

    const [offers, total] = await Promise.all([
      JobOffer.find(filters)
        .sort({ updatedAt: sort === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      JobOffer.countDocuments(filters),
    ]);

    const totalPages = Math.ceil(total / limit);

    return reply.code(200).send({
      total,
      page,
      totalPages,
      results: offers,
    });
  } catch (err) {
    return reply.code(500).send({
      error: 'Error retrieving job offers',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
