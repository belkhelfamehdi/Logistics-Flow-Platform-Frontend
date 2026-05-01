import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ShipmentRecord, ShipmentStatus } from '@/entities/shipment/types'
import { getShipments, updateShipmentStatus } from '@/shared/api/logisticsApi'
import { formatDateTime, formatNumber } from '@/shared/utils/format'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Panel } from '@/shared/ui/Panel'
import { StatCard } from '@/shared/ui/StatCard'

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

const statusConfig: Record<ShipmentStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'default'; icon: ReactNode }> = {
  PREPARING: { label: 'Preparing', variant: 'warning', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ON_HOLD: { label: 'On Hold', variant: 'danger', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  OUT_FOR_DELIVERY: { label: 'In Transit', variant: 'default', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg> },
  DELIVERY_FAILED: { label: 'Failed', variant: 'danger', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  RETURNED: { label: 'Returned', variant: 'default', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg> },
  CANCELED: { label: 'Canceled', variant: 'danger', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> },
  DELIVERED: { label: 'Delivered', variant: 'success', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
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

  const summary = useMemo(() => {
    const shipments = shipmentsQuery.data ?? []
    return {
      pending: shipments.filter(s => s.status === 'PREPARING').length,
      inTransit: shipments.filter(s => s.status === 'OUT_FOR_DELIVERY').length,
      completed: shipments.filter(s => s.status === 'DELIVERED').length,
    }
  }, [shipmentsQuery.data])

  const onApplyStatus = (shipmentId: number, status: ShipmentStatus) => {
    mutation.mutate({ shipmentId, status })
  }

  return (
    <>
      <PageHeader
        title="Delivery Platform"
        subtitle="Confirm delivery progress and update status in real-time."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Pending"
          value={summary.pending}
          hint="Awaiting pickup"
          variant="warning"
          icon={statusConfig.PREPARING.icon}
        />
        <StatCard
          label="In Transit"
          value={summary.inTransit}
          hint="Currently delivering"
          variant="default"
          icon={statusConfig.OUT_FOR_DELIVERY.icon}
        />
        <StatCard
          label="Completed"
          value={summary.completed}
          hint="Successfully delivered"
          variant="success"
          icon={statusConfig.DELIVERED.icon}
        />
      </div>

      <Panel
        title="Delivery Actions"
        subtitle="Manage your delivery workflow"
        actions={
          <span className="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] px-2.5 py-1 rounded-lg">
            {formatNumber(shipmentsQuery.data?.length ?? 0)} shipments
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
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {(shipmentsQuery.data ?? []).map((shipment, index) => {
                  const actions = nextStatuses(shipment)
                  const config = statusConfig[shipment.status]

                  return (
                    <tr key={shipment.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]/50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 20}ms` }}>
                      <td className="px-5 py-4 text-sm font-mono font-semibold text-[var(--color-primary)]">#{shipment.id}</td>
                      <td className="px-5 py-4 text-sm font-mono text-[var(--color-text-secondary)]">#{shipment.orderId}</td>
                      <td className="px-5 py-4 text-sm text-[var(--color-text-primary)]">{shipment.sku}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          config.variant === 'success' ? 'bg-[var(--color-success-subtle)] text-[var(--color-success)]' :
                          config.variant === 'warning' ? 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]' :
                          config.variant === 'danger' ? 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]' :
                          'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]'
                        }`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {actions.length === 0 ? (
                          <span className="text-xs text-[var(--color-text-muted)]">No actions</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {actions.map((status) => {
                              const actionConfig = statusConfig[status]
                              return (
                                <button
                                  key={status}
                                  disabled={mutation.isPending}
                                  onClick={() => onApplyStatus(shipment.id, status)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    status === 'DELIVERED' ? 'bg-[var(--color-success)] hover:bg-[#059669)] text-white' :
                                    status === 'DELIVERY_FAILED' ? 'bg-[var(--color-danger)] hover:bg-[#DC2626] text-white' :
                                    'bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] border border-[var(--color-border)]'
                                  }`}
                                >
                                  {actionConfig.label}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">{formatDateTime(shipment.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {shipmentsQuery.data?.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-sm text-[var(--color-text-muted)]">No deliveries assigned</p>
              </div>
            )}
          </div>
        )}
        {mutation.error && (
          <div className="mx-5 mb-5 p-3 rounded-lg bg-[var(--color-danger-subtle)] border border-[var(--color-danger)]/30 text-sm text-[var(--color-danger)]">
            {mutation.error.message}
          </div>
        )}
      </Panel>
    </>
  )
}