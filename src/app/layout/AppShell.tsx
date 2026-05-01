import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'

const navItems = {
  admin: [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/orders', label: 'Orders' },
    { to: '/inventory', label: 'Inventory' },
    { to: '/shipments', label: 'Shipments' },
    { to: '/delivery', label: 'Delivery' },
  ],
  operations: [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/orders', label: 'Orders' },
    { to: '/inventory', label: 'Inventory' },
    { to: '/shipments', label: 'Shipments' },
  ],
  delivery: [
    { to: '/delivery', label: 'Delivery', end: true },
    { to: '/shipments', label: 'History' },
  ],
}

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  Orders: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Inventory: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Shipments: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  Delivery: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  History: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

export function AppShell() {
  const auth = useAuth()

  const items = auth.hasRole('ADMIN')
    ? navItems.admin
    : auth.hasRole('OPS')
      ? navItems.operations
      : navItems.delivery

  const roleLabel = auth.hasRole('ADMIN')
    ? 'Administrator'
    : auth.hasRole('OPS')
      ? 'Operations'
      : 'Delivery'

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-base)]">
      <aside className="w-72 bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] p-6 flex flex-col gap-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11h14V7l-7-5zm0 2.5L15 8v8H5V8l5-3.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--color-text-primary)] leading-tight">LogisticsOS</h1>
            <p className="text-xs text-[var(--color-text-muted)]">Control Center</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary-subtle)] border border-[var(--color-primary)]/30 text-xs font-semibold text-[var(--color-primary)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse-glow" />
          API Online
        </div>

        <nav className="flex-1 flex flex-col gap-1" aria-label="Main navigation">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)] border-l-2 border-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                }`
              }
            >
              {iconMap[item.label]}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center text-white font-bold text-sm">
            {auth.user?.displayName?.charAt(0) || auth.user?.username?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              {auth.user?.displayName || auth.user?.username}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">{roleLabel}</p>
          </div>
          <button
            onClick={() => void auth.logout()}
            className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-danger-subtle)] hover:text-[var(--color-danger)] transition-colors"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]/30">
          <h3 className="text-sm font-semibold text-[var(--color-accent)]">How it works</h3>
          <p className="mt-2 text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {auth.hasRole('DELIVERY') && !auth.hasRole('ADMIN', 'OPS')
              ? 'Confirm pickup, complete delivery, then final confirmation.'
              : 'Orders are registered, inventory updated, then shipment prepared.'}
          </p>
        </div>
      </aside>

      <main className="flex-1 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}