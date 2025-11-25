import * as React from 'react'

import {
   Body,
   Container,
   Head,
   Hr,
   Html,
   Img,
   Link,
   Preview,
   Tailwind,
   Text,
} from '@react-email/components'

import { storeConfig } from '@/lib/constants'

interface LayoutProps {
   children: React.ReactNode
   previewText?: string
}

// Note: React Email doesn't support async components, so we removed next-intl integration
export const Layout = ({ children, previewText }: LayoutProps) => {
   return (
      <Html>
         <Head />
         <Preview>{previewText || ''}</Preview>
         <Tailwind
            config={{
               theme: {
                  extend: {
                     colors: {
                        // World Pumps brand colors
                        primary: '#2563eb', // Blue
                        background: '#ffffff',
                        foreground: '#1f2937',
                        border: '#e5e7eb',
                        muted: '#6b7280',
                        ['primary-foreground']: '#ffffff',
                        ['muted-foreground']: '#6b7280',
                        accent: '#f59e0b', // Orange for CTAs
                     },
                  },
               },
            }}
         >
            <Body className="bg-background mx-auto my-auto font-sans">
               <Container className="border-border mx-auto my-[40px] max-w-[465px] rounded border border-solid p-[20px]">
                  <div className="mb-6 flex items-center justify-center">
                     <Img
                        src={`${process.env.NEXT_PUBLIC_APP_URL || 'https://worldpumps.com'}/logo.png`}
                        width="100"
                        height="100"
                        alt={storeConfig.storeName}
                        className="mx-auto my-0"
                        style={{ maxWidth: '100px', height: 'auto' }}
                     />
                  </div>
                  {children}
                  <Hr className="border-border mx-0 my-[26px] w-full border border-solid" />
                  <Text className="text-muted-foreground text-[11px] leading-[20px]">
                     Email sent by {storeConfig.storeName}
                     <br />
                     {storeConfig.legal.address}
                     <br />
                     Questions? Contact us at{' '}
                     <Link
                        className="text-primary underline"
                        href={`mailto:${storeConfig.legal.supportEmail}`}
                     >
                        {storeConfig.legal.supportEmail}
                     </Link>{' '}
                     or{' '}
                     <Link
                        className="text-primary underline"
                        href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://worldpumps.com'}/contact`}
                     >
                        visit our contact page
                     </Link>
                     .
                  </Text>
               </Container>
            </Body>
         </Tailwind>
      </Html>
   )
}

export default Layout
