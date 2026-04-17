import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { AuthUser, LoginPayload, UserRole } from '@/entities/auth/types'
import { fetchCsrfToken, getCurrentUser, loginWithSession, logoutSession } from '@/shared/api/authApi'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  hasRole: (...roles: UserRole[]) => boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetchCsrfToken()
      const profile = await getCurrentUser()
      setUser(profile)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true)
    try {
      const profile = await loginWithSession(payload)
      setUser(profile)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await logoutSession()
    } finally {
      setUser(null)
      setIsLoading(false)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      hasRole: (...roles: UserRole[]) => roles.some((role) => user?.roles.includes(role) ?? false),
      login,
      logout,
      refreshSession,
    }),
    [isLoading, login, logout, refreshSession, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}