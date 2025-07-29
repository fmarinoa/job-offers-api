import { Logger } from './logger';

export function getMongoUrl(): string {
  const mongoUrl = process.env.MONGO_URL as string;
  if (!mongoUrl) {
    Logger.error('❌ MONGO_URL environment variable is not set.');
    process.exit(1);
  }
  return mongoUrl;
}
