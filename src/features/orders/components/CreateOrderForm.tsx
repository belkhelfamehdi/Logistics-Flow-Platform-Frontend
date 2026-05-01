import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createOrder } from '@/shared/api/logisticsApi'
import type { OrderRecord } from '@/entities/order/types'

const orderSchema = z.object({
  sku: z.string().trim().min(1, 'Product SKU is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  customerName: z.string().trim().min(2, 'Customer name is required'),
})

type OrderFormValues = z.infer<typeof orderSchema>

interface CreateOrderFormProps {
  onCreated: (order: OrderRecord) => void
}

export function CreateOrderForm({ onCreated }: CreateOrderFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      sku: 'SKU-001',
      quantity: 1,
      customerName: '',
    },
  })

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      reset({ sku: order.sku, quantity: 1, customerName: '' })
      onCreated(order)
    },
  })

  const onSubmit = (values: OrderFormValues) => {
    mutation.mutate(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sku" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Product</label>
          <select
            id="sku"
            {...register('sku')}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-subtle)] transition-all"
          >
            <option value="SKU-001">SKU-001</option>
            <option value="SKU-002">SKU-002</option>
            <option value="SKU-003">SKU-003</option>
          </select>
          {errors.sku && <p className="mt-1.5 text-xs text-[var(--color-danger)]">{errors.sku.message}</p>}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Quantity</label>
          <input
            id="quantity"
            type="number"
            min={1}
            step={1}
            {...register('quantity', { valueAsNumber: true })}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-subtle)] transition-all"
          />
          {errors.quantity && <p className="mt-1.5 text-xs text-[var(--color-danger)]">{errors.quantity.message}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="customerName" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Customer Name</label>
        <input
          id="customerName"
          placeholder="e.g., Global Trade Ltd"
          {...register('customerName')}
          className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-subtle)] transition-all"
        />
        {errors.customerName && <p className="mt-1.5 text-xs text-[var(--color-danger)]">{errors.customerName.message}</p>}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-2.5 px-4 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-primary-glow)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {mutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Order
            </>
          )}
        </button>
        {mutation.error && (
          <p className="mt-3 text-xs text-[var(--color-danger)] text-center p-2 rounded-lg bg-[var(--color-danger-subtle)]">
            {mutation.error.message}
          </p>
        )}
      </div>
    </form>
  )
}