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
