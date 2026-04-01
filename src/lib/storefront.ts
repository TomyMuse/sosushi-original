import { discountSeeds, siteConfig, type StorefrontDiscountSeed } from '@/data/storefront'
import type { CartItem, Discount } from '@/store/cart-store'

export interface CheckoutCustomerData {
  customerName: string
  customerPhone: string
  customerAddress: string
  observations: string
  paymentMethod: 'mercadopago' | 'transfer'
}

export interface CheckoutSummary {
  orderId: string
  items: CartItem[]
  subtotal: number
  discountAmount: number
  total: number
  discount: Discount | null
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function validateDiscountCode(code: string, subtotal: number): {
  discount?: Discount
  error?: string
} {
  const normalizedCode = code.trim().toUpperCase()
  const match = discountSeeds.find(
    (discount) => discount.isActive && discount.code === normalizedCode
  )

  if (!match) {
    return { error: 'Codigo invalido.' }
  }

  if (match.minOrder && subtotal < match.minOrder) {
    return {
      error: `Este codigo requiere un pedido minimo de ${formatPrice(match.minOrder)}.`,
    }
  }

  return {
    discount: toCartDiscount(match),
  }
}

export function createOrderReference() {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, '')
    .slice(0, 12)

  return `WA-${stamp}`
}

export function buildOrderWhatsAppMessage(
  customer: CheckoutCustomerData,
  summary: CheckoutSummary
) {
  const paymentLabel =
    customer.paymentMethod === 'mercadopago'
      ? 'Mercado Pago (coordinar por WhatsApp)'
      : 'Transferencia bancaria'

  const lines = [
    `Hola ${siteConfig.brandName}, quiero confirmar este pedido.`,
    '',
    `Pedido: ${summary.orderId}`,
    `Cliente: ${customer.customerName}`,
    `Telefono: ${customer.customerPhone}`,
    `Direccion: ${customer.customerAddress}`,
    `Pago: ${paymentLabel}`,
    '',
    'Detalle:',
    ...summary.items.map((item) => {
      const detail = item.summary ?? `${item.sizeLabel} - ${item.pieces} piezas`
      return `- ${item.productName} - ${detail} x${item.quantity} - ${formatPrice(item.unitPrice * item.quantity)}`
    }),
    '',
    `Subtotal: ${formatPrice(summary.subtotal)}`,
  ]

  if (summary.discount && summary.discountAmount > 0) {
    lines.push(`Descuento ${summary.discount.code}: -${formatPrice(summary.discountAmount)}`)
  }

  lines.push(`Total: ${formatPrice(summary.total)}`)

  if (customer.observations.trim()) {
    lines.push('', `Observaciones: ${customer.observations.trim()}`)
  }

  return lines.join('\n')
}

function toCartDiscount(discount: StorefrontDiscountSeed): Discount {
  return {
    id: discount.code,
    code: discount.code,
    type: discount.type,
    value: discount.value,
    minOrder: discount.minOrder,
  }
}
