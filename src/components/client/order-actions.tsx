'use client'

import { useState } from 'react'

import { logger } from '@/lib/logger'
import { OrderType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import Spinner from '@/icons/spinner'

interface OrderActionsProps {
   order: OrderType
   onStatusUpdate: (orderId: number, newStatus: string) => void
}

export default function OrderActions({ order, onStatusUpdate }: OrderActionsProps) {
   const [isUpdating, setIsUpdating] = useState(false)
   const [error, setError] = useState<string>('')

   const handleMarkAsReceived = async () => {
      if (!order.id) return

      setIsUpdating(true)
      setError('')

      try {
         const response = await fetch(`/api/orders/${order.id}/status`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               status: 'completed',
            }),
         })

         const data = await response.json()

         if (response.ok) {
            onStatusUpdate(order.id, 'completed')
         } else {
            setError(data.error || 'Failed to update order status')
         }
      } catch (error) {
         logger.error('Error updating order status', error)
         setError('Failed to update order status')
      } finally {
         setIsUpdating(false)
      }
   }

   // Show the button only if order is paid or shipped
   const canMarkAsReceived = ['paid', 'shipped'].includes(order.status || '')

   if (!canMarkAsReceived) {
      return null
   }

   return (
      <div className="flex flex-col gap-2">
         {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
               {error}
            </div>
         )}
         <Button
            onClick={handleMarkAsReceived}
            disabled={isUpdating}
            size="sm"
            variant="outline"
            className="w-fit"
         >
            {isUpdating ? (
               <>
                  <Spinner className="animate-spin mr-1 h-3 w-3" />
                  Updating...
               </>
            ) : (
               'Mark as Received'
            )}
         </Button>
      </div>
   )
}
