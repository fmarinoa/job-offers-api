import { FastifyInstance } from 'fastify';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { createServer } from '../src/config';
import { registerRoutes } from '../src/routes';

let mongo: MongoMemoryServer;
let app: FastifyInstance;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  app = createServer();
  await app.register(registerRoutes);
  await app.ready();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();

  await app.close();
});

afterEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if (!collections) return;
  await Promise.all(
    collections.map(async (collection) => {
      await collection.deleteMany({});
    })
  );
});

export const getApp = (): FastifyInstance => app;
