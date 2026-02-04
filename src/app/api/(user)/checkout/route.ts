import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { render } from '@react-email/render'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { auth } from '@/lib/auth/auth'
import sendMailEdge from '@/lib/email/send-mail-edge'
import { logger } from '@/lib/logger'
import { checkTypedRateLimit, createRateLimitHeaders, getClientIp } from '@/lib/rate-limit'
import { db } from '@/db'
import {
   addressTable,
   orderItemTable,
   orderTable,
   paymentTable,
   user as userTable,
} from '@/db/schema'
import OrderConfirmation, {
   OrderConfirmationEmailProps,
   OrderItem,
   ShippingAddress,
} from '@/emails/OrderConfirmation'

const addressSchema = z.object({
   fullName: z.string().min(1),
   phone: z.string().min(1),
   addressLine1: z.string().min(1),
   addressLine2: z.string().optional().nullable(),
   city: z.string().min(1),
   state: z.string().optional().nullable(),
   postalCode: z.string().optional().nullable(),
   country: z.string().min(1),
})

const bodySchema = z.object({
   products: z
      .array(
         z.object({
            id: z.string().min(1),
            title: z.string(),
            imageUrl: z.string().optional(),
            price: z.number().nonnegative(),
            quantity: z.number().int().positive(),
         }),
      )
      .min(1),
   addresses: z
      .object({
         shipping: addressSchema,
         billingSameAsShipping: z.boolean(),
         billing: addressSchema.optional(),
      })
      .optional(),
   paymentMethod: z.enum(['cod', 'bank']).default('cod'),
})

function makeOrderNumber() {
   const now = new Date()
   return `ORD-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(
      Math.random() * 1_000_000,
   )
      .toString()
      .padStart(6, '0')}`
}

