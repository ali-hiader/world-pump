import { NextResponse } from 'next/server'

import { z } from 'zod'

import { sendEmail } from '@/lib/emails/mailer'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  subject: z.string().min(1),
  message: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    const { name, email, phone, subject, message } = parsed.data

    const to = process.env.CONTACT_TO || process.env.SMTP_FROM || 'info@worldpumps.com'
    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
        <h2 style="margin:0 0 8px 0;">New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p style="margin-top:12px;"><strong>Subject:</strong> ${subject}</p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `

    await sendEmail({ to, subject: `[Contact] ${subject}`, html })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
