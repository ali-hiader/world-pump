import { NextRequest, NextResponse } from 'next/server'

import { render } from '@react-email/render'

import { sendEmail } from '@/lib/email/email-service'
import { logger } from '@/lib/logger'
import OrderConfirmation from '@/emails/OrderConfirmation'

export const runtime = 'nodejs'

interface OrderConfirmationData {
   customerName: string
   customerEmail: string
   orderNumber: string
   orderDate: Date | string
   items: Array<{
      id: string
      name: string
      price: number
      quantity: number
      image?: string
   }>
   subtotal: number
   shipping: number
   tax: number
   total: number
   shippingAddress: {
      fullName: string
      addressLine1: string
      addressLine2?: string
      city: string
      state: string
      postalCode: string
      country: string
   }
   trackingUrl?: string
}

export async function POST(req: NextRequest) {
   try {
      const orderData: OrderConfirmationData = await req.json()

      // Validate required fields
      if (!orderData.customerEmail || !orderData.orderNumber) {
         return NextResponse.json(
            { error: 'Customer email and order number are required' },
            { status: 400 },
         )
      }

      // Convert string date to Date object if needed
      const orderDate =
         typeof orderData.orderDate === 'string'
            ? new Date(orderData.orderDate)
            : orderData.orderDate

      const html = await render(
         OrderConfirmation({
            ...orderData,
            orderDate,
         }),
      )

      await sendEmail({
         to: orderData.customerEmail,
         subject: `Order Confirmation #${orderData.orderNumber}`,
         html,
      })

      return NextResponse.json({ success: true })
   } catch (error) {
      logger.error('Order confirmation error', error)
      return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 })
   }
}
