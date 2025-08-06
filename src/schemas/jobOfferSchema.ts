import Joi from 'joi';

export const jobOfferSchema = Joi.object({
  titleJob: Joi.string().required(),
  employer: Joi.string().required(),
  linkProfileEmployer: Joi.string().uri().required(),
  location: Joi.string().required(),
  howLongAgo: Joi.string().required(),
  recruiter: Joi.string().optional().allow(''),
  profileRecruiter: Joi.string().optional().allow(''),
  descriptionOffer: Joi.string().optional().allow('').max(300),
  linkOffer: Joi.string().uri().required(),
});

export const jobOfferQuerySchema = Joi.object({
  titleJob: Joi.string().optional(),
  employer: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sort: Joi.string().valid('asc', 'desc').optional(),
});
