export const getMongoUrl = (fallback?: string): string | undefined => {
  return String(process.env.MONGO_URL) || fallback;
};

export const getPort = (fallback?: number): number | undefined => {
  return Number(process.env.PORT) || fallback;
};

export const getEnv = (fallback?: string): string | undefined => {
  return String(process.env.NODE_ENV) || fallback;
};
