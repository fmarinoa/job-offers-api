import Fastify from 'fastify';
import dotenv from 'dotenv';
import { registerRoutes } from './routes';
import { connectToMongo } from './database/mongo';
import { Logger } from './helpers/logger';

dotenv.config();
const server = Fastify();
const port: number = Number(process.env.PORT) || 3000;

async function start(): Promise<void> {
  await connectToMongo();

  try {
    await registerRoutes(server, {});
    const address = await server.listen({ port, host: '0.0.0.0' });
    Logger.info(`✅ Server running on ${address}`);
  } catch (error) {
    Logger.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

start();
