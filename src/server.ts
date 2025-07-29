import Fastify from 'fastify';
import dotenv from 'dotenv';
import { registerRoutes } from './routes';
import { connectToMongo } from './database/mongo';
import { Logger } from './helpers/logger';

dotenv.config();
const server = Fastify();

async function start(): Promise<void> {
  await connectToMongo();

  try {
    await registerRoutes(server);
    await server.listen({ port: 3000 });
    Logger.info('✅ Server running on http://localhost:3000');
  } catch (error) {
    Logger.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

start();
