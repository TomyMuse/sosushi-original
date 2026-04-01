import type { CartItem, Discount } from '@/store/cart-store'

export interface MercadoPagoPreferenceRequest {
  orderId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  observations?: string
  items: CartItem[]
  subtotal: number
  discountAmount: number
  total: number
  discount: Discount | null
}

export function formatMercadoPagoItemTitle(item: CartItem) {
  const detail = item.summary ?? `${item.sizeLabel} - ${item.pieces} piezas`
  return `${item.productName} (${detail})`
}

export function resolveAppBaseUrl(request: Request) {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL

  if (configuredUrl) {
    const normalized = configuredUrl.startsWith('http')
      ? configuredUrl
      : `https://${configuredUrl}`

    return normalized.replace(/\/$/, '')
  }

  const forwardedProto = request.headers.get('x-forwarded-proto')
  const forwardedHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host')

  if (forwardedHost) {
    return `${forwardedProto ?? 'https'}://${forwardedHost}`.replace(/\/$/, '')
  }

  return new URL(request.url).origin.replace(/\/$/, '')
}
