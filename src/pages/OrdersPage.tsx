import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getOrders } from '@/shared/api/logisticsApi'
import { formatDateTime, formatNumber } from '@/shared/utils/format'
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
        title="Orders"
        subtitle="Create and manage customer orders."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Panel title="New Order">
          <CreateOrderForm
            onCreated={() => {
              queryClient.invalidateQueries({ queryKey: ['orders'] })
              queryClient.invalidateQueries({ queryKey: ['inventory-reservations'] })
              queryClient.invalidateQueries({ queryKey: ['shipments'] })
            }}
          />
        </Panel>

        <Panel title="Quick Tips">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Field Validation</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">The form automatically validates all information before submission.</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Instant Registration</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">Each order appears in the list immediately after validation.</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Automatic Processing</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">Inventory and shipment are updated automatically.</p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Order List"
        subtitle="All registered orders"
        actions={
          <span className="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] px-2.5 py-1 rounded-lg">
            {formatNumber(ordersQuery.data?.length ?? 0)} orders
          </span>
        }
        noPadding
      >
        {ordersQuery.isLoading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-[var(--color-text-muted)]">Loading orders...</p>
          </div>
        ) : ordersQuery.error ? (
          <div className="p-4 m-4 rounded-lg bg-[var(--color-danger-subtle)] border border-[var(--color-danger)]/30 text-sm text-[var(--color-danger)]">
            Error loading orders: {ordersQuery.error.message}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Order #</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Qty</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {(ordersQuery.data ?? []).map((order, index) => (
                  <tr key={order.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]/50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-[var(--color-primary)]">#{order.id}</td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-primary)]">{order.sku}</td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">{order.quantity}</td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-primary)]">{order.customerName}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        statusTone(order.status) === 'success' ? 'bg-[var(--color-success-subtle)] text-[var(--color-success)]' :
                        statusTone(order.status) === 'warning' ? 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]' :
                        statusTone(order.status) === 'danger' ? 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]' :
                        'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                      }`}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">{formatDateTime(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {ordersQuery.data?.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-sm text-[var(--color-text-muted)]">No orders yet. Create your first order above.</p>
              </div>
            )}
          </div>
        )}
      </Panel>
    </>
  )
}