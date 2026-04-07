import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })
    
    if (!category) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }
    
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching category' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, slug, description, emoji } = await request.json()
    
    const category = await db.category.update({
      where: { id },
      data: { name, slug, description, emoji }
    })
    
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating category' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting category' }, { status: 500 })
  }
}