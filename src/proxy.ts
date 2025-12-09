import type { NextRequest } from 'next/server'

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { auth, isSuperAdmin } from './lib/auth/auth'
import { logger } from './lib/logger'

// Constants
const ALLOWED_ORIGINS = new Set([
   'http://localhost:3000',
   'https://world-pump.vercel.app',
   'https://worldpumps.com.pk',
   'https://www.worldpumps.com.pk',
])

const AUTH_ROUTES = new Set(['/sign-in', '/sign-up', '/forgot-password', '/reset-password'])

const PROTECTED_ROUTE_PREFIXES = ['/account', '/checkout', '/cart']

export async function proxy(req: NextRequest) {
   const { pathname } = req.nextUrl

      const origin = req.headers.get('origin')
      const response = NextResponse.next()

      if (origin && ALLOWED_ORIGINS.has(origin)) {
         response.headers.set('Access-Control-Allow-Origin', origin)
         response.headers.set('Access-Control-Allow-Credentials', 'true')
         response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
         response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      }

   

   // Get session only for routes that need authentication
   const session = await auth.api.getSession({
      headers: await headers(),
   })

   // Redirect authenticated users away from auth pages
   if (AUTH_ROUTES.has(pathname)) {
      if (session?.user) {
         return NextResponse.redirect(new URL('/', req.url))
      }
      return NextResponse.next()
   }

   // Super admin route protection
   if (pathname.startsWith('/super-admin')) {
      if (!session?.user) {
         logger.warn('Unauthenticated super admin access attempt', { pathname })
         return NextResponse.redirect(new URL('/sign-in', req.url))
      }

      const email = session.user.email || ''
      const hasAccess = await isSuperAdmin(email)

      if (!hasAccess) {
         logger.warn('Unauthorized super admin access attempt', {
            userId: session.user.id,
            email,
            pathname,
         })
         return NextResponse.redirect(new URL('/', req.url))
      }

      logger.info('Super admin access granted', {
         userId: session.user.id,
         email,
         pathname,
      })

      return NextResponse.next()
   }

   // Protect user account and checkout routes
   const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))

   if (isProtectedRoute && !session?.user) {
      const url = new URL('/sign-in', req.url)
      url.searchParams.set('redirect', pathname)

      logger.warn('Unauthorized access attempt to protected route', { pathname })
      return NextResponse.redirect(url)
   }

   return NextResponse.next()
}

export const config = {
   matcher: [
      '/sign-in',
      '/sign-up',
      '/super-admin/:path*',
      '/account/:path*',
      '/cart/:path*',
      '/checkout/:path*',
      '/api/:path*',
   ],
}
