import { Navigate, createBrowserRouter, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { UserRole } from '@/entities/auth/types'
import { AppShell } from '@/app/layout/AppShell'
import { useAuth } from '@/app/providers/AuthProvider'
import { DashboardPage } from '@/pages/DashboardPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { InventoryPage } from '@/pages/InventoryPage'
import { ShipmentsPage } from '@/pages/ShipmentsPage'
import { DeliveryPlatformPage } from '@/pages/DeliveryPlatformPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function AuthLoading() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <h1>Chargement</h1>
        <p>Verification de votre session en cours...</p>
      </section>
    </main>
  )
}

function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const location = useLocation()

  if (auth.isLoading) {
    return <AuthLoading />
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

function RequireRole({ children, roles }: { children: ReactNode; roles: UserRole[] }) {
  const auth = useAuth()

  if (!auth.hasRole(...roles)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function HomePage() {
  const auth = useAuth()
  if (auth.hasRole('DELIVERY') && !auth.hasRole('ADMIN', 'OPS')) {
    return <Navigate to="/delivery" replace />
  }
  return <DashboardPage />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'orders',
        element: (
          <RequireRole roles={['ADMIN', 'OPS']}>
            <OrdersPage />
          </RequireRole>
        ),
      },
      {
        path: 'inventory',
        element: (
          <RequireRole roles={['ADMIN', 'OPS']}>
            <InventoryPage />
          </RequireRole>
        ),
      },
      {
        path: 'shipments',
        element: <ShipmentsPage />,
      },
      {
        path: 'delivery',
        element: (
          <RequireRole roles={['ADMIN', 'DELIVERY']}>
            <DeliveryPlatformPage />
          </RequireRole>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
