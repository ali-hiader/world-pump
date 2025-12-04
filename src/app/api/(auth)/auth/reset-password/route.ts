import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { auth } from '@/lib/auth/auth'
import { logger } from '@/lib/logger'
import { checkTypedRateLimit, createRateLimitHeaders, getClientIp } from '@/lib/rate-limit'

const schema = z.object({
   token: z.string().min(10),
   newPassword: z.string().min(8),
})

export async function POST(req: NextRequest) {
   try {
      // Check rate limit
      const clientIp = getClientIp(req.headers)
      const rateLimitResult = checkTypedRateLimit(clientIp, 'password-reset')
      const rateLimitHeaders = createRateLimitHeaders(rateLimitResult, 5)

      if (!rateLimitResult.allowed) {
         return NextResponse.json(
            {
               error: 'Too many password reset attempts. Please try again later.',
            },
            {
               status: 429,
               headers: rateLimitHeaders,
            },
         )
      }

      const body = await req.json()
      const { token, newPassword } = schema.parse(body)

      try {
         const data = await auth.api.resetPassword({
            body: {
               newPassword,
               token,
            },
         })

         logger.info('Auth Password Reset Completed', data)

         return NextResponse.json({ ok: true }, { headers: rateLimitHeaders })
      } catch (innerError) {
         logger.error('Password reset inner error', innerError)
         return NextResponse.json(
            { error: 'Failed to reset password' },
            { status: 500, headers: rateLimitHeaders },
         )
      }
   } catch (error) {
      logger.error('Password reset error', error)

      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: 'Invalid input', details: error.issues },
            { status: 400 },
         )
      }

      return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
   }
}
