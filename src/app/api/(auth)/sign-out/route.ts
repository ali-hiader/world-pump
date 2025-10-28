import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth/auth'

export async function GET() {
   const signOutResponse = await auth.api.signOut({
      headers: await headers(),
      returnHeaders: true,
      asResponse: true,
   })

   const response = NextResponse.json({ success: true }, { status: 200 })

   try {
      signOutResponse.headers.forEach((value, key) => {
         if (key.toLowerCase() === 'set-cookie') {
            response.headers.append('set-cookie', value)
         } else {
            response.headers.set(key, value)
         }
      })
   } catch {
      // ignore — fallback to explicit cookie deletion below
   }

   response.cookies.delete({ name: 'better-auth.session_token', path: '/' })
   console.log('response ---', response, await response.cookies.getAll())
   return response
}
