import type { Metadata } from 'next'

import ForgotPasswordPageClient from './forgot-password-page-client'

export const metadata: Metadata = {
   title: 'Forgot Password | World Pumps',
}

export default function ForgotPasswordPage() {
   return <ForgotPasswordPageClient />
}
