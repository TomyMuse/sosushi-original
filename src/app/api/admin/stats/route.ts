import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [totalProducts, activeProducts, totalCategories, totalOrders, totalRevenue] = await Promise.all([
      db.product.count(),
      db.product.count({ where: { isActive: true } }),
      db.category.count(),
      db.order.count(),
      db.order.aggregate({
        _sum: { total: true }
      })
    ])

    return NextResponse.json({
      totalProducts,
      activeProducts,
      totalCategories,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 })
  }
}