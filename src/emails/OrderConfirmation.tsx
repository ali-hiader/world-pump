import * as React from 'react'

import { Button, Column, Hr, Html, Row, Section, Text } from '@react-email/components'

import { storeConfig } from '@/lib/constants'

import Layout from './components/Layout'

interface OrderItem {
   id: string
   name: string
   price: number
   quantity: number
   image?: string
}

interface OrderConfirmationProps {
   customerName: string
   orderNumber: string
   orderDate: Date
   items: OrderItem[]
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

export default function OrderConfirmation({
   customerName,
   orderNumber,
   orderDate,
   items,
   subtotal,
   shipping,
   tax,
   total,
   shippingAddress,
   trackingUrl,
}: OrderConfirmationProps) {
   const formatCurrency = (amount: number) =>
      new Intl.NumberFormat('en-US', {
         style: 'currency',
         currency: 'USD',
      }).format(amount / 100) // Assuming amounts are in cents

   return (
      <Html>
         <Layout previewText={`Order confirmation #${orderNumber}`}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
               Thanks for your order, {customerName}!
            </Text>

            <Text style={{ marginBottom: '24px' }}>
               We've received your order and will notify you when it ships.
            </Text>

            <Section
               style={{
                  backgroundColor: '#f3f4f6',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '24px',
               }}
            >
               <Text style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Order #{orderNumber}
               </Text>
               <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                  Order Date: {orderDate.toLocaleDateString()}
               </Text>
            </Section>

            {/* Order Items */}
            <Section style={{ marginBottom: '24px' }}>
               <Text style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                  Order Items
               </Text>
               {items.map((item, index) => (
                  <div key={item.id}>
                     <Row style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                        <Column style={{ width: '65%' }}>
                           <Text style={{ fontWeight: '500', margin: '0' }}>{item.name}</Text>
                           <Text
                              style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0 0' }}
                           >
                              Qty: {item.quantity}
                           </Text>
                        </Column>
                        <Column style={{ width: '35%', textAlign: 'right' }}>
                           <Text style={{ fontWeight: '500', margin: '0' }}>
                              {formatCurrency(item.price * item.quantity)}
                           </Text>
                        </Column>
                     </Row>
                     {index < items.length - 1 && (
                        <Hr style={{ margin: '0', borderColor: '#e5e7eb' }} />
                     )}
                  </div>
               ))}
            </Section>

            {/* Order Summary */}
            <Section
               style={{
                  backgroundColor: '#f3f4f6',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '24px',
               }}
            >
               <Row style={{ marginBottom: '8px' }}>
                  <Column style={{ width: '65%' }}>
                     <Text style={{ margin: '0' }}>Subtotal:</Text>
                  </Column>
                  <Column style={{ width: '35%', textAlign: 'right' }}>
                     <Text style={{ margin: '0' }}>{formatCurrency(subtotal)}</Text>
                  </Column>
               </Row>
               <Row style={{ marginBottom: '8px' }}>
                  <Column style={{ width: '65%' }}>
                     <Text style={{ margin: '0' }}>Shipping:</Text>
                  </Column>
                  <Column style={{ width: '35%', textAlign: 'right' }}>
                     <Text style={{ margin: '0' }}>{formatCurrency(shipping)}</Text>
                  </Column>
               </Row>
               <Row style={{ marginBottom: '8px' }}>
                  <Column style={{ width: '65%' }}>
                     <Text style={{ margin: '0' }}>Tax:</Text>
                  </Column>
                  <Column style={{ width: '35%', textAlign: 'right' }}>
                     <Text style={{ margin: '0' }}>{formatCurrency(tax)}</Text>
                  </Column>
               </Row>
               <Hr style={{ margin: '8px 0', borderColor: '#d1d5db' }} />
               <Row>
                  <Column style={{ width: '65%' }}>
                     <Text style={{ fontWeight: 'bold', margin: '0' }}>Total:</Text>
                  </Column>
                  <Column style={{ width: '35%', textAlign: 'right' }}>
                     <Text style={{ fontWeight: 'bold', margin: '0' }}>
                        {formatCurrency(total)}
                     </Text>
                  </Column>
               </Row>
            </Section>

            {/* Shipping Address */}
            <Section style={{ marginBottom: '24px' }}>
               <Text style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Shipping Address
               </Text>
               <Text style={{ fontSize: '14px', lineHeight: '1.5', margin: '0' }}>
                  {shippingAddress.fullName}
                  <br />
                  {shippingAddress.addressLine1}
                  {shippingAddress.addressLine2 && (
                     <>
                        <br />
                        {shippingAddress.addressLine2}
                     </>
                  )}
                  <br />
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                  <br />
                  {shippingAddress.country}
               </Text>
            </Section>

            {trackingUrl && (
               <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <Button
                     href={trackingUrl}
                     style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        display: 'inline-block',
                        fontWeight: '500',
                     }}
                  >
                     Track Your Order
                  </Button>
               </div>
            )}

            <Text style={{ color: '#6b7280', fontSize: '14px' }}>
               If you have any questions about your order, please contact our support team at{' '}
               <a href={`mailto:${storeConfig.legal.supportEmail}`} style={{ color: '#2563eb' }}>
                  {storeConfig.legal.supportEmail}
               </a>
            </Text>
         </Layout>
      </Html>
   )
}
