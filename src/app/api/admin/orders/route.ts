import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        discount: true
      }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders error:', error)
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()
    const order = await db.order.update({
      where: { id },
      data: { status }
    })
    return NextResponse.json(order)
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 })
  }
}