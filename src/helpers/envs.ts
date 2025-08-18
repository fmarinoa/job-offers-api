export const getMongoUrl = (): string => String(process.env.MONGO_URL);

export const getPort = (): number => Number(process.env.PORT);

export const getEnv = (): string => String(process.env.NODE_ENV);
