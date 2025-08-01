import { Types, Document } from 'mongoose';

export interface JobOfferInput {
  titleJob: string;
  employer: string;
  linkProfileEmployer: string;
  location: string;
  howLongAgo: string;
  recruiter?: string;
  profileRecruiter?: string;
  descriptionOffer: string;
  linkOffer: string;
}

export interface JobOfferDocument extends JobOfferInput, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type FindJobOfferQuery = {
  employer?: string;
  location?: string;
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
};
