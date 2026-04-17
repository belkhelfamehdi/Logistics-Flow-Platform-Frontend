import { useQueries } from '@tanstack/react-query'
import { getOrders, getInventoryReservations, getInventorySnapshot, getShipments } from '@/shared/api/logisticsApi'
import { PageHeader } from '@/shared/ui/PageHeader'
import { OperationalSnapshot } from '@/widgets/dashboard/OperationalSnapshot'

export function DashboardPage() {
  const [ordersQuery, reservationsQuery, shipmentsQuery, inventoryQuery] = useQueries({
    queries: [
      { queryKey: ['orders'], queryFn: getOrders },
      { queryKey: ['inventory-reservations'], queryFn: getInventoryReservations },
      { queryKey: ['shipments'], queryFn: getShipments },
      { queryKey: ['inventory-snapshot'], queryFn: getInventorySnapshot },
    ],
  })

  const isLoading = [ordersQuery, reservationsQuery, shipmentsQuery, inventoryQuery].some(
    (query) => query.isLoading,
  )

  const firstError = [ordersQuery, reservationsQuery, shipmentsQuery, inventoryQuery].find(
    (query) => query.error,
  )

  return (
    <>
      <PageHeader
        title="Vue d'ensemble"
        subtitle="Consultez en un seul endroit les commandes, le stock et les livraisons."
      />

      {firstError?.error ? (
        <section className="panel" style={{ marginBottom: 16 }}>
          <h3>Information</h3>
          <p className="muted">Les donnees ne sont pas disponibles pour le moment. Merci de reessayer.</p>
        </section>
      ) : null}

      {isLoading ? (
        <section className="panel">
          <h3>Chargement des donnees...</h3>
          <p className="muted">Les informations de suivi arrivent dans quelques secondes.</p>
        </section>
      ) : (
        <OperationalSnapshot
          orders={ordersQuery.data ?? []}
          reservations={reservationsQuery.data ?? []}
          shipments={shipmentsQuery.data ?? []}
          inventory={inventoryQuery.data ?? {}}
        />
      )}

      <section className="panel" style={{ marginTop: 16 }}>
        <h3>Parcours d'une commande</h3>
        <div className="timeline">
          <div className="timeline-item">
            <h4>1. Saisie de la commande</h4>
            <p>La commande est enregistree avec les informations du client.</p>
          </div>
          <div className="timeline-item">
            <h4>2. Verification du stock</h4>
            <p>Le systeme verifie la disponibilite des produits et confirme la reservation.</p>
          </div>
          <div className="timeline-item">
            <h4>3. Preparation de la livraison</h4>
            <p>La livraison est preparee ou placee en attente si le stock est insuffisant.</p>
          </div>
        </div>
      </section>
    </>
  )
}
