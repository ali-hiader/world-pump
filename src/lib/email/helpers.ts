import { render } from '@react-email/render'

import { storeConfig } from '@/lib/constants'
import { sendEmail } from '@/lib/email/email-service'
import AbandonedCart from '@/emails/AbandonedCart'
import OrderConfirmation from '@/emails/OrderConfirmation'
import PasswordResetSimple from '@/emails/PasswordResetSimple'
import ShippingNotification from '@/emails/ShippingNotification'
import WelcomeEcommerce from '@/emails/WelcomeEcommerce'

export interface OrderItem {
   id: string
   name: string
   price: number
   quantity: number
   image?: string
}

export interface ShippingAddress {
   fullName: string
   addressLine1: string
   addressLine2?: string
   city: string
   state: string
   postalCode: string
   country: string
}

export interface CartItem {
   id: string
   name: string
   price: number
   image?: string
}

export const emailHelpers = {
   async sendWelcomeEmail(
      user: {
         name: string
         email: string
      },
      options?: {
         discountCode?: string
      },
   ) {
      const html = await render(
         WelcomeEcommerce({
            customerName: user.name,
            accountUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
            discountCode: options?.discountCode || 'WELCOME15',
         }),
      )

      return sendEmail({
         to: user.email,
         subject: `Welcome to ${storeConfig.storeName}!`,
         html,
      })
   },

   async sendPasswordResetEmail(
      user: {
         name: string
         email: string
      },
      resetToken: string,
   ) {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      const html = await render(
         PasswordResetSimple({
            customerName: user.name,
            resetUrl,
            expiresAt,
         }),
      )

      return sendEmail({
         to: user.email,
         subject: 'Reset your password',
         html,
      })
   },

   async sendOrderConfirmationEmail(orderData: {
      customerName: string
      customerEmail: string
      orderNumber: string
      orderDate: Date
      items: OrderItem[]
      subtotal: number
      shipping: number
      tax: number
      total: number
      shippingAddress: ShippingAddress
      trackingUrl?: string
   }) {
      const html = await render(OrderConfirmation(orderData))

      return sendEmail({
         to: orderData.customerEmail,
         subject: `Order Confirmation #${orderData.orderNumber}`,
         html,
      })
   },

   async sendShippingNotificationEmail(shippingData: {
      customerName: string
      customerEmail: string
      orderNumber: string
      trackingNumber: string
      trackingUrl: string
      carrier: string
      estimatedDelivery: Date
   }) {
      const html = await render(ShippingNotification(shippingData))

      return sendEmail({
         to: shippingData.customerEmail,
         subject: `Your order #${shippingData.orderNumber} has shipped!`,
         html,
      })
   },

   // TODO: Implement abandoned cart email workflow
   async sendAbandonedCartEmail(cartData: {
      customerName: string
      customerEmail: string
      items: CartItem[]
      cartUrl?: string
      discountCode?: string
      discountPercent?: number
   }) {
      const html = await render(
         AbandonedCart({
            ...cartData,
            cartUrl: cartData.cartUrl || `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
            discountCode: cartData.discountCode || 'COMEBACK10',
            discountPercent: cartData.discountPercent || 10,
         }),
      )

      return sendEmail({
         to: cartData.customerEmail,
         subject: "Don't forget your items!",
         html,
      })
   },
}
