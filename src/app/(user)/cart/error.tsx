'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

export default function CartError({
   error,
   reset,
}: {
   error: Error & { digest?: string }
   reset: () => void
}) {
   useEffect(() => {
      // Log the error to an error reporting service
      console.error('Cart error:', error)
   }, [error])

   return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
         <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Cart Error</h2>
            <p className="text-muted-foreground max-w-md">
               We encountered an issue loading your cart. Your items are saved and will be restored
               when you refresh.
            </p>
            {error.digest && (
               <p className="text-sm text-muted-foreground">Error ID: {error.digest}</p>
            )}
            <div className="flex gap-4 justify-center mt-6">
               <Button onClick={() => reset()} variant="default">
                  Reload Cart
               </Button>
               <Button onClick={() => (window.location.href = '/pumps')} variant="outline">
                  Continue Shopping
               </Button>
            </div>
         </div>
      </div>
   )
}
