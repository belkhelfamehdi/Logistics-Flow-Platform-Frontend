import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'

const demoAccounts = [
  { username: 'admin', password: 'admin123', role: 'Administrator' },
  { username: 'operations', password: 'ops123', role: 'Operations' },
  { username: 'delivery', password: 'delivery123', role: 'Delivery' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const [username, setUsername] = useState('operations')
  const [password, setPassword] = useState('ops123')
  const [error, setError] = useState<string | null>(null)

  const from = location.state && typeof location.state === 'object' && 'from' in location.state
    ? String((location.state as { from?: string }).from ?? '/')
    : '/'

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      await auth.login({ username, password })
      navigate(from, { replace: true })
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : 'Login failed'
      setError(message)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg-base)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
      </div>

      <section className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] mb-4 shadow-lg shadow-[var(--color-primary-glow)]">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11h14V7l-7-5zm0 2.5L15 8v8H5V8l5-3.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">LogisticsOS</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Sign in to your control center</p>
        </div>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Username</label>
            <input
              id="username"
              value={username}
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-subtle)] transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-subtle)] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={auth.isLoading}
            className="w-full py-3 px-4 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-primary-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {auth.isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          {error && (
            <div className="p-3 rounded-lg bg-[var(--color-danger-subtle)] border border-[var(--color-danger)]/30 text-sm text-[var(--color-danger)]">
              {error}
            </div>
          )}
        </form>

        <section className="mt-8 p-5 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)]">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Demo Accounts</h3>
          <div className="space-y-3">
            {demoAccounts.map((account) => (
              <div key={account.username} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-elevated)]">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{account.role}</p>
                  <p className="text-xs text-[var(--color-text-muted)] font-mono">{account.username} / {account.password}</p>
                </div>
                <button
                  onClick={() => { setUsername(account.username); setPassword(account.password); }}
                  className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}