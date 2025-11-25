import type { ReactNode } from 'react'

import Link from 'next/link'

interface AuthLayoutProps {
   children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
   return (
      <div className="bg-background flex min-h-[calc(100vh-115px)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
         <div className="w-full max-w-md space-y-8">
            <div className="bg-background border-border rounded-lg border px-4 py-8 shadow-lg sm:px-10">
               {children}
            </div>

            <p className="text-muted-foreground text-center text-sm">
               By signing up, you agree to our{' '}
               <Link href="/terms" className="font-medium underline underline-offset-4">
                  Terms of Service
               </Link>{' '}
               and{' '}
               <Link href="/privacy" className="font-medium underline underline-offset-4">
                  Privacy Policy
               </Link>
            </p>
         </div>
      </div>
   )
}
