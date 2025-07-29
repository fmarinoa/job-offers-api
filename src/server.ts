import Fastify from 'fastify';
import { registerRoutes } from './routes';

const server = Fastify();

const start = async () => {
  try {
    await registerRoutes(server);
    await server.listen({ port: 3000 });
    console.log('✅ Server running on http://localhost:3000');
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

start();
