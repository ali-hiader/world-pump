import { NextRequest, NextResponse } from 'next/server'

import jwt from 'jsonwebtoken'

import { AdminTokenPayload } from '@/lib/auth/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AdminTokenPayload

    if (!decoded || !decoded.id) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json(
      {
        authenticated: true,
        admin: { id: decoded.id, role: decoded.role },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
