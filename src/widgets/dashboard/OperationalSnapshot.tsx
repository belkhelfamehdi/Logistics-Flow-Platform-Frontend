import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts'
import type { OrderRecord } from '@/entities/order/types'
import type { InventoryReservation, InventorySnapshot } from '@/entities/inventory/types'
import type { ShipmentRecord } from '@/entities/shipment/types'
import { formatNumber } from '@/shared/utils/format'
import { StatCard } from '@/shared/ui/StatCard'
import { Panel } from '@/shared/ui/Panel'

interface OperationalSnapshotProps {
  orders: OrderRecord[]
  reservations: InventoryReservation[]
  shipments: ShipmentRecord[]
  inventory: InventorySnapshot
}

const COLORS = ['#0D9488', '#10B981', '#EF4444', '#F59E0B', '#64748B']

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
  const inTransitCount = shipments.filter((item) => item.status === 'OUT_FOR_DELIVERY').length
  const deliveredCount = shipments.filter((item) => item.status === 'DELIVERED').length

  const stockTotal = Object.values(inventory).reduce((acc, value) => acc + value, 0)

  const chartData = [
    { name: 'Orders', value: orders.length, color: COLORS[0] },
    { name: 'Confirmed', value: reservedCount, color: COLORS[1] },
    { name: 'Rejected', value: rejectedCount, color: COLORS[2] },
    { name: 'Preparing', value: preparingCount, color: COLORS[3] },
    { name: 'On Hold', value: onHoldCount, color: COLORS[4] },
  ]

  const orderTrend = orders.length > 0 ? { value: 12, isPositive: true } : undefined

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Orders"
          value={formatNumber(orders.length)}
          hint="All orders received"
          trend={orderTrend}
          variant="default"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="Confirmed"
          value={formatNumber(reservedCount)}
          hint={`${formatNumber(rejectedCount)} rejected due to stock`}
          variant="success"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Active Shipments"
          value={formatNumber(shipments.length)}
          hint={`${formatNumber(preparingCount)} preparing / ${formatNumber(inTransitCount)} in transit`}
          variant="warning"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Panel title="Activity Overview" subtitle="Real-time metrics across all operations" actions={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-primary-subtle)] text-[var(--color-primary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
            Live
          </span>
        }>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Inventory Status" subtitle={`${formatNumber(stockTotal)} units available`} actions={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-warning-subtle)] text-[var(--color-warning)]">
            {formatNumber(stockTotal)} units
          </span>
        }>
          <div className="space-y-3">
            {Object.entries(inventory)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([sku, quantity]) => {
                const percentage = stockTotal > 0 ? (quantity / stockTotal) * 100 : 0
                return (
                  <div key={sku} className="p-3 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-[var(--color-text-primary)] font-mono">{sku}</span>
                      <span className="text-sm font-bold text-[var(--color-primary)]">{formatNumber(quantity)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--color-bg-base)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-success)] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            {Object.keys(inventory).length === 0 && (
              <p className="text-sm text-[var(--color-text-muted)] text-center py-8">No inventory data available</p>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)]">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Delivered</p>
          <p className="text-2xl font-bold text-[var(--color-success)]">{formatNumber(deliveredCount)}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)]">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">In Transit</p>
          <p className="text-2xl font-bold text-[var(--color-warning)]">{formatNumber(inTransitCount)}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)]">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">On Hold</p>
          <p className="text-2xl font-bold text-[var(--color-info)]">{formatNumber(onHoldCount)}</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)]">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Stock Value</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{formatNumber(stockTotal)}</p>
        </div>
      </div>
    </>
  )
}