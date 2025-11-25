import * as React from 'react'

import { Html, Text } from '@react-email/components'

import { storeConfig } from '@/lib/constants'

import Layout from './components/Layout'

interface ContactConfirmationProps {
   customerName: string
   subject: string
}

export default function ContactConfirmation({ customerName, subject }: ContactConfirmationProps) {
   return (
      <Html>
         <Layout previewText="We received your message">
            <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
               Thank you for contacting us!
            </Text>

            <Text style={{ marginBottom: '16px' }}>Hi {customerName},</Text>

            <Text style={{ marginBottom: '24px' }}>
               We&apos;ve received your message regarding &quot;
               <strong>{subject}</strong>&quot; and will get back to you as soon as possible.
            </Text>

            <Text style={{ marginBottom: '24px' }}>
               Our support team typically responds within 24-48 hours during business days. For
               urgent inquiries, please call us at{' '}
               <a href={`tel:${storeConfig.legal.phone}`} style={{ color: '#2563eb' }}>
                  {storeConfig.legal.phone}
               </a>
               .
            </Text>

            <Text style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
               In the meantime:
            </Text>

            <Text style={{ fontSize: '14px', marginBottom: '8px' }}>
               • Check out our{' '}
               <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/pumps/all`}
                  style={{ color: '#2563eb' }}
               >
                  latest products
               </a>
               <br />• Browse our{' '}
               <a href={`${process.env.NEXT_PUBLIC_APP_URL}/blogs`} style={{ color: '#2563eb' }}>
                  blog
               </a>{' '}
               for helpful tips
               <br />• Follow us on social media for updates
            </Text>

            <Text style={{ color: '#6b7280', fontSize: '14px', marginTop: '24px' }}>
               Best regards,
               <br />
               The {storeConfig.storeName} Team
            </Text>
         </Layout>
      </Html>
   )
}
