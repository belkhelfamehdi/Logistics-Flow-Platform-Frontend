import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getInventoryReservations, getInventorySnapshot, restockInventory } from '@/shared/api/logisticsApi'
import { formatDateTime } from '@/shared/utils/format'
import { statusLabel, statusTone } from '@/shared/utils/status'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Panel } from '@/shared/ui/Panel'

export function InventoryPage() {
  const queryClient = useQueryClient()
  const snapshotQuery = useQuery({ queryKey: ['inventory-snapshot'], queryFn: getInventorySnapshot })
  const reservationsQuery = useQuery({
    queryKey: ['inventory-reservations'],
    queryFn: getInventoryReservations,
  })

  const [sku, setSku] = useState('SKU-001')
  const [quantity, setQuantity] = useState(10)

  const mutation = useMutation({
    mutationFn: restockInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-snapshot'] })
    },
  })

  const stockRows = useMemo(
    () =>
      Object.entries(snapshotQuery.data ?? {}).sort(([left], [right]) => left.localeCompare(right)),
    [snapshotQuery.data],
  )

  const submitRestock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate({ sku, quantity })
  }

  return (
    <>
      <PageHeader
        title="Stock"
        subtitle="Consultez les quantites disponibles et ajoutez du stock si besoin."
      />

      <div className="grid cols-2" style={{ marginBottom: 16 }}>
        <Panel title="Ajouter du stock">
          <form className="form-grid" onSubmit={submitRestock}>
            <div className="field">
              <label htmlFor="restock-sku">Produit</label>
              <select id="restock-sku" value={sku} onChange={(event) => setSku(event.target.value)}>
                <option value="SKU-001">SKU-001</option>
                <option value="SKU-002">SKU-002</option>
                <option value="SKU-003">SKU-003</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="restock-quantity">Quantite</label>
              <input
                id="restock-quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </div>

            <div className="field full" style={{ alignItems: 'flex-start' }}>
              <button className="button accent" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'En cours...' : 'Ajouter'}
              </button>
              {mutation.error ? <span className="error-text">{mutation.error.message}</span> : null}
            </div>
          </form>
        </Panel>

        <Panel title="Disponibilite actuelle">
          {snapshotQuery.isLoading ? (
            <p className="muted">Chargement du stock...</p>
          ) : snapshotQuery.error ? (
            <p className="error-text">{snapshotQuery.error.message}</p>
          ) : (
            <div className="timeline">
              {stockRows.map(([stockSku, available]) => (
                <div key={stockSku} className="timeline-item">
                  <h4>{stockSku}</h4>
                  <p>
                    Quantite disponible: <strong>{available}</strong>
                  </p>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <Panel
        title="Historique des reservations"
        actions={<span className="muted">{reservationsQuery.data?.length ?? 0} lignes</span>}
      >
        {reservationsQuery.isLoading ? (
          <p className="muted">Chargement de l'historique...</p>
        ) : reservationsQuery.error ? (
          <p className="error-text">{reservationsQuery.error.message}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Numero reservation</th>
                <th>Numero commande</th>
                <th>Produit</th>
                <th>Quantite</th>
                <th>Etat</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(reservationsQuery.data ?? []).map((reservation) => (
                <tr key={reservation.id}>
                  <td>#{reservation.id}</td>
                  <td>#{reservation.orderId}</td>
                  <td>{reservation.sku}</td>
                  <td>{reservation.quantity}</td>
                  <td>
                    <span className={`tag ${statusTone(reservation.status)}`}>
                      {statusLabel(reservation.status)}
                    </span>
                  </td>
                  <td>{formatDateTime(reservation.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </>
  )
}
