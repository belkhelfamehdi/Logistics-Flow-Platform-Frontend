export type StatusTone = 'info' | 'success' | 'warning' | 'danger'

const dangerStatuses = new Set(['REJECTED_NO_STOCK', 'ON_HOLD'])
const successStatuses = new Set(['CREATED', 'RESERVED', 'PREPARING', 'DELIVERED'])
const statusLabels: Record<string, string> = {
  CREATED: 'Enregistree',
  RESERVED: 'Confirmee',
  PREPARING: 'En preparation',
  OUT_FOR_DELIVERY: 'En cours de livraison',
  DELIVERED: 'Livree',
  DELIVERY_FAILED: 'Echec de livraison',
  RETURNED: 'Retournee',
  CANCELED: 'Annulee',
  ON_HOLD: 'En attente',
  REJECTED_NO_STOCK: 'Refusee (stock insuffisant)',
}

export function statusLabel(status: string): string {
  return statusLabels[status] ?? status.replaceAll('_', ' ')
}

export function statusTone(status: string): StatusTone {
  if (dangerStatuses.has(status)) {
    return 'danger'
  }

  if (successStatuses.has(status)) {
    return 'success'
  }

  if (status.includes('PENDING') || status.includes('WAIT')) {
    return 'warning'
  }

  if (status.includes('FAILED') || status.includes('REJECTED') || status.includes('CANCEL')) {
    return 'danger'
  }

  return 'info'
}
