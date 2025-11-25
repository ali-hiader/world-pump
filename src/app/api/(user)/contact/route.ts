import { NextResponse } from 'next/server'

import { render } from '@react-email/render'
import { z } from 'zod'

import { apiValidationError } from '@/lib/api/response'
import { sendEmail } from '@/lib/email/email-service'
import { checkTypedRateLimit as checkRateLimit, createRateLimitHeaders, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import ContactConfirmation from '@/emails/ContactConfirmation'
import ContactFormNotification from '@/emails/ContactFormNotification'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  subject: z.string().min(1),
  message: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    // Check rate limit
    const clientIp = getClientIp(req.headers)
    const rateLimitResult = checkRateLimit(clientIp, 'contact')

    const rateLimitHeaders = createRateLimitHeaders(rateLimitResult)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many contact requests. Please try again later.' },
        {
          status: 429,
          headers: rateLimitHeaders,
        },
      )
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      const response = apiValidationError('Invalid input', parsed.error)
      Object.entries(rateLimitHeaders).forEach(([key, value]) => response.headers.set(key, value))
      return response
    }
    const { name, email, phone, subject, message } = parsed.data

    const to = process.env.CONTACT_TO || process.env.SMTP_FROM || 'info@worldpumps.com'

    // Render notification email for admin
    const adminHtml = await render(
      ContactFormNotification({
        name,
        email,
        phone,
        subject,
        message,
        submittedAt: new Date(),
        ipAddress: clientIp,
      }),
    )

    // Send notification to admin
    await sendEmail({ to, subject: `[Contact] ${subject}`, html: adminHtml })

    // Send confirmation email to customer (non-blocking)
    const customerHtml = await render(
      ContactConfirmation({
        customerName: name,
        subject,
      }),
    )

    sendEmail({
      to: email,
      subject: `We received your message - ${subject}`,
      html: customerHtml,
    })
      .then(() => {
        logger.debug('Contact confirmation sent', { email })
      })
      .catch((error) => {
        logger.warn('Failed to send contact confirmation', { error, email })
        // Don't fail the request if confirmation email fails
      })

    return NextResponse.json({ ok: true }, { headers: rateLimitHeaders })
  } catch (err) {
    logger.error('Contact error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
