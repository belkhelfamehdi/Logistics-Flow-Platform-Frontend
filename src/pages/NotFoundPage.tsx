import { Link } from 'react-router-dom'
import { PageHeader } from '@/shared/ui/PageHeader'

export function NotFoundPage() {
  return (
    <>
      <PageHeader
        title="Page introuvable"
        subtitle="La page demandee n'existe pas ou n'est plus disponible."
      />
      <section className="panel">
        <p className="muted" style={{ marginBottom: 12 }}>
          Retournez a l'accueil pour continuer le suivi de vos activites.
        </p>
        <Link className="button secondary" to="/">
          Retour a l'accueil
        </Link>
      </section>
    </>
  )
}
