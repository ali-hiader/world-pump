import { NextRequest, NextResponse } from 'next/server'

import { render } from '@react-email/render'

import { sendEmail } from '@/lib/email/email-service'
import { logger } from '@/lib/logger'
import {
   checkTypedRateLimit as checkRateLimit,
   createRateLimitHeaders,
   getClientIp,
} from '@/lib/rate-limit'
import AbandonedCart from '@/emails/AbandonedCart'

export const runtime = 'nodejs'

interface AbandonedCartData {
   customerName: string
   customerEmail: string
   items: Array<{
      id: string
      name: string
      price: number
      image?: string
   }>
   cartUrl: string
   discountCode?: string
   discountPercent?: number
}

export async function POST(req: NextRequest) {
   try {
      // Rate limiting: 5 requests per 15 minutes per IP
      const ip = getClientIp(req.headers)
      const rateLimit = checkRateLimit(ip, 'email')

      const rateLimitHeaders = createRateLimitHeaders(rateLimit)

      if (!rateLimit.allowed) {
         return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            {
               status: 429,
               headers: rateLimitHeaders,
            },
         )
      }

      const cartData: AbandonedCartData = await req.json()

      // Validate required fields
      if (!cartData.customerEmail || !cartData.customerName) {
         return NextResponse.json(
            { error: 'Customer email and name are required' },
            { status: 400 },
         )
      }

      if (!cartData.items || cartData.items.length === 0) {
         return NextResponse.json({ error: 'Cart items are required' }, { status: 400 })
      }

      const html = await render(AbandonedCart(cartData))

      await sendEmail({
         to: cartData.customerEmail,
         subject: "Don't forget your items!",
         html,
      })

      return NextResponse.json({ success: true })
   } catch (error) {
      logger.error('Abandoned cart email error', error)
      return NextResponse.json({ error: 'Failed to send abandoned cart email' }, { status: 500 })
   }
}
