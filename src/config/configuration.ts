export const corsOptions = {
  origin: ['http://localhost:8080/', 'http://127.0.0.1:8080/'],
};

export const loggerOptions = {
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
};
