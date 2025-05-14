export const getApiUrl = (endpoint: string) =>
  `${import.meta.env.VITE_API_ORIGIN ?? "http://localhost:3000"}/api/v1/${endpoint}`;
