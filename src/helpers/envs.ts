export function getMongoUrl(): string {
  return String(process.env.MONGO_URL);
}

export const getPort = (fallback: number): number => {
  return Number(process.env.PORT) || fallback;
};
