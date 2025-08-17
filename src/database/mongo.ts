import mongoose from 'mongoose';

import { getMongoUrl } from '../helpers/envs';

export async function connectToMongo(): Promise<void> {
  const mongoUrl = getMongoUrl();

  if (!mongoUrl) throw new Error('MongoDB URL must be provided');

  await mongoose.connect(mongoUrl);
}
