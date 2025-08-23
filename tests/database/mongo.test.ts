import mongoose from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('mongoose', () => ({
  default: {
    connect: vi.fn(),
  },
}));

describe('connectToMongo', () => {
  beforeEach(() => {
    vi.resetModules(); // reset module cache between tests
    vi.clearAllMocks();
  });

  it('should throw an error if MONGO_URL is not provided', async () => {
    vi.doMock('../../src/helpers/envs', () => ({
      getMongoUrl: () => undefined,
    }));

    const { connectToMongo } = await import('../../src/database/mongo');

    await expect(connectToMongo()).rejects.toThrow('MongoDB URL must be provided');
  });

  it('should call mongoose.connect with the provided URL', async () => {
    const fakeUrl = 'mongodb://localhost:27017/testdb';

    vi.doMock('../../src/helpers/envs', () => ({
      getMongoUrl: () => fakeUrl,
    }));

    const { connectToMongo } = await import('../../src/database/mongo');

    await connectToMongo();

    expect(mongoose.connect).toHaveBeenCalledWith(fakeUrl);
  });
});
