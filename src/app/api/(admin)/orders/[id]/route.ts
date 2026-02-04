import { NextRequest, NextResponse } from 'next/server'

import { render } from '@react-email/render'
import { eq } from 'drizzle-orm'

import { auth, isSuperAdmin } from '@/lib/auth/auth'
import sendMailEdge from '@/lib/email/send-mail-edge'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { addressTable, orderItemTable, orderTable, pumpTable, user } from '@/db/schema'
import OrderConfirmation, {
   OrderConfirmationEmailProps,
   OrderItem,
   ShippingAddress,
} from '@/emails/OrderConfirmation'
import ShippingNotification from '@/emails/ShippingNotification'

interface Props {
   params: Promise<{
      id: string
   }>
}

export async function GET(request: NextRequest, { params }: Props) {
   try {
      const resolvedParams = await params
      const orderId = resolvedParams.id

      if (!orderId) {
         return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 })
      }

      // Fetch order details
      const [order] = await db
         .select({
            id: orderTable.id,
            userEmail: orderTable.userEmail,
            userName: user.name,
            status: orderTable.status,
            paymentStatus: orderTable.paymentStatus,
            totalAmount: orderTable.totalAmount,
            createdAt: orderTable.createdAt,
            updatedAt: orderTable.updatedAt,
            shippingAddressId: orderTable.shippingAddressId,
            billingAddressId: orderTable.billingAddressId,
         })
         .from(orderTable)
         .leftJoin(user, eq(user.email, orderTable.userEmail))
         .where(eq(orderTable.id, orderId))
         .limit(1)

      if (!order) {
         return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Fetch order items with product details
      const orderItems = await db
         .select({
            id: orderItemTable.id,
            quantity: orderItemTable.quantity,
            unitPrice: orderItemTable.unitPrice,
            productTitle: pumpTable.title,
            productSlug: pumpTable.slug,
            productImage: pumpTable.imageUrl,
         })
         .from(orderItemTable)
         .leftJoin(pumpTable, eq(pumpTable.id, orderItemTable.productId))
         .where(eq(orderItemTable.orderId, orderId))

      // Fetch addresses
      const shippingAddress = order.shippingAddressId
         ? await db
              .select()
              .from(addressTable)
              .where(eq(addressTable.id, order.shippingAddressId))
              .limit(1)
              .then((result) => result[0])
         : null

      const billingAddress = order.billingAddressId
         ? await db
              .select()
              .from(addressTable)
              .where(eq(addressTable.id, order.billingAddressId))
              .limit(1)
              .then((result) => result[0])
         : null

      return NextResponse.json({
         order,
         orderItems,
         shippingAddress,
         billingAddress,
      })
   } catch (error) {
      logger.error('Error fetching order details', error)
      return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 })
   }
}

