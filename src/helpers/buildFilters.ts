import { BuildFilter, FindJobOfferQuery } from '../types/jobOffer';

export function buildJobOfferFilters(query: FindJobOfferQuery): BuildFilter {
  const filters: BuildFilter = {};

  if (query.titleJob) filters.titleJob = { $regex: query.titleJob, $options: 'i' };

  if (query.employer) filters.employer = { $regex: query.employer, $options: 'i' };

  if (query.days) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - query.days);
    filters.createdAt = { $gte: fromDate };
  }

  return filters;
}
