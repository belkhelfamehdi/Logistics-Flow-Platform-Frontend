import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/logisticsApi'
import { formatDateTime } from '@/shared/utils/format'
import { statusLabel, statusTone } from '@/shared/utils/status'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Panel } from '@/shared/ui/Panel'
import { CreateOrderForm } from '@/features/orders/components/CreateOrderForm'

export function OrdersPage() {
  const queryClient = useQueryClient()
  const ordersQuery = useQuery({ queryKey: ['orders'], queryFn: getOrders })

  return (
    <>
      <PageHeader
        title="Commandes"
        subtitle="Enregistrez les demandes clients et suivez leur avancement."
      />

      <div className="grid cols-2" style={{ marginBottom: 16 }}>
        <Panel title="Nouvelle commande">
          <CreateOrderForm
            onCreated={() => {
              queryClient.invalidateQueries({ queryKey: ['orders'] })
              queryClient.invalidateQueries({ queryKey: ['inventory-reservations'] })
              queryClient.invalidateQueries({ queryKey: ['shipments'] })
            }}
          />
        </Panel>

        <Panel title="Aide rapide">
          <div className="timeline">
            <div className="timeline-item">
              <h4>Verification des champs</h4>
              <p>Le formulaire verifie automatiquement les informations avant envoi.</p>
            </div>
            <div className="timeline-item">
              <h4>Enregistrement immediat</h4>
              <p>Chaque commande apparait dans la liste juste apres validation.</p>
            </div>
            <div className="timeline-item">
              <h4>Suite du traitement</h4>
              <p>Le stock et la livraison sont mis a jour automatiquement ensuite.</p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Liste des commandes"
        actions={<span className="muted">{ordersQuery.data?.length ?? 0} commandes</span>}
      >
        {ordersQuery.isLoading ? (
          <p className="muted">Chargement des commandes...</p>
        ) : ordersQuery.error ? (
          <p className="error-text">{ordersQuery.error.message}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Numero</th>
                <th>Produit</th>
                <th>Quantite</th>
                <th>Client</th>
                <th>Etat</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(ordersQuery.data ?? []).map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.sku}</td>
                  <td>{order.quantity}</td>
                  <td>{order.customerName}</td>
                  <td>
                    <span className={`tag ${statusTone(order.status)}`}>{statusLabel(order.status)}</span>
                  </td>
                  <td>{formatDateTime(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </>
  )
}
