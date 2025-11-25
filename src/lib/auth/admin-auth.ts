/**
 * Admin Authentication Module
 * Centralized admin authentication using JWT
 *
 * This provides a separate admin authentication system from Better-Auth
 * For future: Consider migrating to Better-Auth with role-based access
 */

import { cookies } from 'next/headers'

import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

import { logger } from '@/lib/logger'
import { adminTable, db } from '@/db'

export interface AdminTokenPayload {
   id: number
   role: 'admin' | 'superadmin'
   iat?: number
   exp?: number
}

export interface AdminUser {
   id: number
   email: string
   name: string
   role: 'admin' | 'superadmin'
   createdAt: Date | null
   updatedAt: Date | null
}

const ADMIN_COOKIE_NAME = 'admin_session'
const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
   throw new Error('JWT_SECRET environment variable is required for admin authentication')
}

export function getAdminCookieName(): string {
   return ADMIN_COOKIE_NAME
}

export function hasAdminSessionCookie(cookieValue: string | undefined): boolean {
   if (!cookieValue) return false
   const decoded = verifyAdminToken(cookieValue)
   return decoded !== null
}

/**
 * Create JWT token for admin user
 */
export function createAdminToken(admin: { id: number; role: 'admin' | 'superadmin' }): string {
   return jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: '1d' })
}

/**
 * Verify and decode admin JWT token
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
   try {
      const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload
      return decoded
   } catch (error) {
      logger.error('Admin token verification failed', error)
      return null
   }
}

/**
 * Get current admin session (server-side only)
 * Returns admin user if authenticated, null otherwise
 */
export async function getAdminSession(): Promise<AdminUser | null> {
   try {
      const cookieStore = await cookies()
      const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value

      if (!token) {
         return null
      }

      const decoded = verifyAdminToken(token)
      if (!decoded) {
         return null
      }

      const [admin] = await db.select().from(adminTable).where(eq(adminTable.id, decoded.id))

      if (!admin) {
         logger.warn('Admin token valid but user not found', { adminId: decoded.id })
         return null
      }

      return admin
   } catch (error) {
      logger.error('Failed to get admin session', error)
      return null
   }
}

/**
 * Require admin authentication
 * Throws error if not authenticated
 */
export async function requireAdminAuth(): Promise<AdminUser> {
   const admin = await getAdminSession()

   if (!admin) {
      throw new Error('Admin authentication required')
   }

   return admin
}

/**
 * Check if current user is admin (boolean check)
 */
export async function isAdmin(): Promise<boolean> {
   const admin = await getAdminSession()
   return admin !== null
}

/**
 * Set admin session cookie
 */
export async function setAdminSession(admin: {
   id: number
   role: 'admin' | 'superadmin'
}): Promise<void> {
   const token = createAdminToken(admin)
   const cookieStore = await cookies()

   cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
   })

   logger.success('Admin session created', { adminId: admin.id })
}

/**
 * Clear admin session (logout)
 */
export async function clearAdminSession(): Promise<void> {
   const cookieStore = await cookies()
   cookieStore.delete(ADMIN_COOKIE_NAME)
   logger.success('Admin session cleared')
}

/**
 * Validate admin credentials and return admin user if valid
 */
export async function validateAdminCredentials(
   email: string,
   password: string,
): Promise<AdminUser | null> {
   try {
      const bcrypt = await import('bcrypt')

      const [admin] = await db.select().from(adminTable).where(eq(adminTable.email, email))

      if (!admin) {
         // Use constant-time comparison to prevent timing attacks
         await bcrypt.compare(password, '$2b$10$invalidhashtopreventtimingattacks')
         return null
      }

      const valid = await bcrypt.compare(password, admin.password)

      if (!valid) {
         return null
      }

      return admin
   } catch (error) {
      logger.error('Admin credential validation failed', error)
      return null
   }
}
