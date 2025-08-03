import { JobOffer } from '../../src/models/JobOffer';
import { jobOfferSchemaTest } from './schemas';

export async function setupOffers(count: number) {
  return JobOffer.insertMany(Array.from({ length: count }, () => ({ ...jobOfferSchemaTest })));
}

export async function setupOffersWithUpdatedAt(
  updatedAtDates: Date[] = [new Date('2023-01-01T00:00:00Z'), new Date('2024-01-01T00:00:00Z')]
) {
  const offers = await setupOffers(updatedAtDates.length);

  return await Promise.all(
    offers.map((offer, index) =>
      JobOffer.findByIdAndUpdate(
        offer._id,
        { $set: { updatedAt: updatedAtDates[index] } },
        { new: true, timestamps: false }
      )
    )
  );
}
