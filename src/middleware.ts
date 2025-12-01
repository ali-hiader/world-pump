import type { NextRequest } from 'next/server'

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { auth, isSuperAdmin } from './lib/auth/auth'
import { logger } from './lib/logger'

export async function middleware(req: NextRequest) {
   const { pathname } = req.nextUrl

   const session = await auth.api.getSession({
      headers: await headers(),
   })

   // Redirect authenticated users away from auth pages
   if (
      pathname === '/sign-in' ||
      pathname === '/sign-up' ||
      pathname === '/forget-password' ||
      pathname === '/reset-password'
   ) {
      if (session?.user) {
         return NextResponse.redirect(new URL('/', req.url))
      }
      return NextResponse.next()
   }

   if (req.nextUrl.pathname.startsWith('/super-admin')) {
      const email = session?.user?.email || ''
      const hasAccess = await isSuperAdmin(email)

      if (!hasAccess) {
         logger.warn('Unauthorized super admin access attempt', {
            userId: session?.user?.id,
            email,
         })
         return NextResponse.redirect(new URL('/', req.url))
      }

      logger.info('Super admin access', {
         userId: session?.user?.id,
         email,
      })

      // Allow access to super admin pages
      return NextResponse.next()
   }

   // Protect user account and checkout routes
   if (
      pathname.startsWith('/account') ||
      pathname.startsWith('/checkout') ||
      pathname.startsWith('/cart')
   ) {
      if (!session?.user) {
         const url = new URL('/sign-in', req.url)
         url.searchParams.set('redirect', pathname)

         logger.warn('Unauthorized access attempt to protected route', { pathname })
         console.log(url)
         return NextResponse.redirect(url)
      }
      return NextResponse.next()
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
   ],
}
