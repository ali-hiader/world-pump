import type { Metadata } from 'next'

import ResetPasswordPageClient from './reset-password-page-client'

export const metadata: Metadata = {
   title: 'Reset Password | World Pumps',
}

export default function ResetPasswordPage() {
   return <ResetPasswordPageClient />
}
