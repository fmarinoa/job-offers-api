import { FastifyRequest, FastifyReply } from 'fastify';
import { JobOffer } from '../models/JobOffer';
import { jobOfferSchema } from '../schemas/jobOfferSchema';
import { Logger } from '../helpers/logger';

export const saveJobOffer = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    Logger.info('Initiating job offer save process');
    Logger.info('Received request to save job offer:', request.body);

    const { error, value } = jobOfferSchema.validate(request.body, { abortEarly: false });

    if (error) {
      const details = error.details.map((d) => d.message);
      return reply.code(400).send({ error: 'Validation failed', details });
    }
    Logger.info('Validated job offer data');

    const saved = await new JobOffer(value).save();
    if (!saved) {
      return reply.code(500).send({ error: 'Failed to save job offer' });
    }
    Logger.info('Job offer saved successfully:', saved);

    const id = saved._id.toString();
    if (!id) {
      return reply.code(500).send({ error: 'Failed to retrieve job offer ID' });
    }
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
