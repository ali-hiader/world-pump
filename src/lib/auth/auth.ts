import { headers } from 'next/headers'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { emailHelpers } from '@/lib/email/helpers'
import { UnauthorizedError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import * as schema from '@/db/schema'

export function getUserSessionCookieName(): string {
   return 'better-auth.session_token'
}

export const auth = betterAuth({
   database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
   }),
   baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
   emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      async sendResetPassword({ user, token }) {
         await emailHelpers.sendPasswordResetEmail(
            {
               name: user.name,
               email: user.email,
            },
            token,
         )
      },
   },
   emailVerification: {
      sendOnSignUp: false,
      autoSignInAfterVerification: true,
   },
   trustedOrigins: [
      'http://localhost:3000',
      'https://world-pump.vercel.app',
      'https://www.worldpumps.com.pk/',
   ],
})

export type Session = typeof auth.$Infer.Session

// Session helpers
export async function requireAuth() {
   try {
      const session = await auth.api.getSession({
         headers: await headers(),
      })

      if (!session) {
         throw new UnauthorizedError('No active session found')
      }

      return session
   } catch (error) {
      logger.error('Session validation failed', error)
      throw new UnauthorizedError('Session validation failed')
   }
}

export async function getOptionalSession() {
   try {
      const session = await auth.api.getSession({
         headers: await headers(),
      })

      return session
   } catch (error) {
      logger.error('Session retrieval failed', error)
      return null
   }
}