export async function POST(req: NextRequest) {
   try {
      // Check rate limit
      const clientIp = getClientIp(req.headers)
      const rateLimitResult = checkTypedRateLimit(clientIp, 'checkout')

      const rateLimitHeaders = createRateLimitHeaders(rateLimitResult, 20)

      if (!rateLimitResult.allowed) {
         return NextResponse.json(
            { error: 'Too many checkout attempts. Please try again later.' },
            {
               status: 429,
               headers: rateLimitHeaders,
            },
         )
      }

      const raw = await req.json()
      const parse = bodySchema.safeParse(raw)
      if (!parse.success) {
         return NextResponse.json(
            { error: 'Invalid payload', details: parse.error.flatten() },
            {
               status: 400,
               headers: rateLimitHeaders,
            },
         )
      }

      const { products, addresses, paymentMethod } = parse.data

      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) {
         return NextResponse.json(
            { error: 'Unauthorized' },
            {
               status: 401,
               headers: rateLimitHeaders,
            },
         )
      }

      const userId = session.user.id
      const u = await db
         .select({ email: userTable.email })
         .from(userTable)
         .where(eq(userTable.id, userId))
         .limit(1)
      const userEmail = u[0]?.email ?? ''

      // compute totals (integer prices assumed in PKR)
      const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

      // Insert addresses
      let shippingAddressId: string | null = null
      let billingAddressId: string | null = null

      if (addresses) {
         const shippingInsert = await db
            .insert(addressTable)
            .values({
               userId,
               type: 'shipping',
               fullName: addresses.shipping.fullName,
               phone: addresses.shipping.phone,
               addressLine1: addresses.shipping.addressLine1,
               addressLine2: addresses.shipping.addressLine2 ?? null,
               city: addresses.shipping.city,
               state: addresses.shipping.state ?? null,
               postalCode: addresses.shipping.postalCode ?? null,
               country: addresses.shipping.country,
               isDefault: false,
            })
            .returning({ id: addressTable.id })
         shippingAddressId = shippingInsert[0]?.id ?? null

         if (addresses.billingSameAsShipping) {
            billingAddressId = shippingAddressId
         } else if (addresses.billing) {
            const billingInsert = await db
               .insert(addressTable)
               .values({
                  userId,
                  type: 'billing',
                  fullName: addresses.billing.fullName,
                  phone: addresses.billing.phone,
                  addressLine1: addresses.billing.addressLine1,
                  addressLine2: addresses.billing.addressLine2 ?? null,
                  city: addresses.billing.city,
                  state: addresses.billing.state ?? null,
                  postalCode: addresses.billing.postalCode ?? null,
                  country: addresses.billing.country,
                  isDefault: false,
               })
               .returning({ id: addressTable.id })
            billingAddressId = billingInsert[0]?.id ?? null
         }
      }

      // Create order
      const orderNumber = makeOrderNumber()
      const orderInsert = await db
         .insert(orderTable)
         .values({
            orderNumber,
            userId,
            userEmail,
            shippingAddressId: shippingAddressId ?? null,
            billingAddressId: billingAddressId ?? null,
            totalAmount,
         })
         .returning({ id: orderTable.id })
      const orderId = orderInsert[0]?.id
      if (!orderId) {
         return NextResponse.json(
            { error: 'Failed to create order' },
            {
               status: 500,
               headers: rateLimitHeaders,
            },
         )
      }

      // Order items
      if (products.length > 0) {
         await db.insert(orderItemTable).values(
            products.map((p) => ({
               orderId,
               productId: p.id,
               productName: p.title,
               quantity: p.quantity,
               unitPrice: p.price,
            })),
         )
      }

      await db.insert(paymentTable).values({
         orderId,
         method: paymentMethod,
         amount: totalAmount,
         // status: pending by default
      })

      // Send order confirmation email for COD orders (non-blocking)
      if (paymentMethod === 'cod') {
         // Fetch complete order data for email
         const shippingAddr = shippingAddressId
            ? await db
                 .select()
                 .from(addressTable)
                 .where(eq(addressTable.id, shippingAddressId))
                 .limit(1)
            : []

         const orderData: OrderConfirmationEmailProps & { customerEmail: string } = {
            customerName: addresses?.shipping.fullName || session.user.name || 'Customer',
            customerEmail: userEmail,
            orderNumber,
            orderDate: new Date(),
            items: products.map(
               (p): OrderItem => ({
                  id: p.id.toString(),
                  name: p.title,
                  price: p.price,
                  quantity: p.quantity,
                  image: p.imageUrl,
               }),
            ),
            subtotal: totalAmount,
            shipping: 0,
            tax: 0,
            total: totalAmount,
            shippingAddress: shippingAddr[0]
               ? ({
                    fullName: shippingAddr[0].fullName,
                    addressLine1: shippingAddr[0].addressLine1,
                    addressLine2: shippingAddr[0].addressLine2 || undefined,
                    city: shippingAddr[0].city,
                    state: shippingAddr[0].state || '',
                    postalCode: shippingAddr[0].postalCode || '',
                    country: shippingAddr[0].country,
                 } as ShippingAddress)
               : ({
                    fullName: addresses?.shipping.fullName || '',
                    addressLine1: addresses?.shipping.addressLine1 || '',
                    addressLine2: addresses?.shipping.addressLine2 || undefined,
                    city: addresses?.shipping.city || '',
                    state: addresses?.shipping.state || '',
                    postalCode: addresses?.shipping.postalCode || '',
                    country: addresses?.shipping.country || '',
                 } as ShippingAddress),
         }

         try {
            const html = await render(OrderConfirmation(orderData))
            await sendMailEdge(
               orderData.customerEmail,
               `Order Confirmation #${orderData.orderNumber}`,
               html,
            )
            logger.debug('Order confirmation email sent', { orderNumber })
         } catch (error) {
            logger.warn('Failed to send order confirmation email', { error, orderNumber })
         }
      }

      return NextResponse.json({ orderId, status: 'pending' }, { headers: rateLimitHeaders })
   } catch (error) {
      logger.error('Error handling checkout', error)
      return NextResponse.json({ error: 'Error processing checkout' }, { status: 500 })
   }
}
