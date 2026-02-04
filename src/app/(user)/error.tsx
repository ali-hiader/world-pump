'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export default function UserError({
   error,
   reset,
}: {
   error: Error & { digest?: string }
   reset: () => void
}) {
   useEffect(() => {
      // Log the error to an error reporting service
      console.error('User error:', error)
   }, [error])

   return (
      <div className="flex min-h-[500px] flex-col items-center justify-center p-8">
         <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Oops! Something went wrong</h2>
            <p className="text-muted-foreground max-w-md">
               We encountered an unexpected error. Don&apos;t worry, your cart and data are safe.
               Please try again.
            </p>
            {error.digest && (
               <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
            )}
            <div className="flex gap-4 justify-center mt-6">
               <Button onClick={() => reset()} variant="default">
                  Try again
               </Button>
               <Button onClick={() => (window.location.href = '/')} variant="outline">
                  Go to Home
               </Button>
            </div>
         </div>
      </div>
   )
}
