import { NextRequest, NextResponse } from 'next/server'

import { render } from '@react-email/components'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import sendMailEdge from '@/lib/email/send-mail-edge'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { user } from '@/db/schema'
import { passwordResetTokens } from '@/db/schema'
import PasswordResetSimple from '@/emails/PasswordResetSimple'

const schema = z.object({ email: z.email() })

export async function POST(req: NextRequest) {
   try {
      const body = await req.json()
      const { email } = schema.parse(body)
      const normalizedEmail = email.trim().toLowerCase()

      // Always return OK to avoid email enumeration
      const [existingUser] = await db
         .select()
         .from(user)
         .where(eq(user.email, normalizedEmail))
         .limit(1)
      if (!existingUser) {
         return NextResponse.json({ ok: true })
      }

      // Remove existing tokens for this user
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, existingUser.id))

      const token = crypto.randomUUID().replace(/-/g, '')
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

      await db.insert(passwordResetTokens).values({
         userId: existingUser.id,
         token,
         expiresAt,
      })

      const url = new URL(req.url)
      const base = `${url.protocol}//${url.host}`
      const resetUrl = `${base}/reset-password?token=${encodeURIComponent(token)}`

      const html = await render(
         PasswordResetSimple({
            customerName: existingUser.name,
            resetUrl,
            expiresAt,
         }),
      )
      await sendMailEdge(normalizedEmail, 'Reset your password', html)

      return NextResponse.json({ ok: true })
   } catch (error) {
      logger.error('Password reset request error', error)

      if (error instanceof z.ZodError) {
         return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
      }

      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
   }
}
