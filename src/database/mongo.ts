import { getMongoUrl } from '../helpers/envs';
import { Logger } from '../helpers/logger';
import mongoose from 'mongoose';

export async function connectToMongo() {
  try {
    await mongoose.connect(getMongoUrl());
    Logger.info('🚀 You successfully connected to MongoDB!');
  } catch (error) {
    Logger.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
