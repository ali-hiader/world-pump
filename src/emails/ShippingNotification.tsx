import * as React from 'react'

import { Button, Html, Section, Text } from '@react-email/components'

import Layout from './components/Layout'

interface ShippingNotificationProps {
   customerName: string
   orderNumber: string
   trackingNumber: string
   trackingUrl: string
   carrier: string
   estimatedDelivery: Date
}

export default function ShippingNotification({
   customerName,
   orderNumber,
   trackingNumber,
   trackingUrl,
   carrier,
   estimatedDelivery,
}: ShippingNotificationProps) {
   return (
      <Html>
         <Layout previewText={`Your order #${orderNumber} has shipped!`}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
               Good news, {customerName}!
            </Text>

            <Text style={{ fontSize: '18px', marginBottom: '24px' }}>
               Your order #{orderNumber} has shipped and is on its way to you.
            </Text>

            <Section
               style={{
                  backgroundColor: '#eff6ff',
                  padding: '24px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '24px',
               }}
            >
               <Text style={{ fontWeight: '600', marginBottom: '8px' }}>Tracking Information</Text>
               <Text style={{ fontSize: '14px', marginBottom: '4px' }}>Carrier: {carrier}</Text>
               <Text style={{ fontSize: '14px', marginBottom: '16px' }}>
                  Tracking #: {trackingNumber}
               </Text>

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
                  Track Your Package
               </Button>
            </Section>

            <Text style={{ textAlign: 'center', marginBottom: '16px' }}>
               <strong>Estimated Delivery:</strong>
               <br />
               {estimatedDelivery.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
               })}
            </Text>

            <Text style={{ color: '#6b7280', fontSize: '14px' }}>
               You&apos;ll receive another email when your package is delivered. If you have any
               questions, please don&apos;t hesitate to contact us.
            </Text>
         </Layout>
      </Html>
   )
}
