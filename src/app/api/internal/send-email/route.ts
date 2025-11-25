import { NextRequest, NextResponse } from 'next/server'

import { sendEmail } from '@/lib/email/email-service'
import { logger } from '@/lib/logger'

// Force Node.js runtime for nodemailer compatibility
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
   try {
      const { to, subject, html } = await request.json()

      if (!to || !subject || !html) {
         logger.warn('Internal email API: Missing required fields', {
            hasTo: !!to,
            hasSubject: !!subject,
            hasHtml: !!html,
         })
         return NextResponse.json(
            { error: 'Missing required fields: to, subject, html' },
            { status: 400 },
         )
      }

      const result = await sendEmail({ to, subject, html })

      return NextResponse.json({
         success: true,
         messageId: result?.id,
         message: 'Email sent successfully',
      })
   } catch (error) {
      logger.error('Internal email API failed', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
   }
}
