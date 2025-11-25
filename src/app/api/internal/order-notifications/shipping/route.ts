import { NextRequest, NextResponse } from 'next/server'

import { render } from '@react-email/render'

import { sendEmail } from '@/lib/email/email-service'
import { logger } from '@/lib/logger'
import ShippingNotification from '@/emails/ShippingNotification'

export const runtime = 'nodejs'

interface ShippingNotificationData {
   customerName: string
   customerEmail: string
   orderNumber: string
   trackingNumber: string
   trackingUrl: string
   carrier: string
   estimatedDelivery: Date | string
}

export async function POST(req: NextRequest) {
   try {
      const shippingData: ShippingNotificationData = await req.json()

      // Validate required fields
      if (!shippingData.customerEmail || !shippingData.orderNumber) {
         return NextResponse.json(
            { error: 'Customer email and order number are required' },
            { status: 400 },
         )
      }

      // Convert string date to Date object if needed
      const estimatedDelivery =
         typeof shippingData.estimatedDelivery === 'string'
            ? new Date(shippingData.estimatedDelivery)
            : shippingData.estimatedDelivery

      const html = await render(
         ShippingNotification({
            ...shippingData,
            estimatedDelivery,
         }),
      )

      await sendEmail({
         to: shippingData.customerEmail,
         subject: `Your order #${shippingData.orderNumber} has shipped!`,
         html,
      })

      return NextResponse.json({ success: true })
   } catch (error) {
      logger.error('Shipping notification error', error)
      return NextResponse.json({ error: 'Failed to send shipping notification' }, { status: 500 })
   }
}
