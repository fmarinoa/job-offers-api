import dotenv from 'dotenv';

import { startServer } from './config';
import { connectToMongo } from './database/mongo';

dotenv.config();

async function start(): Promise<void> {
  await connectToMongo();
  await startServer();
}

void start();
