export type InventorySnapshot = Record<string, number>

export interface InventoryReservation {
  id: number
  orderId: number
  sku: string
  quantity: number
  status: string
  createdAt: string
}

export interface StockBySkuResponse {
  sku: string
  available: number
}
