import { JobOffer } from '../../src/models/JobOffer';
import { jobOfferSchemaTest } from './schemas';

export const setupOffersWithUpdatedAt = async () => {
  const [offer1, offer2] = await JobOffer.insertMany([
    { ...jobOfferSchemaTest },
    { ...jobOfferSchemaTest },
  ]);

  await JobOffer.findByIdAndUpdate(offer1._id, {
    $set: { updatedAt: new Date('2023-01-01T00:00:00Z') },
  });
  await JobOffer.findByIdAndUpdate(offer2._id, {
    $set: { updatedAt: new Date('2024-01-01T00:00:00Z') },
  });

  return { offer1, offer2 };
};
