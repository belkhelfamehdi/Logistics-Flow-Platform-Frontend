import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getInventoryReservations, getInventorySnapshot, restockInventory } from '@/shared/api/logisticsApi'
import { formatDateTime, formatNumber } from '@/shared/utils/format'
import { statusLabel, statusTone } from '@/shared/utils/status'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Panel } from '@/shared/ui/Panel'
import { StatCard } from '@/shared/ui/StatCard'

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
    () => Object.entries(snapshotQuery.data ?? {}).sort(([left], [right]) => left.localeCompare(right)),
    [snapshotQuery.data],
  )

  const totalStock = Object.values(snapshotQuery.data ?? {}).reduce((acc, v) => acc + v, 0)
  const reservedCount = (reservationsQuery.data ?? []).filter(r => r.status === 'RESERVED').length

  const submitRestock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate({ sku, quantity })
  }

  return (
    <>
      <PageHeader
        title="Inventory"
        subtitle="Manage stock levels and monitor reservations."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Stock"
          value={formatNumber(totalStock)}
          hint="Units available across all products"
          variant="success"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          label="Active Reservations"
          value={formatNumber(reservedCount)}
          hint="Orders currently reserved"
          variant="warning"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          label="Products"
          value={stockRows.length}
          hint="SKUs tracked"
          variant="default"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Panel title="Restock Inventory">
          <form onSubmit={submitRestock}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="restock-sku" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Product</label>
                <select
                  id="restock-sku"
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-subtle)] transition-all"
                >
                  <option value="SKU-001">SKU-001</option>
                  <option value="SKU-002">SKU-002</option>
                  <option value="SKU-003">SKU-003</option>
                </select>
              </div>
              <div>
                <label htmlFor="restock-quantity" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Quantity</label>
                <input
                  id="restock-quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-subtle)] transition-all"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="py-2.5 px-4 rounded-lg bg-[var(--color-accent)] hover:bg-[#D97706] text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Stock
                  </>
                )}
              </button>
              {mutation.error && (
                <p className="mt-3 text-xs text-[var(--color-danger)] p-2 rounded-lg bg-[var(--color-danger-subtle)]">
                  {mutation.error.message}
                </p>
              )}
            </div>
          </form>
        </Panel>

        <Panel title="Current Availability" subtitle="Real-time stock levels">
          {snapshotQuery.isLoading ? (
            <div className="flex items-center gap-3 p-4">
              <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
            </div>
          ) : snapshotQuery.error ? (
            <p className="text-sm text-[var(--color-danger)]">{snapshotQuery.error.message}</p>
          ) : (
            <div className="space-y-3">
              {stockRows.map(([stockSku, available]) => {
                const percentage = totalStock > 0 ? (available / totalStock) * 100 : 0
                return (
                  <div key={stockSku} className="p-4 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold font-mono text-[var(--color-text-primary)]">{stockSku}</span>
                      <span className="text-lg font-bold text-[var(--color-success)]">{formatNumber(available)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--color-bg-base)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-success)] to-[var(--color-primary)] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              {stockRows.length === 0 && (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-8">No inventory data</p>
              )}
            </div>
          )}
        </Panel>
      </div>

      <Panel
        title="Reservation History"
        subtitle="All inventory reservations"
        actions={
          <span className="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] px-2.5 py-1 rounded-lg">
            {formatNumber(reservationsQuery.data?.length ?? 0)} records
          </span>
        }
        noPadding
      >
        {reservationsQuery.isLoading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
          </div>
        ) : reservationsQuery.error ? (
          <div className="p-4 m-4 rounded-lg bg-[var(--color-danger-subtle)] border border-[var(--color-danger)]/30 text-sm text-[var(--color-danger)]">
            {reservationsQuery.error.message}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Reservation</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Order</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Qty</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {(reservationsQuery.data ?? []).map((reservation) => (
                  <tr key={reservation.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-[var(--color-primary)]">#{reservation.id}</td>
                    <td className="px-5 py-4 text-sm font-mono text-[var(--color-text-secondary)]">#{reservation.orderId}</td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-primary)]">{reservation.sku}</td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">{reservation.quantity}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        statusTone(reservation.status) === 'success' ? 'bg-[var(--color-success-subtle)] text-[var(--color-success)]' :
                        statusTone(reservation.status) === 'warning' ? 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]' :
                        statusTone(reservation.status) === 'danger' ? 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]' :
                        'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                      }`}>
                        {statusLabel(reservation.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">{formatDateTime(reservation.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reservationsQuery.data?.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-sm text-[var(--color-text-muted)]">No reservations yet</p>
              </div>
            )}
          </div>
        )}
      </Panel>
    </>
  )
}