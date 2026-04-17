import axios, { AxiosHeaders } from 'axios'
import { env } from '@/shared/config/env'

export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const csrfUnsafeMethods = new Set(['post', 'put', 'patch', 'delete'])

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  const prefix = `${name}=`
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  if (!match) {
    return null
  }

  return decodeURIComponent(match.slice(prefix.length))
}

http.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase() ?? 'get'
  if (!csrfUnsafeMethods.has(method)) {
    return config
  }

  const token = readCookie('XSRF-TOKEN')
  if (!token) {
    return config
  }

  const headers = AxiosHeaders.from(config.headers)
  if (!headers.has('X-XSRF-TOKEN')) {
    headers.set('X-XSRF-TOKEN', token)
  }

  config.headers = headers

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const serverMessage =
        typeof error.response?.data === 'object' && error.response?.data !== null
          ? String((error.response.data as { message?: string }).message ?? '')
          : ''

      const message = serverMessage || error.message || 'Unexpected API error'
      return Promise.reject(new ApiError(message, status))
    }

    return Promise.reject(new ApiError('Network request failed'))
  },
)
