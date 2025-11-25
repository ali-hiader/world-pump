import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { getAdminCookieName } from '@/lib/auth/admin-auth'
import { getUserSessionCookieName } from '@/lib/auth/auth'

export function middleware(req: NextRequest) {
   const { pathname } = req.nextUrl
   const userSession = req.cookies.get(getUserSessionCookieName())
   const adminSession = req.cookies.get(getAdminCookieName())

   // Redirect authenticated users away from auth pages
   if (pathname === '/sign-in' || pathname === '/sign-up') {
      if (userSession?.value) {
         return NextResponse.redirect(new URL('/', req.url))
      }
      return NextResponse.next()
   }

   // Redirect authenticated admins away from login page
   if (pathname === '/admin-log-in') {
      if (adminSession?.value) {
         return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.next()
   }

   // Protect admin routes
   if (pathname.startsWith('/admin')) {
      if (!adminSession?.value) {
         return NextResponse.redirect(new URL('/admin-log-in', req.url))
      }
      return NextResponse.next()
   }

   // Protect user account and checkout routes
   if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
      if (!userSession?.value) {
         const url = new URL('/sign-in', req.url)
         url.searchParams.set('redirect', pathname)
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
      '/admin-log-in',
      '/admin/:path*',
      '/account/:path*',
      '/checkout/:path*',
   ],
}
