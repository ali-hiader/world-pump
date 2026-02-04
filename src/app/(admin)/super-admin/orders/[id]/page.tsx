'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ArrowLeft } from 'lucide-react'

import { logger } from '@/lib/logger'
import { formatPKR } from '@/lib/utils'
import { showAlert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/icons/spinner'

interface Order {
   id: number
   userEmail: string
   userName: string
   status: string
   paymentStatus: string
   totalAmount: number
   createdAt: string
   updatedAt: string
   shippingAddressId: number | null
   billingAddressId: number | null
}

interface OrderItem {
   id: number
   quantity: number
   unitPrice: number
   productTitle: string
   productSlug: string
   productImage: string
}

interface Address {
   id: number
   fullName: string
   addressLine1: string
   addressLine2?: string
   city: string
   state: string
   postalCode?: string
   country: string
   phone: string
}

interface Props {
   params: {
      id: string
   }
}

function AdminOrderDetailsPage({ params }: Props) {
   const router = useRouter()

   const [order, setOrder] = useState<Order | null>(null)
   const [orderItems, setOrderItems] = useState<OrderItem[]>([])
   const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
   const [billingAddress, setBillingAddress] = useState<Address | null>(null)
   // store parsed order id so other handlers can access it safely
   const [orderId, setOrderId] = useState<number | null>(null)
   const [loading, setLoading] = useState(true)
   const [updating, setUpdating] = useState(false)
   const [updatingStatus, setUpdatingStatus] = useState(false)

   useEffect(() => {
      const parsedId = parseInt(params.id)
      setOrderId(parsedId)

      const fetchData = async () => {
         try {
            const response = await fetch(`/api/admin/orders/${parsedId}`)
            const data = await response.json()

            if (response.ok) {
               setOrder(data.order)
               setOrderItems(data.orderItems)
               setShippingAddress(data.shippingAddress)
               setBillingAddress(data.billingAddress)
            } else {
               showAlert({
                  message: data.error || 'Failed to fetch order details',
                  variant: 'error',
               })
            }
         } catch (error) {
            logger.error('Error fetching order details', error)
            showAlert({ message: 'Failed to fetch order details', variant: 'error' })
         } finally {
            setLoading(false)
         }
      }

      fetchData()
   }, [params.id, router])

   const updatePaymentStatus = async () => {
      if (!order || orderId === null) return

      setUpdating(true)

      try {
         const response = await fetch(`/api/admin/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               paymentStatus: 'successful',
            }),
         })

         const data = await response.json()

         if (response.ok) {
            setOrder({
               ...order,
               paymentStatus: 'successful',
               updatedAt: new Date().toISOString(),
            })
            showAlert({
               message: 'Payment status updated to paid successfully!',
               variant: 'success',
            })
         } else {
            showAlert({
               message: data.error || 'Failed to update payment status',
               variant: 'error',
            })
         }
      } catch (error) {
         logger.error('Error updating payment status', error)
         showAlert({ message: 'Failed to update payment status', variant: 'error' })
      } finally {
         setUpdating(false)
      }
   }

   const updateOrderStatus = async (newStatus: string) => {
      if (!order || orderId === null) return

      setUpdatingStatus(true)

      try {
         const response = await fetch(`/api/admin/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               status: newStatus,
            }),
         })

         const data = await response.json()

         if (response.ok) {
            setOrder({
               ...order,
               status: newStatus,
               updatedAt: new Date().toISOString(),
            })
            showAlert({
               message: `Order status updated to ${newStatus} successfully!`,
               variant: 'success',
            })
         } else {
            showAlert({ message: data.error || 'Failed to update order status', variant: 'error' })
         }
      } catch (error) {
         logger.error('Error updating order status', error)
         showAlert({ message: 'Failed to update order status', variant: 'error' })
      } finally {
         setUpdatingStatus(false)
      }
   }

   if (loading) {
      return <div className="text-center">Loading order details...</div>
   }

   if (!order) {
      return (
         <div className="flex flex-col items-center gap-4 py-10">
            <p className="text-rose-600 text-xl">Failed to load order</p>
            <div className="flex flex-wrap gap-3">
               <Link href="/super-admin/orders">
                  <Button variant="secondary">
                     <ArrowLeft className="mr-2 size-4" />
                     Back to Orders
                  </Button>
               </Link>
            </div>
         </div>
      )
   }

   const getStatusBadgeVariant = (status: string) => {
      switch (status?.toLowerCase()) {
         case 'completed':
            return 'default' // Green - final state
         case 'delivered':
            return 'default' // Green - delivered
         case 'shipped':
            return 'outline' // Blue - in transit
         case 'pending':
            return 'secondary' // Gray - waiting
         case 'cancelled':
            return 'destructive' // Red - cancelled
         default:
            return 'secondary'
      }
   }

   const getPaymentBadgeVariant = (status: string) => {
      switch (status?.toLowerCase()) {
         case 'successful':
            return 'default'
         case 'pending':
            return 'secondary'
         case 'failed':
            return 'destructive'
         case 'refunded':
            return 'outline'
         default:
            return 'secondary'
      }
   }

   return (
      <main>
         {/* Header */}
         <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <div>
               <Link href="/admin/orders">
                  <Button variant="ghost" className="mb-2">
                     ← Back to Orders
                  </Button>
               </Link>
               <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
               <p className="text-gray-600 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString()}
               </p>
            </div>
            <div className="flex gap-2">
               <Badge variant={getPaymentBadgeVariant(order.paymentStatus)}>
                  Payment: {order.paymentStatus}
               </Badge>
               <Badge variant={getStatusBadgeVariant(order.status)}>Order: {order.status}</Badge>
            </div>
         </div>

         {/* Quick Actions Section */}
         <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
               {/* Payment Actions */}
               <div className="flex items-center gap-3">
                  {order.paymentStatus === 'pending' ? (
                     <Button
                        onClick={updatePaymentStatus}
                        disabled={updating || updatingStatus}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                     >
                        {updating ? (
                           <>
                              <Spinner className="animate-spin mr-1 h-3 w-3" />
                              Updating...
                           </>
                        ) : (
                           'Mark Payment as Paid'
                        )}
                     </Button>
                  ) : (
                     <div className="text-sm text-green-600 font-medium">Payment: Paid ✓</div>
                  )}
               </div>

               <Separator orientation="vertical" className="h-6 hidden sm:block" />

               {/* Order Status Actions */}
               <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Mark Order as:</span>
                  <Select
                     value={order.status}
                     onValueChange={updateOrderStatus}
                     disabled={updating || updatingStatus}
                  >
                     <SelectTrigger className="w-32">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Products and Total */}
            <div className="space-y-6">
               {/* Order Items */}
               <Card>
                  <CardHeader>
                     <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {orderItems.map((item) => (
                           <div
                              key={item.id}
                              className="flex items-center gap-4 p-4 border rounded-lg"
                           >
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                 {item.productImage ? (
                                    <Image
                                       src={item.productImage}
                                       alt={item.productTitle || 'Product'}
                                       width={64}
                                       height={64}
                                       className="w-full h-full object-cover"
                                    />
                                 ) : (
                                    <div className="text-gray-400 text-xs">No Image</div>
                                 )}
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-medium">
                                    {item.productTitle || 'Unknown Product'}
                                 </h4>
                                 <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                 <p className="text-sm text-gray-600">
                                    Unit Price: {formatPKR(item.unitPrice)}
                                 </p>
                              </div>
                              <div className="text-right">
                                 <p className="font-semibold">
                                    {formatPKR(item.unitPrice * item.quantity)}
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>

               {/* Order Total */}
               <Card>
                  <CardHeader>
                     <CardTitle>Order Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <span className="text-gray-600">Subtotal:</span>
                           <span>{formatPKR(order.totalAmount)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center text-lg font-semibold">
                           <span>Total:</span>
                           <span>{formatPKR(order.totalAmount)}</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Right Column - Customer Info & Addresses */}
            <div className="space-y-6">
               {/* Customer Info */}
               <Card>
                  <CardHeader>
                     <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-2">
                        <div>
                           <p className="font-medium">{order.userName || 'N/A'}</p>
                           <p className="text-sm text-gray-600">{order.userEmail}</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Payment Info */}
               <Card>
                  <CardHeader>
                     <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-2">
                        <div className="flex justify-between">
                           <span className="text-gray-600">Status:</span>
                           <Badge
                              variant={getPaymentBadgeVariant(order.paymentStatus)}
                              className="text-xs"
                           >
                              {order.paymentStatus}
                           </Badge>
                        </div>
                        <div className="flex justify-between font-semibold">
                           <span>Total:</span>
                           <span>{formatPKR(order.totalAmount)}</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Shipping Address */}
               {shippingAddress && (
                  <Card>
                     <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="text-sm space-y-1">
                           <p className="font-medium">{shippingAddress.fullName}</p>
                           <p>{shippingAddress.addressLine1}</p>
                           {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                           <p>
                              {shippingAddress.city}, {shippingAddress.state}
                           </p>
                           {shippingAddress.postalCode && <p>{shippingAddress.postalCode}</p>}
                           <p>{shippingAddress.country}</p>
                           <p className="text-gray-600">Phone: {shippingAddress.phone}</p>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* Billing Address */}
               {billingAddress && billingAddress.id !== shippingAddress?.id && (
                  <Card>
                     <CardHeader>
                        <CardTitle>Billing Address</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="text-sm space-y-1">
                           <p className="font-medium">{billingAddress.fullName}</p>
                           <p>{billingAddress.addressLine1}</p>
                           {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
                           <p>
                              {billingAddress.city}, {billingAddress.state}
                           </p>
                           {billingAddress.postalCode && <p>{billingAddress.postalCode}</p>}
                           <p>{billingAddress.country}</p>
                           <p className="text-gray-600">Phone: {billingAddress.phone}</p>
                        </div>
                     </CardContent>
                  </Card>
               )}
            </div>
         </div>
      </main>
   )
}

export default AdminOrderDetailsPage
