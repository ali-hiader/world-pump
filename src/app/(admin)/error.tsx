'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function AdminError({
   error,
   reset,
}: {
   error: Error & { digest?: string }
   reset: () => void
}) {
   return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
         <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
            <p className="text-muted-foreground max-w-md">
               An error occurred in the admin panel. Please try again or contact support if the
               problem persists.
            </p>

            {error.digest && (
               <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
            )}

            <div className="flex gap-4 justify-center mt-6">
               <Button onClick={() => reset()} variant="default">
                  Try again
               </Button>
               <Link href="/super-admin">Go to Dashboard</Link>
            </div>
         </div>
      </div>
   )
}
