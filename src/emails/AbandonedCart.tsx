import * as React from 'react'

import { Button, Html, Section, Text } from '@react-email/components'

import Layout from './components/Layout'

interface CartItem {
   id: string
   name: string
   price: number
   image?: string
}

interface AbandonedCartProps {
   customerName: string
   items: CartItem[]
   cartUrl: string
   discountCode?: string
   discountPercent?: number
}

export default function AbandonedCart({
   customerName,
   items,
   cartUrl,
   discountCode,
   discountPercent,
}: AbandonedCartProps) {
   const formatCurrency = (amount: number) =>
      new Intl.NumberFormat('en-US', {
         style: 'currency',
         currency: 'USD',
      }).format(amount / 100) // Assuming amounts are in cents

   return (
      <Html>
         <Layout previewText="Don't forget your items!">
            <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
               Don&apos;t forget your items, {customerName}!
            </Text>

            <Text style={{ marginBottom: '24px' }}>
               You left some great items in your cart. Complete your purchase before they&apos;re
               gone!
            </Text>

            {/* Cart Items */}
            <Section style={{ marginBottom: '24px' }}>
               {items.map((item, index) => (
                  <div
                     key={item.id}
                     style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: index > 0 ? '12px' : '0',
                        paddingBottom: '12px',
                        borderBottom: index < items.length - 1 ? '1px solid #e5e7eb' : 'none',
                     }}
                  >
                     <div style={{ width: '65%' }}>
                        <Text style={{ fontWeight: '500', margin: '0' }}>{item.name}</Text>
                     </div>
                     <div style={{ width: '35%', textAlign: 'right' }}>
                        <Text style={{ fontWeight: '500', margin: '0' }}>
                           {formatCurrency(item.price)}
                        </Text>
                     </div>
                  </div>
               ))}
            </Section>

            {discountCode && (
               <Section
                  style={{
                     backgroundColor: '#fef3c7',
                     padding: '24px',
                     borderRadius: '8px',
                     textAlign: 'center',
                     marginBottom: '24px',
                  }}
               >
                  <Text style={{ fontWeight: '600', marginBottom: '8px' }}>
                     ⏰ Limited Time Offer!
                  </Text>
                  <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                     Get {discountPercent}% off when you complete your order
                  </Text>
                  <Text
                     style={{
                        display: 'inline-block',
                        border: '2px dashed #d97706',
                        backgroundColor: 'white',
                        padding: '8px 12px',
                        fontFamily: 'monospace',
                        fontSize: '20px',
                        marginBottom: '8px',
                     }}
                  >
                     {discountCode}
                  </Text>
                  <Text style={{ fontSize: '14px' }}>
                     Use this code at checkout - expires in 24 hours!
                  </Text>
               </Section>
            )}

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
               <Button
                  href={cartUrl}
                  style={{
                     backgroundColor: '#f59e0b',
                     color: 'white',
                     padding: '16px 32px',
                     borderRadius: '6px',
                     textDecoration: 'none',
                     display: 'inline-block',
                     fontWeight: '500',
                     fontSize: '18px',
                  }}
               >
                  Complete Your Purchase
               </Button>
            </div>

            <Text style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>
               Items in your cart are reserved for a limited time. Complete your order soon to
               secure them!
            </Text>
         </Layout>
      </Html>
   )
}
