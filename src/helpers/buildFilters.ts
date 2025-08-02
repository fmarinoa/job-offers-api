import { FindJobOfferQuery } from '../types/jobOffer';

export function buildJobOfferFilters(query: FindJobOfferQuery): Record<string, unknown> {
  const filters: Record<string, unknown> = {};

  if (query.employer) {
    filters.employer = { $regex: query.employer, $options: 'i' };
  }

  if (query.location) {
    filters.location = { $regex: query.location, $options: 'i' };
  }

  return filters;
}
