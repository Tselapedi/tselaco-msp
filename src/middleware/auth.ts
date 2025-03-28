import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AuthService } from '@/services/auth'

export async function withAuth(request: NextRequest, allowedRoles: string[] = []) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { userId, role } = await AuthService.validateToken(token)

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 })
    }

    // Add user info to request context
    request.headers.set('X-User-Id', userId)
    request.headers.set('X-User-Role', role)

    return NextResponse.next()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

export function withDriver(request: NextRequest) {
  return withAuth(request, ['driver'])
}

export function withUser(request: NextRequest) {
  return withAuth(request, ['user'])
}

export function withAdmin(request: NextRequest) {
  return withAuth(request, ['admin'])
}

export function withAny(request: NextRequest) {
  return withAuth(request, ['user', 'driver', 'admin'])
}
