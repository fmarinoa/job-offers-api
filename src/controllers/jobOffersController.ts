import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';

import { buildJobOfferFilters } from '../helpers/buildFilters';
import {
  GetIdError,
  MissingBodyError,
  SaveOfferError,
  ValidateSchemaError,
} from '../helpers/errors';
import { JobOffer } from '../models/JobOffer';
import { jobOfferQuerySchema, jobOfferSchema } from '../schemas/jobOfferSchema';
import { BuildFilter, FindJobOfferQuery } from '../types/jobOffer';

export const saveJobOffer = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  if (!request.body) throw new MissingBodyError();

  const { error, value } = jobOfferSchema.validate(request.body, { abortEarly: false });

  if (error) throw new ValidateSchemaError(error);

  const saved = await new JobOffer(value).save();
  if (!saved) throw new SaveOfferError([value]);

  const id = saved._id.toString();
  if (!id) throw new GetIdError([saved]);

  return reply.code(StatusCodes.CREATED).send({
    message: 'Job offer saved successfully',
    id: id,
  });
};

export const findJobOffer = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<never> => {
  const { error, value } = jobOfferQuerySchema.validate(request.query, { abortEarly: false });

  if (error) throw new ValidateSchemaError(error);

  const { page, limit, sort } = value as FindJobOfferQuery;
  const skip: number = (page! - 1) * limit!;

  const filters: BuildFilter = buildJobOfferFilters(value);
  request.log.info({ filters }, 'Filters');

  const [offers, total] = await Promise.all([
    JobOffer.find(filters)
      .sort({ updatedAt: sort === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit!),
    JobOffer.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(total / limit!);

  return reply.code(StatusCodes.OK).send({
    total,
    page,
    totalPages,
    results: offers,
  });
};
