'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { logger } from '@/lib/logger'
import { OrderType } from '@/lib/types'
import { OrderItem as OrderItemI } from '@/lib/types'
import DisplayAlert from '@/components/client/display-alert'
import Heading from '@/components/client/heading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Spinner from '@/icons/spinner'

interface OrderWithItems {
   order: OrderType
   items: OrderItemI[]
}

function Analytics() {
   const router = useRouter()
   const [orderItems, setOrderItems] = useState<OrderWithItems[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string>('')

   useEffect(() => {
      const fetchOrders = async () => {
         try {
            const response = await fetch('/api/orders')
            const data = await response.json()

            if (response.ok) {
               setOrderItems(data.orderItems || [])
            } else if (response.status === 401) {
               router.push('/signup')
            } else {
               setError(data.error || 'Failed to fetch orders')
            }
         } catch (error) {
            logger.error('Failed to fetch orders', error)
            setError('Failed to fetch orders')
         } finally {
            setLoading(false)
         }
      }

      fetchOrders()
   }, [router])

   const handleStatusUpdate = (orderId: number, newStatus: string) => {
      setOrderItems((prev) =>
         prev.map((orderData) =>
            orderData.order.id === orderId
               ? {
                    ...orderData,
                    order: {
                       ...orderData.order,
                       status: newStatus as
                          | 'pending'
                          | 'paid'
                          | 'shipped'
                          | 'completed'
                          | 'cancelled',
                    },
                 }
               : orderData,
         ),
      )
   }

   if (loading) {
      return (
         <main className="px-4 sm:px-[5%] pb-12 mt-8 min-h-96 max-w-[1600px] mx-auto">
            <div className="flex items-center justify-center py-12">
               <Spinner className="animate-spin h-8 w-8" />
            </div>
         </main>
      )
   }

   if (error) {
      return (
         <main className="px-4 sm:px-[5%] pb-12 mt-8 min-h-96 max-w-[1600px] mx-auto">
            <div className="text-center py-12">
               <p className="text-red-600">{error}</p>
            </div>
         </main>
      )
   }

   function getTime(order: OrderType) {
      if (!order.createdAt) return 'N/A'

      // Convert string to Date object if it's a string
      const date = typeof order.createdAt === 'string' ? new Date(order.createdAt) : order.createdAt

      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid Date'

      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      const day = date.getDate()
      const month = date.getMonth() + 1 // getMonth() returns 0-11
      const year = date.getFullYear()

      return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`
   }

   return (
      <main className="px-4 sm:px-[5%] pb-12 mt-8 min-h-96 max-w-[1600px] mx-auto">
         <Heading title="Orders" />
         <ul className="w-full">
            {orderItems.length === 0 ? (
               <DisplayAlert showBtn buttonText="Start Shopping" buttonHref="/pumps/all">
                  Create Orders to view here!
               </DisplayAlert>
            ) : (
               orderItems.map((orderData, i) => (
                  <li key={orderData.order.id} className="w-full flex flex-col items-start gap-2">
                     <section className="mt-6 flex sm:items-center sm:flex-row flex-col sm:justify-between w-full">
                        <span className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                           <span>
                              Order #{i + 1} - {getTime(orderData.order)}
                           </span>
                           {orderData.order.orderNumber && (
                              <span className="text-xs text-muted-foreground">
                                 ({orderData.order.orderNumber})
                              </span>
                           )}
                        </span>
                        <span className="text-lg font-medium headingFont">
                           total - ${orderData.order.totalAmount}
                        </span>
                     </section>
                     <section className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 text-sm">
                           <StatusBadge label="Order" value={orderData.order.status} />
                           <StatusBadge label="Payment" value={orderData.order.paymentStatus} />
                        </div>
                        <OrderActions order={orderData.order} onStatusUpdate={handleStatusUpdate} />
                     </section>
                     <section className="w-full grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {orderData.items.map((item) => (
                           <OrderItem key={item.id} item={item} />
                        ))}
                     </section>
                  </li>
               ))
            )}
         </ul>
      </main>
   )
}

interface Props {
   item: OrderItemI
}

function OrderItem({ item }: Props) {
   return (
      <Card
         key={item.id}
         className="h-fit flex justify-between w-full min-h-20 gap-5 overflow-hidden rounded-md px-4 py-4"
      >
         <section className="flex-1">
            <div className="flex justify-between">
               <h3 className="font-medium">
                  {item.productName} ({item.quantity})
               </h3>
               <p className="font-medium headingFont text-emerald-700">
                  ${item.unitPrice * item.quantity}
               </p>
            </div>
         </section>
      </Card>
   )
}

export default Analytics

// Inline OrderActions component
function OrderActions({
   order,
   onStatusUpdate,
}: {
   order: OrderType
   onStatusUpdate: (orderId: number, newStatus: string) => void
}) {
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
         logger.error('Failed to update order status', error)
         setError('Failed to update order status')
      } finally {
         setIsUpdating(false)
      }
   }

   // Show the button only if order is paid or shipped
   const canMarkAsReceived = ['paid', 'shipped'].includes(order.status || '')

   return (
      <div className="flex flex-col gap-2">
         {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
               {error}
            </div>
         )}

         {canMarkAsReceived && (
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
         )}
      </div>
   )
}

function StatusBadge({ label, value }: { label: string; value: string | null }) {
   const color =
      value === 'successful' || value === 'paid'
         ? 'bg-emerald-100 text-emerald-700'
         : value === 'failed' || value === 'cancelled'
           ? 'bg-rose-100 text-rose-700'
           : 'bg-amber-100 text-amber-700' // pending or others
   return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${color}`}>
         <span className="text-xs uppercase opacity-70">{label}</span>
         <span className="text-xs font-medium">{value || 'pending'}</span>
      </span>
   )
}
