import { BuildFilter, FindJobOfferQuery } from '../types/jobOffer';

export function buildJobOfferFilters(query: FindJobOfferQuery): BuildFilter {
  return {
    ...(query.titleJob && { titleJob: { $regex: query.titleJob, $options: 'i' } }),
    ...(query.employer && { employer: { $regex: query.employer, $options: 'i' } }),
  };
}
