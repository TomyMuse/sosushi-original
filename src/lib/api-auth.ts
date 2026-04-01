import { NextRequest, NextResponse } from 'next/server'
import { db } from './db'

export async function requireAuth(request: NextRequest): Promise<{ authenticated: true; userId: string } | { authenticated: false; response: NextResponse }> {
  const cookie = request.cookies.get('admin-session')?.value

  if (!cookie) {
    return {
      authenticated: false,
      response: NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
  }

  const [userId] = cookie.split(':')
  if (!userId) {
    return {
      authenticated: false,
      response: NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
    }
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true }
  })

  if (!user) {
    const response = NextResponse.json({ error: 'Sesión expirada' }, { status: 401 })
    response.cookies.delete('admin-session')
    return { authenticated: false, response }
  }

  return { authenticated: true, userId: user.id }
}
