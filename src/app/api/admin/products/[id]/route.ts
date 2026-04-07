import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        sizes: { orderBy: { order: 'asc' } }
      }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching product' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, description, categoryId, image, isActive, isPopular, sizes } = await request.json()
    
    await db.productSize.deleteMany({ where: { productId: id } })
    
    const product = await db.product.update({
      where: { id },
      data: {
        name,
        description,
        categoryId,
        image,
        isActive,
        isPopular,
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
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Error updating product' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting product' }, { status: 500 })
  }
}