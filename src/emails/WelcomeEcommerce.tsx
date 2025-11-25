import * as React from 'react'

import { Button, Html, Section, Text } from '@react-email/components'

import { storeConfig } from '@/lib/constants'

import Layout from './components/Layout'

interface WelcomeEmailProps {
   customerName: string
   accountUrl: string
   discountCode?: string
}

export default function WelcomeEcommerce({
   customerName,
   accountUrl,
   discountCode,
}: WelcomeEmailProps) {
   return (
      <Html>
         <Layout previewText={`Welcome to ${storeConfig.storeName}!`}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
               Welcome to {storeConfig.storeName}, {customerName}!
            </Text>

            <Text style={{ marginBottom: '24px' }}>
               Thank you for creating an account with us. We&apos;re excited to have you as part of
               our community!
            </Text>

            {discountCode && (
               <Section
                  style={{
                     backgroundColor: '#dcfce7',
                     padding: '24px',
                     borderRadius: '8px',
                     textAlign: 'center',
                     marginBottom: '24px',
                  }}
               >
                  <Text style={{ fontWeight: '600', marginBottom: '8px' }}>🎉 Welcome Offer!</Text>
                  <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                     Get 15% off your first order
                  </Text>
                  <Text
                     style={{
                        display: 'inline-block',
                        border: '2px dashed #16a34a',
                        backgroundColor: 'white',
                        padding: '8px 12px',
                        fontFamily: 'monospace',
                        fontSize: '20px',
                        marginBottom: '8px',
                     }}
                  >
                     {discountCode}
                  </Text>
                  <Text style={{ fontSize: '14px' }}>Use this code at checkout</Text>
               </Section>
            )}

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
               <Button
                  href={accountUrl}
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
                  Manage Your Account
               </Button>
            </div>

            <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>What&apos;s next?</Text>
            <Text style={{ fontSize: '14px', marginBottom: '8px' }}>
               • Browse our latest pump products
               <br />
               • Set up your delivery preferences
               <br />
               • Join our newsletter for exclusive offers
               <br />• Follow us on social media
            </Text>

            <Text style={{ color: '#6b7280', fontSize: '14px' }}>
               If you have any questions, feel free to reach out to our support team at{' '}
               <a href={`mailto:${storeConfig.legal.supportEmail}`} style={{ color: '#2563eb' }}>
                  {storeConfig.legal.supportEmail}
               </a>
            </Text>
         </Layout>
      </Html>
   )
}
