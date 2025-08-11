import mongoose from 'mongoose';

import { getMongoUrl } from '../helpers/envs';

export async function connectToMongo(): Promise<void> {
  await mongoose.connect(getMongoUrl());
}
