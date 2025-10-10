import jwt from 'jsonwebtoken'

export interface AdminTokenPayload {
  id: number
  role: 'admin' | 'superadmin'
}

export function createAdminToken(admin: { id: number; role: 'admin' | 'superadmin' }): string {
  return jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  })
}

export async function checkAuth(): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/auth-check`, {
      credentials: 'include',
      cache: 'no-store',
    })
    return res.ok
  } catch (err) {
    console.error('Auth check failed:', err)
    return false
  }
}
