import { model, Schema } from 'mongoose';

import { JobOfferDocument } from '../types/jobOffer';

const jobOfferSchema = new Schema<JobOfferDocument>(
  {
    titleJob: { type: String, required: true },
    employer: { type: String, required: true },
    linkProfileEmployer: { type: String, required: true },
    location: { type: String, required: true },
    howLongAgo: { type: String, required: true },
    recruiter: { type: String },
    profileRecruiter: { type: String },
    descriptionOffer: { type: String, maxlength: 300 },
    linkOffer: { type: String, required: true },
  },
  { timestamps: true }
);

export const JobOffer = model<JobOfferDocument>('JobOffer', jobOfferSchema);
