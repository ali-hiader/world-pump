/* eslint-disable simple-import-sort/imports */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
   const { pathname } = req.nextUrl

   if (pathname === '/sign-in' || pathname === '/sign-up') {
      const sessionCookie = req.cookies.get('better-auth.session_token')

      if (sessionCookie && sessionCookie.value) {
         const url = req.nextUrl.clone()
         url.pathname = '/'
         return NextResponse.redirect(url)
      }
   }

   return NextResponse.next()
}

export const config = {
   matcher: ['/sign-in', '/sign-up'],
}
