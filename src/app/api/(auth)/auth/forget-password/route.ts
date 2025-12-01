import { NextRequest, NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { auth } from '@/lib/auth/auth'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { user } from '@/db/schema'

const schema = z.object({ email: z.email() })

export async function POST(req: NextRequest) {
   try {
      const body = await req.json()
      const { email } = schema.parse(body)
      const normalizedEmail = email.trim().toLowerCase()

      const [existingUser] = await db
         .select()
         .from(user)
         .where(eq(user.email, normalizedEmail))
         .limit(1)

      if (!existingUser) {
         return NextResponse.json({ ok: true }) // Always return OK to avoid email enumeration
      }

      const url = new URL(req.url)
      const base = `${url.protocol}//${url.host}`
      const resetUrl = `${base}/reset-password`

      const data = await auth.api.requestPasswordReset({
         body: {
            email: normalizedEmail,
            redirectTo: resetUrl,
         },
      })

      logger.info('Auth Password Reset Response', data)

      return NextResponse.json({ ok: true })
   } catch (error) {
      logger.error('Password reset request error', error)

      if (error instanceof z.ZodError) {
         return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
      }

      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
   }
}
