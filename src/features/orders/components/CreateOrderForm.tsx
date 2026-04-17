import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createOrder } from '@/shared/api/logisticsApi'
import type { OrderRecord } from '@/entities/order/types'

const orderSchema = z.object({
  sku: z.string().trim().min(3, 'La reference produit est requise'),
  quantity: z.number().int().min(1, 'La quantite doit etre au moins 1'),
  customerName: z.string().trim().min(2, 'Le nom du client est requis'),
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
    <form className="form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field">
        <label htmlFor="sku">Produit</label>
        <select id="sku" {...register('sku')}>
          <option value="SKU-001">SKU-001</option>
          <option value="SKU-002">SKU-002</option>
          <option value="SKU-003">SKU-003</option>
        </select>
        {errors.sku ? <span className="error-text">{errors.sku.message}</span> : null}
      </div>

      <div className="field">
        <label htmlFor="quantity">Quantite</label>
        <input id="quantity" type="number" min={1} step={1} {...register('quantity', { valueAsNumber: true })} />
        {errors.quantity ? <span className="error-text">{errors.quantity.message}</span> : null}
      </div>

      <div className="field full">
        <label htmlFor="customerName">Nom du client</label>
        <input id="customerName" placeholder="Ex: Global Trade Ltd" {...register('customerName')} />
        {errors.customerName ? <span className="error-text">{errors.customerName.message}</span> : null}
      </div>

      <div className="field full" style={{ alignItems: 'flex-start' }}>
        <button className="button primary" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Enregistrement...' : 'Enregistrer la commande'}
        </button>
        {mutation.error ? <span className="error-text">{mutation.error.message}</span> : null}
      </div>
    </form>
  )
}
