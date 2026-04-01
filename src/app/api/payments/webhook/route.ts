import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let payload: unknown = null

  try {
    payload = await request.json()
  } catch {
    payload = null
  }

  console.log('Mercado Pago webhook received', payload)

  return NextResponse.json({ received: true })
}

export async function GET() {
  return NextResponse.json({ ok: true })
}
