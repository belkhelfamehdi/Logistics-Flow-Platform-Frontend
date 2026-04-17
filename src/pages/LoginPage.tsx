import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'

const demoAccounts = [
  { username: 'admin', password: 'admin123', role: 'Administrateur' },
  { username: 'operations', password: 'ops123', role: 'Operations' },
  { username: 'delivery', password: 'delivery123', role: 'Livreur' },
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
      const message = exception instanceof Error ? exception.message : 'Connexion impossible'
      setError(message)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Espace de pilotage logistique</h1>
        <p>Connectez-vous pour acceder a votre plateforme selon votre role.</p>

        <form onSubmit={submit} className="form-grid" noValidate>
          <div className="field full">
            <label htmlFor="username">Identifiant</label>
            <input
              id="username"
              value={username}
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="field full">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="field full" style={{ alignItems: 'flex-start' }}>
            <button className="button primary" type="submit" disabled={auth.isLoading}>
              {auth.isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
            {error ? <span className="error-text">{error}</span> : null}
          </div>
        </form>

        <section className="auth-help">
          <h3>Comptes de demonstration</h3>
          <div className="timeline">
            {demoAccounts.map((account) => (
              <div key={account.username} className="timeline-item">
                <h4>{account.role}</h4>
                <p>
                  {account.username} / {account.password}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}