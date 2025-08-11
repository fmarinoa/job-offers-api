import dotenv from 'dotenv';
dotenv.config();

import { getServer, registerCors } from './config';
import { connectToMongo } from './database/mongo';
import { getPort } from './helpers/envs';
import { registerRoutes } from './routes';

const server = getServer();
const port: number = getPort(3000);

async function start(): Promise<void> {
  try {
    await connectToMongo();
    await registerCors(server);
    await registerRoutes(server);

    await server.ready();
    await server.listen({ port, host: '0.0.0.0' });
  } catch (error) {
    server.log.error({ err: error }, 'Error starting server');
    process.exit(1);
  }
}

start();
