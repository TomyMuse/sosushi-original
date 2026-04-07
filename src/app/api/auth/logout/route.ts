import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get('cookie')
    const sessionCookie = cookie?.match(/admin-session=([^;]+)/)?.[1]

    if (sessionCookie) {
      const [, token] = sessionCookie.split(':')
      if (token) {
        const { db } = await import('@/lib/db')
        await db.session.deleteMany({
          where: { token }
        })
      }
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete('admin-session')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    )
  }
}