// Update order status
export async function PATCH(request: NextRequest, { params }: Props) {
   try {
      const session = await auth.api.getSession({ headers: request.headers })
      const isAdmin = await isSuperAdmin(session?.user?.email || '')

      if (!isAdmin) {
         logger.warn('Unauthorized order update attempt', {
            userId: session?.user?.id,
            email: session?.user?.email,
         })
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const resolvedParams = await params
      const orderId = resolvedParams.id

      if (!orderId) {
         return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 })
      }

      const body = await request.json()
      const { paymentStatus, status } = body

      // Validate payment status if provided
      if (
         paymentStatus &&
         !['pending', 'successful', 'failed', 'refunded'].includes(paymentStatus)
      ) {
         return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
      }

      // Validate order status if provided
      if (status && !['pending', 'paid', 'shipped', 'completed', 'cancelled'].includes(status)) {
         return NextResponse.json({ error: 'Invalid order status' }, { status: 400 })
      }

      if (!paymentStatus && !status) {
         return NextResponse.json(
            { error: 'Either payment status or order status must be provided' },
            { status: 400 },
         )
      }

      // Get current order to check existing status
      const [currentOrder] = await db
         .select({
            paymentStatus: orderTable.paymentStatus,
            status: orderTable.status,
         })
         .from(orderTable)
         .where(eq(orderTable.id, orderId))
         .limit(1)

      if (!currentOrder) {
         return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Payment status validation
      if (paymentStatus) {
         // Only allow updating from "pending" to "successful" (paid)
         if (currentOrder.paymentStatus !== 'pending' && paymentStatus === 'successful') {
            return NextResponse.json(
               { error: 'Payment status can only be updated from pending to paid' },
               { status: 400 },
            )
         }

         // Prevent updating from "successful" to "pending"
         if (currentOrder.paymentStatus === 'successful' && paymentStatus === 'pending') {
            return NextResponse.json(
               { error: 'Cannot change payment status from paid back to pending' },
               { status: 400 },
            )
         }
      }

      // Prepare update object
      const updateData: {
         updatedAt: Date
         paymentStatus?: 'pending' | 'successful' | 'failed' | 'refunded'
         status?: 'pending' | 'shipped' | 'cancelled'
      } = { updatedAt: new Date() }
      if (paymentStatus) updateData.paymentStatus = paymentStatus
      if (status) updateData.status = status

      // Update the order
      await db.update(orderTable).set(updateData).where(eq(orderTable.id, orderId))

      // Send notification emails based on status changes
      if (status === 'shipped' || status === 'completed') {
         // Fetch order details for email
         const [orderDetails] = await db
            .select({
               orderNumber: orderTable.orderNumber,
               userEmail: orderTable.userEmail,
               userName: user.name,
               shippingAddressId: orderTable.shippingAddressId,
            })
            .from(orderTable)
            .leftJoin(user, eq(user.email, orderTable.userEmail))
            .where(eq(orderTable.id, orderId))
            .limit(1)

         if (orderDetails && orderDetails.userEmail) {
            if (status === 'shipped') {
               // Send shipping notification
               const shippingData = {
                  customerName: orderDetails.userName || 'Customer',
                  customerEmail: orderDetails.userEmail,
                  orderNumber: orderDetails.orderNumber || `#${orderId}`,
                  trackingNumber: 'TRK-' + orderId,
                  trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`,
                  carrier: 'Standard Shipping',
                  estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
               }

               try {
                  const html = await render(ShippingNotification(shippingData))
                  await sendMailEdge(
                     shippingData.customerEmail,
                     `Your order #${shippingData.orderNumber} has shipped!`,
                     html,
                  )
                  logger.success('Shipping notification email sent', { orderId })
               } catch (error) {
                  logger.warn('Failed to send shipping notification', { error })
               }
            }

            if (status === 'delivered' && currentOrder.status !== 'delivered') {
               logger.debug('Order marked as completed', { orderId })
               // Could send delivery confirmation email here if needed
            }
         }
      }

      // If payment status changed to successful, send order confirmation
      if (paymentStatus === 'successful' && currentOrder.paymentStatus === 'pending') {
         const [orderDetails] = await db
            .select({
               orderNumber: orderTable.orderNumber,
               userEmail: orderTable.userEmail,
               userName: user.name,
               totalAmount: orderTable.totalAmount,
               shippingAddressId: orderTable.shippingAddressId,
               createdAt: orderTable.createdAt,
            })
            .from(orderTable)
            .leftJoin(user, eq(user.email, orderTable.userEmail))
            .where(eq(orderTable.id, orderId))
            .limit(1)

         if (orderDetails && orderDetails.userEmail) {
            // Fetch order items
            const items = await db
               .select({
                  id: orderItemTable.id,
                  productName: orderItemTable.productName,
                  quantity: orderItemTable.quantity,
                  unitPrice: orderItemTable.unitPrice,
                  productImage: pumpTable.imageUrl,
               })
               .from(orderItemTable)
               .leftJoin(pumpTable, eq(pumpTable.id, orderItemTable.productId))
               .where(eq(orderItemTable.orderId, orderId))

            // Fetch shipping address
            const shippingAddr = orderDetails.shippingAddressId
               ? await db
                    .select()
                    .from(addressTable)
                    .where(eq(addressTable.id, orderDetails.shippingAddressId))
                    .limit(1)
               : []

            const confirmationData: OrderConfirmationEmailProps & { customerEmail: string } = {
               customerName: orderDetails.userName || 'Customer',
               customerEmail: orderDetails.userEmail,
               orderNumber: orderDetails.orderNumber || `#${orderId}`,
               orderDate: orderDetails.createdAt || new Date(),
               items: items.map(
                  (item): OrderItem => ({
                     id: item.id.toString(),
                     name: item.productName,
                     price: item.unitPrice,
                     quantity: item.quantity,
                     image: item.productImage || undefined,
                  }),
               ),
               subtotal: orderDetails.totalAmount,
               shipping: 0,
               tax: 0,
               total: orderDetails.totalAmount,
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
                       fullName: 'Customer',
                       addressLine1: '',
                       city: '',
                       state: '',
                       postalCode: '',
                       country: '',
                    } as ShippingAddress),
            }

            try {
               const html = await render(OrderConfirmation(confirmationData))
               await sendMailEdge(
                  confirmationData.customerEmail,
                  `Order Confirmation #${confirmationData.orderNumber}`,
                  html,
               )
               logger.success('Payment confirmation email sent', { orderId })
            } catch (error) {
               logger.warn('Failed to send payment confirmation', { error })
            }
         }
      }

      return NextResponse.json(
         { message: 'Order payment status updated successfully' },
         { status: 200 },
      )
   } catch (error) {
      logger.error('Error updating order', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
   }
}
