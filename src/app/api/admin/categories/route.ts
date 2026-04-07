import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories error:', error)
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug, description, emoji } = await request.json()
    
    const maxOrder = await db.category.aggregate({
      _max: { order: true }
    })
    
    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        emoji,
        order: (maxOrder._max.order || 0) + 1
      }
    })
    
    return NextResponse.json(category)
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 })
  }
}