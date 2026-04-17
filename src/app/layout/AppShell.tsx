import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'

const navItems = {
  admin: [
    { to: '/', label: 'Accueil', end: true },
    { to: '/orders', label: 'Commandes' },
    { to: '/inventory', label: 'Stock' },
    { to: '/shipments', label: 'Livraisons' },
    { to: '/delivery', label: 'Plateforme livreur' },
  ],
  operations: [
    { to: '/', label: 'Accueil', end: true },
    { to: '/orders', label: 'Commandes' },
    { to: '/inventory', label: 'Stock' },
    { to: '/shipments', label: 'Livraisons' },
  ],
  delivery: [
    { to: '/delivery', label: 'Plateforme livreur', end: true },
    { to: '/shipments', label: 'Historique des livraisons' },
  ],
}

export function AppShell() {
  const auth = useAuth()

  const items = auth.hasRole('ADMIN')
    ? navItems.admin
    : auth.hasRole('OPS')
      ? navItems.operations
      : navItems.delivery

  const roleLabel = auth.hasRole('ADMIN')
    ? 'Administrateur'
    : auth.hasRole('OPS')
      ? 'Operations'
      : 'Livreur'

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand">
          <h1>Centre de suivi logistique</h1>
          <p>Suivez facilement les commandes, le stock et les livraisons.</p>
        </div>

        <div className="env-badge">
          <span className="dot" />
          Systeme en ligne
        </div>

        <section className="user-badge" aria-label="Session utilisateur">
          <strong>{auth.user?.displayName ?? auth.user?.username}</strong>
          <span>{roleLabel}</span>
          <button className="button secondary" type="button" onClick={() => void auth.logout()}>
            Se deconnecter
          </button>
        </section>

        <nav className="app-nav" aria-label="Navigation principale">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <section className="sidebar-help">
          <h3>Comment ca marche</h3>
          {auth.hasRole('DELIVERY') && !auth.hasRole('ADMIN', 'OPS') ? (
            <p>Confirmez la prise en charge, la livraison puis la confirmation finale.</p>
          ) : (
            <p>Une commande est enregistree, le stock est mis a jour, puis la livraison est preparee.</p>
          )}
        </section>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
