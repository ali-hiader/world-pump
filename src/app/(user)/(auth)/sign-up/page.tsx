import type { Metadata } from 'next'

import SignUpPageClient from './sign-up-page-client'

export const metadata: Metadata = {
   title: 'Sign Up | World Pumps',
}

export default function SignUpPage() {
   return <SignUpPageClient />
}
