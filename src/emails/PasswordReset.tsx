import * as React from 'react'

import { Button, Html, Text } from '@react-email/components'

import { storeConfig } from '@/lib/constants'

import Layout from './components/Layout'

interface PasswordResetProps {
   customerName?: string
   resetUrl: string
   expiresAt: Date
}

export default function PasswordResetEmail({
   customerName,
   resetUrl,
   expiresAt,
}: PasswordResetProps) {
   const timeUntilExpiration = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60))

   return (
      <Html>
         <Layout previewText="Reset your password">
            <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
               Reset Your Password
            </Text>

            <Text style={{ marginBottom: '16px' }}>
               {customerName ? `Hi ${customerName},` : 'Hello,'}
            </Text>

            <Text style={{ marginBottom: '24px' }}>
               We received a request to reset your password for your {storeConfig.storeName}{' '}
               account. Click the button below to create a new password.
            </Text>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
               <Button
                  href={resetUrl}
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
                  Reset Password
               </Button>
            </div>

            <Text style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
               This link will expire in {timeUntilExpiration} minutes for security reasons.
            </Text>

            <Text style={{ color: '#6b7280', fontSize: '14px' }}>
               If you didn&apos;t request this password reset, you can safely ignore this email.
               Your password won&apos;t be changed until you create a new one using the link above.
            </Text>

            <Text style={{ color: '#6b7280', fontSize: '14px', marginTop: '16px' }}>
               If you&apos;re having trouble clicking the button, copy and paste this URL into your
               browser:
               <br />
               <a href={resetUrl} style={{ color: '#2563eb', wordBreak: 'break-all' }}>
                  {resetUrl}
               </a>
            </Text>
         </Layout>
      </Html>
   )
}
