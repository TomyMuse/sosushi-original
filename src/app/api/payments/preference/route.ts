import { NextResponse } from 'next/server'
import {
  formatMercadoPagoItemTitle,
  resolveAppBaseUrl,
  type MercadoPagoPreferenceRequest,
} from '@/lib/mercadopago'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    return NextResponse.json(
      {
        error:
          'Mercado Pago no esta configurado todavia. Agrega MERCADOPAGO_ACCESS_TOKEN en tus variables de entorno.',
      },
      { status: 503 }
    )
  }

  let body: MercadoPagoPreferenceRequest

  try {
    body = (await request.json()) as MercadoPagoPreferenceRequest
  } catch {
    return NextResponse.json({ error: 'No se pudo leer el pedido.' }, { status: 400 })
  }

  if (!body.items?.length) {
    return NextResponse.json({ error: 'El carrito esta vacio.' }, { status: 400 })
  }

  const baseUrl = resolveAppBaseUrl(request)

  const preferencePayload = {
    items: body.items.map((item) => ({
      id: item.id,
      title: formatMercadoPagoItemTitle(item),
      description: item.productName,
      quantity: item.quantity,
      currency_id: 'ARS',
      unit_price: item.unitPrice,
    })),
    external_reference: body.orderId,
    statement_descriptor: 'SOSUSHI',
    back_urls: {
      success: `${baseUrl}/checkout/result?status=success`,
      pending: `${baseUrl}/checkout/result?status=pending`,
      failure: `${baseUrl}/checkout/result?status=failure`,
    },
    auto_return: 'approved',
    notification_url: `${baseUrl}/api/payments/webhook`,
    metadata: {
      orderId: body.orderId,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      observations: body.observations ?? '',
      subtotal: body.subtotal,
      discountAmount: body.discountAmount,
      total: body.total,
      discountCode: body.discount?.code ?? '',
    },
  }

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferencePayload),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorText = await response.text()

    return NextResponse.json(
      {
        error: 'Mercado Pago rechazo la preferencia de pago.',
        details: errorText,
      },
      { status: 502 }
    )
  }

  const data = await response.json()

  return NextResponse.json({
    id: data.id,
    initPoint: data.init_point,
    sandboxInitPoint: data.sandbox_init_point,
  })
}
