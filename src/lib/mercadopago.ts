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

export function ensureMercadoPagoCompatibleUrl(baseUrl: string) {
  const normalized = baseUrl.replace(/\/$/, '')

  if (!/^https:\/\//i.test(normalized)) {
    throw new Error(
      'Mercado Pago requiere una URL publica con HTTPS para back_urls y webhook.'
    )
  }

  if (/localhost|127\.0\.0\.1/i.test(normalized)) {
    throw new Error(
      'Mercado Pago no acepta localhost en back_urls. Configura NEXT_PUBLIC_SITE_URL con tu dominio publico.'
    )
  }

  return normalized
}
