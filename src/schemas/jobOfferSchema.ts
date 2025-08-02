import Joi from 'joi';

export const jobOfferSchema = Joi.object({
  titleJob: Joi.string().required(),
  employer: Joi.string().required(),
  linkProfileEmployer: Joi.string().uri().required(),
  location: Joi.string().required(),
  howLongAgo: Joi.string().required(),
  recruiter: Joi.string().allow(''),
  profileRecruiter: Joi.string().allow(''),
  descriptionOffer: Joi.string().required(),
  linkOffer: Joi.string().uri().required(),
});

export const jobOfferQuerySchema = Joi.object({
  employer: Joi.string().optional(),
  location: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sort: Joi.string().valid('asc', 'desc').optional(),
});
