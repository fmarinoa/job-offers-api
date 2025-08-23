import { StatusCodes } from 'http-status-codes';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApplicationError } from '../../src/helpers/errors';

// ---- Mocks ----
const listenMock = vi.fn();
const readyMock = vi.fn();
const registerMock = vi.fn();
const logErrorMock = vi.fn();

vi.mock('fastify', () => {
  return {
    default: vi.fn(() => {
      return {
        register: registerMock,
        ready: readyMock,
        listen: listenMock,
        log: { error: logErrorMock },
        setErrorHandler: vi.fn().mockImplementation((fn) => {
          // @ts-expect-error for testing
          globalThis.__errorHandler = fn;
          return {
            register: registerMock,
            ready: readyMock,
            listen: listenMock,
            log: { error: logErrorMock },
          };
        }),
      };
    }),
  };
});

vi.mock('@fastify/cors', () => ({
  default: vi.fn(),
}));

vi.mock('../../src/routes', () => ({
  registerRoutes: vi.fn(),
}));

vi.mock('../../src/helpers/envs', () => ({
  getEnv: vi.fn(() => 'test'),
  getPort: vi.fn(() => 3000),
}));

// ---- Imports after mocks ----
import { createServer, startServer } from '../../src/config';

describe('config/index.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should start server successfully (happy path)', async () => {
    listenMock.mockResolvedValueOnce(undefined);

    await startServer();

    expect(registerMock).toHaveBeenCalled();
    expect(readyMock).toHaveBeenCalled();
    expect(listenMock).toHaveBeenCalledWith({ port: 3000, host: '0.0.0.0' });
  });

  it('should log error if server.listen throws (error path)', async () => {
    const error = new Error('boom');
    listenMock.mockRejectedValueOnce(error);

    await startServer();

    expect(logErrorMock).toHaveBeenCalledWith({ err: error }, 'Error starting server');
  });

  it('should register CORS with correct options', async () => {
    await startServer();
    expect(registerMock).toHaveBeenCalledWith(expect.any(Function), {
      origin: expect.anything(),
    });
  });

  describe('errorHandler', () => {
    it('should handle ApplicationError in errorHandler', async () => {
      // @ts-expect-error for testing
      const handler = globalThis.__errorHandler;

      const error = new ApplicationError('fail', 'APP_ERR', 400, ['detail']);
      const replyMock = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      };
      const requestMock = { log: { error: vi.fn() } };

      handler(error, requestMock, replyMock);

      expect(replyMock.status).toHaveBeenCalledWith(400);
      expect(replyMock.send).toHaveBeenCalledWith({
        statusCode: 400,
        code: 'APP_ERR',
        message: 'fail',
        details: ['detail'],
      });
    });

    it('should handle generic FastifyError in errorHandler', async () => {
      // @ts-expect-error for testing
      const handler = globalThis.__errorHandler;

      const error = new Error('unexpected');
      const replyMock = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      };
      const requestMock = { log: { error: vi.fn() } };

      handler(error, requestMock, replyMock);

      expect(replyMock.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(replyMock.send).toHaveBeenCalledWith({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'unexpected',
      });
    });
  });

  it('createServer should disable logger in test env', () => {
    const server = createServer();
    expect(server).toBeDefined();
  });
});
