import * as React from 'react'

import { Html, Section, Text } from '@react-email/components'

import { storeConfig } from '@/lib/constants'

import Layout from './components/Layout'

interface ContactFormNotificationProps {
   name: string
   email: string
   phone?: string | null
   subject: string
   message: string
   submittedAt: Date
   ipAddress?: string
}

export default function ContactFormNotification({
   name,
   email,
   phone,
   subject,
   message,
   submittedAt,
   ipAddress,
}: ContactFormNotificationProps) {
   return (
      <Html>
         <Layout previewText={`New contact message: ${subject}`}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
               New Contact Form Submission
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
                  {subject}
               </Text>
               <Text style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
                  Submitted: {submittedAt.toLocaleString()}
               </Text>
            </Section>

            <Section style={{ marginBottom: '24px' }}>
               <Text style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Contact Information
               </Text>

               <table style={{ width: '100%', fontSize: '14px' }}>
                  <tbody>
                     <tr>
                        <td
                           style={{
                              padding: '8px 0',
                              fontWeight: '500',
                              width: '120px',
                              verticalAlign: 'top',
                           }}
                        >
                           Name:
                        </td>
                        <td style={{ padding: '8px 0' }}>{name}</td>
                     </tr>
                     <tr>
                        <td
                           style={{
                              padding: '8px 0',
                              fontWeight: '500',
                              width: '120px',
                              verticalAlign: 'top',
                           }}
                        >
                           Email:
                        </td>
                        <td style={{ padding: '8px 0' }}>
                           <a href={`mailto:${email}`} style={{ color: '#2563eb' }}>
                              {email}
                           </a>
                        </td>
                     </tr>
                     {phone && (
                        <tr>
                           <td
                              style={{
                                 padding: '8px 0',
                                 fontWeight: '500',
                                 width: '120px',
                                 verticalAlign: 'top',
                              }}
                           >
                              Phone:
                           </td>
                           <td style={{ padding: '8px 0' }}>
                              <a href={`tel:${phone}`} style={{ color: '#2563eb' }}>
                                 {phone}
                              </a>
                           </td>
                        </tr>
                     )}
                     {ipAddress && (
                        <tr>
                           <td
                              style={{
                                 padding: '8px 0',
                                 fontWeight: '500',
                                 width: '120px',
                                 verticalAlign: 'top',
                              }}
                           >
                              IP Address:
                           </td>
                           <td style={{ padding: '8px 0', color: '#6b7280', fontSize: '13px' }}>
                              {ipAddress}
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </Section>

            <Section
               style={{
                  backgroundColor: '#eff6ff',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '24px',
               }}
            >
               <Text style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  Message
               </Text>
               <Text
                  style={{
                     fontSize: '14px',
                     lineHeight: '1.6',
                     whiteSpace: 'pre-wrap',
                     margin: '0',
                  }}
               >
                  {message}
               </Text>
            </Section>

            <Text style={{ color: '#6b7280', fontSize: '14px' }}>
               This message was sent via the {storeConfig.storeName} contact form.
               <br />
               Please respond to the customer at{' '}
               <a href={`mailto:${email}`} style={{ color: '#2563eb' }}>
                  {email}
               </a>
            </Text>
         </Layout>
      </Html>
   )
}
