import { NextRequest, NextResponse } from 'next/server'

import sendMail from '@/lib/email/send-mail'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
   console.log('📮 [Internal Email API] Request received')
   try {
      const { to, subject, html } = await request.json()
      console.log('📮 [Internal Email API] Parsed request:', {
         to,
         subject: subject.substring(0, 50) + '...',
      })

      if (!to || !subject || !html) {
         console.error('📮 [Internal Email API] Missing required fields')
         return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      console.log('📮 [Internal Email API] Calling sendMail function...')

      const result = await sendMail(to, subject, html)

      console.log('📮 [Internal Email API] sendMail completed:', result)

      return NextResponse.json({
         success: true,
         messageId: result?.id || 'sent',
      })
   } catch (error) {
      console.error('📮 [Internal Email API] Error:', error)
      if (error instanceof Error) {
         console.error('📮 [Internal Email API] Error message:', error.message)
         console.error('📮 [Internal Email API] Error stack:', error.stack)
      }
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
   }
}
