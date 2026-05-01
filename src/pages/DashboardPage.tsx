import { useQueries } from '@tanstack/react-query'
import { getOrders, getInventoryReservations, getInventorySnapshot, getShipments } from '@/shared/api/logisticsApi'
import { PageHeader } from '@/shared/ui/PageHeader'
import { OperationalSnapshot } from '@/widgets/dashboard/OperationalSnapshot'
import { Panel } from '@/shared/ui/Panel'

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
        title="Dashboard"
        subtitle="Overview of orders, inventory, and shipments across all operations."
      />

      {firstError?.error ? (
        <div className="mb-4 p-4 rounded-xl bg-[var(--color-danger-subtle)] border border-[var(--color-danger)]/30">
          <h3 className="text-sm font-semibold text-[var(--color-danger)]">Connection Error</h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Unable to fetch data. Please try again later.</p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] p-8">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[var(--color-text-secondary)]">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <OperationalSnapshot
          orders={ordersQuery.data ?? []}
          reservations={reservationsQuery.data ?? []}
          shipments={shipmentsQuery.data ?? []}
          inventory={inventoryQuery.data ?? {}}
        />
      )}

      <Panel title="Order Workflow" subtitle="How orders move through the system" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-subtle)] flex items-center justify-center">
                <span className="text-sm font-bold text-[var(--color-primary)]">1</span>
              </div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Order Created</h4>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">Customer order is registered with product and delivery details.</p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-warning-subtle)] flex items-center justify-center">
                <span className="text-sm font-bold text-[var(--color-warning)]">2</span>
              </div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Stock Check</h4>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">System verifies product availability and confirms inventory reservation.</p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-success-subtle)] flex items-center justify-center">
                <span className="text-sm font-bold text-[var(--color-success)]">3</span>
              </div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Shipment Ready</h4>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">Shipment is prepared or queued if inventory is insufficient.</p>
          </div>
        </div>
      </Panel>
    </>
  )
}