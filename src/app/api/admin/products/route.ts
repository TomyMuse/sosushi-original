import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    
    const products = await db.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: {
          select: { id: true, name: true }
        },
        sizes: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Products error:', error)
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, categoryId, image, isActive, isPopular, sizes } = await request.json()
    
    const maxOrder = await db.product.aggregate({
      _max: { order: true },
      where: { categoryId }
    })
    
    const product = await db.product.create({
      data: {
        name,
        description,
        categoryId,
        image,
        isActive: isActive ?? true,
        isPopular: isPopular ?? false,
        order: (maxOrder._max.order || 0) + 1,
        sizes: {
          create: sizes.map((size: { label: string; pieces: number; price: number }, index: number) => ({
            label: size.label,
            pieces: size.pieces,
            price: size.price,
            order: index
          }))
        }
      },
      include: {
        sizes: true
      }
    })
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Error creating product' }, { status: 500 })
  }
}