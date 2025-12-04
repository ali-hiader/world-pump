import { NextRequest, NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { auth } from '@/lib/auth/auth'
import { logger } from '@/lib/logger'
import { checkTypedRateLimit, createRateLimitHeaders, getClientIp } from '@/lib/rate-limit'
import { db } from '@/db'
import { user } from '@/db/schema'

const schema = z.object({ email: z.email() })

export async function POST(req: NextRequest) {
   try {
      // Check rate limit
      const clientIp = getClientIp(req.headers)
      const rateLimitResult = checkTypedRateLimit(clientIp, 'password-reset')
      const rateLimitHeaders = createRateLimitHeaders(rateLimitResult, 5)

      if (!rateLimitResult.allowed) {
         return NextResponse.json(
            {
               error: 'Too many password reset requests. Please try again later.',
            },
            {
               status: 429,
               headers: rateLimitHeaders,
            },
         )
      }

      const body = await req.json()
      const { email } = schema.parse(body)
      const normalizedEmail = email.trim().toLowerCase()

      const [existingUser] = await db
         .select()
         .from(user)
         .where(eq(user.email, normalizedEmail))
         .limit(1)

      if (!existingUser) {
         // Always return OK to avoid email enumeration
         return NextResponse.json({ ok: true }, { headers: rateLimitHeaders })
      }

      // Use environment variable to prevent Host header injection attacks
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const resetUrl = `${baseUrl}/reset-password`

      const data = await auth.api.requestPasswordReset({
         body: {
            email: normalizedEmail,
            redirectTo: resetUrl,
         },
      })

      logger.info('Auth Password Reset Response', data)

      return NextResponse.json({ ok: true }, { headers: rateLimitHeaders })
   } catch (error) {
      logger.error('Password reset request error', error)

      if (error instanceof z.ZodError) {
         return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
      }

      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
   }
}
