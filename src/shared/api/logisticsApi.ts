import { http } from '@/shared/api/http'
import type { OrderRecord, OrderRequest } from '@/entities/order/types'
import type {
  InventoryReservation,
  InventorySnapshot,
  StockBySkuResponse,
} from '@/entities/inventory/types'
import type { ShipmentRecord, ShipmentStatus } from '@/entities/shipment/types'

export async function getOrders(): Promise<OrderRecord[]> {
  const response = await http.get<OrderRecord[]>('/orders')
  return response.data
}

export async function createOrder(payload: OrderRequest): Promise<OrderRecord> {
  const response = await http.post<OrderRecord>('/orders', payload)
  return response.data
}

export async function getInventorySnapshot(): Promise<InventorySnapshot> {
  const response = await http.get<InventorySnapshot>('/inventory')
  return response.data
}

export async function getInventoryReservations(): Promise<InventoryReservation[]> {
  const response = await http.get<InventoryReservation[]>('/inventory/reservations')
  return response.data
}

export async function restockInventory(input: {
  sku: string
  quantity: number
}): Promise<StockBySkuResponse> {
  const response = await http.post<StockBySkuResponse>(
    `/inventory/${encodeURIComponent(input.sku)}/restock`,
    undefined,
    {
      params: {
        quantity: input.quantity,
      },
    },
  )

  return response.data
}

export async function getShipments(): Promise<ShipmentRecord[]> {
  const response = await http.get<ShipmentRecord[]>('/shipments')
  return response.data
}

export async function updateShipmentStatus(input: {
  shipmentId: number
  status: ShipmentStatus
}): Promise<ShipmentRecord> {
  const response = await http.patch<ShipmentRecord>(`/shipments/${input.shipmentId}/status`, {
    status: input.status,
  })
  return response.data
}
