'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export default function CheckoutError({
   error,
   reset,
}: {
   error: Error & { digest?: string }
   reset: () => void
}) {
   useEffect(() => {
      // Log the error to an error reporting service
      console.error('Checkout error:', error)
   }, [error])

   return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
         <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Checkout Error</h2>
            <p className="text-muted-foreground max-w-md">
               We couldn&apos;t process your checkout. Don&apos;t worry, your cart is still safe.
               Please try again or contact support if the issue persists.
            </p>
            {error.digest && (
               <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
            )}
            <div className="flex gap-4 justify-center mt-6">
               <Button onClick={() => reset()} variant="default">
                  Try again
               </Button>
               <Button onClick={() => (window.location.href = '/cart')} variant="outline">
                  Back to Cart
               </Button>
            </div>
         </div>
      </div>
   )
}
