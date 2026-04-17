export interface OrderRecord {
  id: number
  sku: string
  quantity: number
  customerName: string
  status: string
  createdAt: string
}

export interface OrderRequest {
  sku: string
  quantity: number
  customerName: string
}
