import type { Metadata } from 'next'

import SignInPageClient from './sign-in-page-client'

export const metadata: Metadata = {
   title: 'Sign In | World Pumps',
}

export default function SignInPage() {
   return <SignInPageClient />
}
