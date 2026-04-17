export type ShipmentStatus =
  | 'PREPARING'
  | 'ON_HOLD'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELIVERY_FAILED'
  | 'RETURNED'
  | 'CANCELED'

export interface ShipmentRecord {
  id: number
  orderId: number
  reservationId: number
  sku: string
  quantity: number
  status: ShipmentStatus
  carrier: string
  createdAt: string
}
