import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getShipments } from '@/shared/api/logisticsApi'
import { formatDateTime } from '@/shared/utils/format'
import { statusLabel, statusTone } from '@/shared/utils/status'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Panel } from '@/shared/ui/Panel'
import { StatCard } from '@/shared/ui/StatCard'

export function ShipmentsPage() {
  const shipmentsQuery = useQuery({ queryKey: ['shipments'], queryFn: getShipments })

  const summary = useMemo(() => {
    const shipments = shipmentsQuery.data ?? []
    return {
      total: shipments.length,
      preparing: shipments.filter((shipment) => shipment.status === 'PREPARING').length,
      inTransit: shipments.filter((shipment) => shipment.status === 'OUT_FOR_DELIVERY').length,
      delivered: shipments.filter((shipment) => shipment.status === 'DELIVERED').length,
      onHold: shipments.filter((shipment) => shipment.status === 'ON_HOLD').length,
    }
  }, [shipmentsQuery.data])

  return (
    <>
      <PageHeader
        title="Livraisons"
        subtitle="Suivez l'avancement des expeditions et reperez les blocages rapidement."
      />

      <div className="grid cols-3" style={{ marginBottom: 16 }}>
        <StatCard label="Total livraisons" value={String(summary.total)} />
        <StatCard label="En preparation" value={String(summary.preparing)} hint="Le transport est en cours d'organisation." />
        <StatCard label="En livraison" value={String(summary.inTransit)} hint="Le livreur est en cours de tournee." />
        <StatCard label="Livrees" value={String(summary.delivered)} hint="La remise est confirmee." />
        <StatCard label="En attente" value={String(summary.onHold)} hint="En attente de disponibilite en stock." />
      </div>

      <Panel title="Liste des livraisons" actions={<span className="muted">Mise a jour automatique</span>}>
        {shipmentsQuery.isLoading ? (
          <p className="muted">Chargement des livraisons...</p>
        ) : shipmentsQuery.error ? (
          <p className="error-text">{shipmentsQuery.error.message}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Numero</th>
                <th>Commande</th>
                <th>Reservation</th>
                <th>Produit</th>
                <th>Quantite</th>
                <th>Transporteur</th>
                <th>Etat</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(shipmentsQuery.data ?? []).map((shipment) => (
                <tr key={shipment.id}>
                  <td>#{shipment.id}</td>
                  <td>#{shipment.orderId}</td>
                  <td>#{shipment.reservationId}</td>
                  <td>{shipment.sku}</td>
                  <td>{shipment.quantity}</td>
                  <td>{shipment.carrier}</td>
                  <td>
                    <span className={`tag ${statusTone(shipment.status)}`}>{statusLabel(shipment.status)}</span>
                  </td>
                  <td>{formatDateTime(shipment.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </>
  )
}
