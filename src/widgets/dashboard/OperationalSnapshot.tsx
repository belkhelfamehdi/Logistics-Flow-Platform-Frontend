import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import type { OrderRecord } from '@/entities/order/types'
import type { InventoryReservation, InventorySnapshot } from '@/entities/inventory/types'
import type { ShipmentRecord } from '@/entities/shipment/types'
import { formatNumber } from '@/shared/utils/format'
import { StatCard } from '@/shared/ui/StatCard'

interface OperationalSnapshotProps {
  orders: OrderRecord[]
  reservations: InventoryReservation[]
  shipments: ShipmentRecord[]
  inventory: InventorySnapshot
}

export function OperationalSnapshot({
  orders,
  reservations,
  shipments,
  inventory,
}: OperationalSnapshotProps) {
  const reservedCount = reservations.filter((item) => item.status === 'RESERVED').length
  const rejectedCount = reservations.filter((item) => item.status === 'REJECTED_NO_STOCK').length

  const preparingCount = shipments.filter((item) => item.status === 'PREPARING').length
  const onHoldCount = shipments.filter((item) => item.status === 'ON_HOLD').length

  const stockTotal = Object.values(inventory).reduce((acc, value) => acc + value, 0)

  const chartData = [
    { name: 'Commandes', value: orders.length },
    { name: 'Validees', value: reservedCount },
    { name: 'Refusees', value: rejectedCount },
    { name: 'Preparation', value: preparingCount },
    { name: 'Attente', value: onHoldCount },
  ]

  return (
    <>
      <div className="grid cols-3">
        <StatCard
          label="Commandes enregistrees"
          value={formatNumber(orders.length)}
          hint="Nombre total de commandes recues"
        />
        <StatCard
          label="Commandes confirmees"
          value={formatNumber(reservedCount)}
          hint={`${formatNumber(rejectedCount)} refusees faute de stock`}
        />
        <StatCard
          label="Livraisons en cours"
          value={formatNumber(shipments.length)}
          hint={`${formatNumber(preparingCount)} en preparation / ${formatNumber(onHoldCount)} en attente`}
        />
      </div>

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <section className="panel">
          <div className="toolbar">
            <h3>Activite globale</h3>
            <span className="tag info">Mise a jour en direct</span>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#0a7b83" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <div className="toolbar">
            <h3>Disponibilite du stock</h3>
            <span className="tag warning">{formatNumber(stockTotal)} articles disponibles</span>
          </div>
          <div className="timeline">
            {Object.entries(inventory)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([sku, quantity]) => (
                <div key={sku} className="timeline-item">
                  <h4>{sku}</h4>
                  <p>
                    Stock disponible: <strong>{formatNumber(quantity)}</strong>
                  </p>
                </div>
              ))}
          </div>
        </section>
      </div>
    </>
  )
}
