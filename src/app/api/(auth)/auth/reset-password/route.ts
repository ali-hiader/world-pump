import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { auth } from '@/lib/auth/auth'
import { logger } from '@/lib/logger'

const schema = z.object({
   token: z.string().min(10),
   newPassword: z.string().min(8),
})

export async function POST(req: NextRequest) {
   try {
      const body = await req.json()
      const { token, newPassword } = schema.parse(body)

      logger.info('Password reset request received', { token, newPassword })

      if (!token) {
         return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
      }

      if (newPassword.length < 8) {
         return NextResponse.json(
            { error: 'Password must be at least 8 characters long' },
            { status: 400 },
         )
      }

      try {
         const data = await auth.api.resetPassword({
            body: {
               newPassword,
               token,
            },
         })

         logger.info('Auth Password Reset Completed', data)

         return NextResponse.json({ ok: true })
      } catch (innerError) {
         logger.error('Password reset inner error', innerError)
         return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
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
