import { http } from '@/shared/api/http'
import type { AuthUser, LoginPayload } from '@/entities/auth/types'

interface CsrfResponse {
  token: string
  headerName: string
  parameterName: string
}

export async function fetchCsrfToken(): Promise<CsrfResponse> {
  const response = await http.get<CsrfResponse>('/auth/csrf')
  return response.data
}

export async function loginWithSession(payload: LoginPayload): Promise<AuthUser> {
  const csrf = await fetchCsrfToken()
  const response = await http.post<AuthUser>('/auth/login', payload, {
    headers: {
      [csrf.headerName]: csrf.token,
    },
  })
  return response.data
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await http.get<AuthUser>('/auth/me')
  return response.data
}

export async function logoutSession(): Promise<void> {
  const csrf = await fetchCsrfToken()
  await http.post('/auth/logout', undefined, {
    headers: {
      [csrf.headerName]: csrf.token,
    },
  })
}