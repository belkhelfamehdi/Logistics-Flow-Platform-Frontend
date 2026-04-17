const fallbackApiBaseUrl = 'http://localhost:8090'

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? fallbackApiBaseUrl,
}
