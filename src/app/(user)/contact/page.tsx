import type { Metadata } from 'next'

import ContactPageClient from './contact-page-client'

export const metadata: Metadata = {
   title: 'Contact | World Pumps',
}

export default function ContactPage() {
   return <ContactPageClient />
}
