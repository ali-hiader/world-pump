import { headers } from 'next/headers'

import { render } from '@react-email/render'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { SESSION } from '@/lib/constants'
import { UnauthorizedError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import * as schema from '@/db/schema'
import PasswordResetSimple from '@/emails/PasswordResetSimple'

import sendMailEdge from '../email/send-mail-edge'

export function getUserSessionCookieName(): string {
   return 'better-auth.session_token'
}

export const auth = betterAuth({
   database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
   }),
   baseURL: process.env.NEXT_PUBLIC_APP_URL || 'https://worldpumps.com.pk/',
   session: {
      expiresIn: SESSION.MAX_AGE.USER,
      updateAge: SESSION.MAX_AGE.USER / 2,
   },
   emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      async sendResetPassword({ user, token }) {
         const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
         const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

         const html = await render(
            PasswordResetSimple({
               customerName: user.name,
               resetUrl,
               expiresAt,
            }),
         )

         await sendMailEdge(user.email, 'Reset your password', html)
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
