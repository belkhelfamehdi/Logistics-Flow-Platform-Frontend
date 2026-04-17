import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ShipmentRecord, ShipmentStatus } from '@/entities/shipment/types'
import { getShipments, updateShipmentStatus } from '@/shared/api/logisticsApi'
import { formatDateTime } from '@/shared/utils/format'
import { statusLabel, statusTone } from '@/shared/utils/status'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Panel } from '@/shared/ui/Panel'

const nextStatusesByCurrent: Record<ShipmentStatus, ShipmentStatus[]> = {
  PREPARING: ['OUT_FOR_DELIVERY'],
  ON_HOLD: [],
  OUT_FOR_DELIVERY: ['DELIVERED', 'DELIVERY_FAILED'],
  DELIVERY_FAILED: ['OUT_FOR_DELIVERY'],
  RETURNED: [],
  CANCELED: [],
  DELIVERED: [],
}

function nextStatuses(shipment: ShipmentRecord): ShipmentStatus[] {
  return nextStatusesByCurrent[shipment.status] ?? []
}

export function DeliveryPlatformPage() {
  const queryClient = useQueryClient()
  const shipmentsQuery = useQuery({ queryKey: ['shipments'], queryFn: getShipments })

  const mutation = useMutation({
    mutationFn: updateShipmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  const onApplyStatus = (shipmentId: number, status: ShipmentStatus) => {
    mutation.mutate({ shipmentId, status })
  }

  return (
    <>
      <PageHeader
        title="Plateforme livreur"
        subtitle="Confirmez l'avancement des livraisons et mettez a jour leur statut en temps reel."
      />

      <Panel title="Actions de livraison" actions={<span className="muted">Equipe terrain</span>}>
        {shipmentsQuery.isLoading ? (
          <p className="muted">Chargement des missions...</p>
        ) : shipmentsQuery.error ? (
          <p className="error-text">{shipmentsQuery.error.message}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Livraison</th>
                <th>Commande</th>
                <th>Produit</th>
                <th>Statut actuel</th>
                <th>Action disponible</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(shipmentsQuery.data ?? []).map((shipment) => {
                const actions = nextStatuses(shipment)

                return (
                  <tr key={shipment.id}>
                    <td>#{shipment.id}</td>
                    <td>#{shipment.orderId}</td>
                    <td>{shipment.sku}</td>
                    <td>
                      <span className={`tag ${statusTone(shipment.status)}`}>
                        {statusLabel(shipment.status)}
                      </span>
                    </td>
                    <td>
                      {actions.length === 0 ? (
                        <span className="muted">Aucune action</span>
                      ) : (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {actions.map((status) => (
                            <button
                              key={status}
                              className="button secondary"
                              disabled={mutation.isPending}
                              type="button"
                              onClick={() => onApplyStatus(shipment.id, status)}
                            >
                              {statusLabel(status)}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>{formatDateTime(shipment.createdAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {mutation.error ? <p className="error-text">{mutation.error.message}</p> : null}
      </Panel>
    </>
  )
}