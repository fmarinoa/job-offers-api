export const getMongoUrl = (): string => String(process.env.MONGO_URL);

export const getPort = (): number => Number(process.env.PORT) || 3000;

export const getEnv = (): string => String(process.env.NODE_ENV);
