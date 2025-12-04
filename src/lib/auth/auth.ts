import { headers } from 'next/headers'

import { render } from '@react-email/render'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { SESSION } from '@/lib/constants'
import { UnauthorizedError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import * as schema from '@/db/schema'
import PasswordResetEmail from '@/emails/PasswordReset'

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
      expiresIn: SESSION.MAX_AGE.USER, // 30 days - session expires after this period of inactivity
      updateAge: SESSION.MAX_AGE.USER / 2, // 15 days - session refreshes if used within this window
   },
   emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      async sendResetPassword({ user, url }) {
         const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

         const html = await render(
            PasswordResetEmail({
               customerName: user.name,
               resetUrl: url,
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
      'https://worldpumps.com.pk',
      'https://www.worldpumps.com.pk',
   ],
})

export type Session = typeof auth.$Infer.Session

// Session helpers
export async function userAuth() {
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

export async function isSuperAdmin(email: string) {
   return process.env.SUPER_ADMIN_EMAILS?.split(',').includes(email)
}
