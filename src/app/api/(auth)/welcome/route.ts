import { NextRequest, NextResponse } from 'next/server'

import { render } from '@react-email/render'

import sendMailEdge from '@/lib/email/send-mail-edge'
import { logger } from '@/lib/logger'
import WelcomeEmail from '@/emails/WelcomeEmail'

interface WelcomeEmailData {
   customerName: string
   customerEmail: string
   accountUrl?: string
   discountCode?: string
}

export async function POST(req: NextRequest) {
   try {
      const welcomeData: WelcomeEmailData = await req.json()

      // Validate required fields
      if (!welcomeData.customerEmail || !welcomeData.customerName) {
         return NextResponse.json(
            { error: 'Customer email and name are required' },
            { status: 400 },
         )
      }

      const accountUrl = welcomeData.accountUrl || `${process.env.NEXT_PUBLIC_APP_URL}/account`

      const html = await render(
         WelcomeEmail({
            customerName: welcomeData.customerName,
            accountUrl,
            discountCode: welcomeData.discountCode || 'WELCOME15',
         }),
      )

      await sendMailEdge(welcomeData.customerEmail, `Welcome to World Pumps!`, html)

      return NextResponse.json({ success: true })
   } catch (error) {
      logger.error('Welcome email error', error)
      return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 })
   }
}
