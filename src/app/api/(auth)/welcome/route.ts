import { NextRequest, NextResponse } from 'next/server'

import { render } from '@react-email/render'

import { sendEmail } from '@/lib/email/email-service'
import { logger } from '@/lib/logger'
import WelcomeEcommerce from '@/emails/WelcomeEcommerce'

export const runtime = 'nodejs'

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
         WelcomeEcommerce({
            customerName: welcomeData.customerName,
            accountUrl,
            discountCode: welcomeData.discountCode || 'WELCOME15',
         }),
      )

      await sendEmail({
         to: welcomeData.customerEmail,
         subject: `Welcome to World Pumps!`,
         html,
      })

      return NextResponse.json({ success: true })
   } catch (error) {
      logger.error('Welcome email error', error)
      return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 })
   }
}
