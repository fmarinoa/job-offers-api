import { FastifyRequest, FastifyReply } from 'fastify';
import { JobOffer } from '../models/JobOffer';
import { jobOfferQuerySchema, jobOfferSchema } from '../schemas/jobOfferSchema';
import { Logger } from '../helpers/logger';
import { buildJobOfferFilters } from '../helpers/buildFilters';

export const saveJobOffer = async (request: FastifyRequest, reply: FastifyReply) => {
  Logger.info('Initiating job offer save process');
  Logger.info('Received request to save job offer:', request.body);
  try {
    const { error, value } = jobOfferSchema.validate(request.body, { abortEarly: false });

    if (error) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }
    Logger.info('Validated job offer data');

    const saved = await new JobOffer(value).save();
    if (!saved) return reply.code(500).send({ error: 'Failed to save job offer' });
    Logger.info('Job offer saved successfully:', saved);

    const id = saved._id.toString();
    if (!id) return reply.code(500).send({ error: 'Failed to retrieve job offer ID' });
    Logger.info(`Job offer saved with ID: ${id}`);

    return reply.code(201).send({
      message: 'Job offer saved successfully',
      id: id,
    });
  } catch (err) {
    return reply.code(500).send({
      error: `Error saving job offer: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
  }
};

export const findJobOffer = async (request: FastifyRequest, reply: FastifyReply) => {
  Logger.info('Initiating find job offer process');
  try {
    const { error, value } = jobOfferQuerySchema.validate(request.query, { abortEarly: false });

    if (error)
      return reply.code(400).send({
        error: 'Invalid query parameters',
        details: error.details.map((d) => d.message),
      });

    const { employer, location, page = 1, limit = 10, sort = 'desc' } = value;
    const skip = (page - 1) * limit;
    const filters = buildJobOfferFilters({ employer, location });

    const offers = await JobOffer.find(filters)
      .sort({ updatedAt: sort === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    if (!offers.length) return reply.code(404).send({ message: 'No job offers found' });

    Logger.info(`Job offers retrieved successfully: ${offers.length}`);
    return reply.code(200).send(offers);
  } catch (err) {
    return reply.code(500).send({
      error: `Error retrieving job offers: ${err instanceof Error ? err.message : 'Unknown error'}`,
    });
  }
};
