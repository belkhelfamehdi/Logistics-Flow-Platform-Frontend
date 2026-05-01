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
        title="Shipments"
        subtitle="Track shipment progress and identify bottlenecks."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          label="Total"
          value={summary.total}
          variant="default"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          }
        />
        <StatCard
          label="Preparing"
          value={summary.preparing}
          hint="Arranging transport"
          variant="warning"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="In Transit"
          value={summary.inTransit}
          hint="Out for delivery"
          variant="default"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          }
        />
        <StatCard
          label="Delivered"
          value={summary.delivered}
          hint="Confirmed delivery"
          variant="success"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="On Hold"
          value={summary.onHold}
          hint="Awaiting stock"
          variant="danger"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <Panel
        title="All Shipments"
        subtitle="Complete shipment pipeline"
        actions={
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] px-2.5 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
            Auto-refresh
          </span>
        }
        noPadding
      >
        {shipmentsQuery.isLoading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-[var(--color-text-muted)]">Loading shipments...</p>
          </div>
        ) : shipmentsQuery.error ? (
          <div className="p-4 m-4 rounded-lg bg-[var(--color-danger-subtle)] border border-[var(--color-danger)]/30 text-sm text-[var(--color-danger)]">
            {shipmentsQuery.error.message}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Shipment</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Order</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Reservation</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Qty</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Carrier</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {(shipmentsQuery.data ?? []).map((shipment, index) => (
                  <tr key={shipment.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]/50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 20}ms` }}>
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-[var(--color-primary)]">#{shipment.id}</td>
                    <td className="px-5 py-4 text-sm font-mono text-[var(--color-text-secondary)]">#{shipment.orderId}</td>
                    <td className="px-5 py-4 text-sm font-mono text-[var(--color-text-muted)]">#{shipment.reservationId}</td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-primary)]">{shipment.sku}</td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">{shipment.quantity}</td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">{shipment.carrier}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        statusTone(shipment.status) === 'success' ? 'bg-[var(--color-success-subtle)] text-[var(--color-success)]' :
                        statusTone(shipment.status) === 'warning' ? 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]' :
                        statusTone(shipment.status) === 'danger' ? 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]' :
                        'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                      }`}>
                        {statusLabel(shipment.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">{formatDateTime(shipment.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shipmentsQuery.data?.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-sm text-[var(--color-text-muted)]">No shipments yet</p>
              </div>
            )}
          </div>
        )}
      </Panel>
    </>
  )
}