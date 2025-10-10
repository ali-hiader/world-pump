'use server'

import { cookies } from 'next/headers'

import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

import { adminTable, db } from '@/db'

interface AdminTokenPayload {
  id: number
  role: 'admin' | 'superadmin'
}
export async function checkAuth() {
  try {
    const token = (await cookies()).get('admin_session')?.value

    if (!token) {
      return false
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AdminTokenPayload

    const [admin] = await db.select().from(adminTable).where(eq(adminTable.id, decoded.id))

    if (!admin) {
      return false
    }

    return admin
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
}
